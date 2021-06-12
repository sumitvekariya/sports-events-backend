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
        owner: userId
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
    
    async getAllWithCount(filter: any, skip: number,limit: number): Promise<{ result: EventType, totalCount: number}> {
      const result = await this.rethinkService.getDataWithPagination('events', filter, skip, limit);
      const totalCount = await this.rethinkService.getTotalCount('events');
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
    
    async remove(id: string) {
      const { deleted } = await this.rethinkService.removeDB('events', id);
      if (deleted) {
        return id;
      } else {
        throw Error('Error while deleting a events');
      }
    }

    async subscribe(subAction: string) {
      return this.rethinkService.getSubscription(subAction, 'events');
    }
}