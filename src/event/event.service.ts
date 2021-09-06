import { Inject, Injectable } from "@nestjs/common";
import { CreateEventInput, UpdateEventInput } from "./dto/create-event.input";
import { EventType } from "./event.type";

@Injectable()
export class EventService {
    private rethinkService;

    constructor(@Inject('RethinkService') service) {
        this.rethinkService = service;
    }

    async create(userId: string, CreateEventInput: CreateEventInput) {
      const uuid = await this.rethinkService.generateUID();
      const event = {
        ...CreateEventInput,
        id: uuid,
        owner: userId,
        lat: "48.3794",
        long: "31.1656"
      };

      const { inserted, changes } = await this.rethinkService.saveDB(
        'events',
        event,
      );
      if (inserted) {
        return changes[0].new_val;
      } else {
        throw Error('Event was not created');
      }
    }
    
    async getAllWithCount(filter: any, skip: number,limit: number, betweenRange: any): Promise<{ result: EventType, totalCount: number}> {
      let result = await this.rethinkService.getDataWithPagination('events', filter, skip, limit, betweenRange);
      const totalCount = await this.rethinkService.getTotalCount('events', filter);

      // TODO:: query is not working that's why. filter based on between ragne
      if (betweenRange && betweenRange.start && betweenRange.end) {
        result = result.filter((event) => {
          return event.startDate >= betweenRange.start && event.endDate && event.endDate <= betweenRange.end
        })
      }
      return { result, totalCount };
    }

    async update(updateEventInput: UpdateEventInput) {
      const { id, ...rest } = updateEventInput;
      const { replaced, changes } = await this.rethinkService.updateDB(
        'events',
        id,
        updateEventInput,
      );
      if (replaced) {
        return changes[0].new_val;
      } else {
        throw Error('Error while updating a events');
      }
    }
    
    async remove(userId: string, id: string) {
      const eventData = await this.rethinkService.getByID('events', id);
      if (eventData && userId === eventData.owner) {
        const { deleted } = await this.rethinkService.removeDB('events', id);
        if (deleted) {
          return true;
        } else {
          throw Error('Error while deleting a events');
        }
      } else {
        return false;
      }
    }

    async getEventDetail(id:string) {
      const result = await this.rethinkService.getByID('events', id);
      return result;
    }

    async subscribe(subAction: string) {
      return this.rethinkService.getSubscription(subAction, 'events');
    }
}