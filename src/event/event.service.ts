import { Inject, Injectable } from "@nestjs/common";
import { CreateEventInput } from "./dto/create-event.input";
import { EventType } from "./event.type";

@Injectable()
export class EventService {
    private rethinkService;

    constructor(@Inject('RethinkService') service) {
        this.rethinkService = service;
    }

    async create(CreateEventInput: CreateEventInput) {
      const uuid = await this.rethinkService.generateUID();
      const event = {
        ...CreateEventInput,
        id: uuid,
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
    
    async getAllWithCount(skip: number,limit: number): Promise<{ result: EventType, totalCount: number}> {
      const result = await this.rethinkService.getDataWithPagination('events', skip, limit);
      const totalCount = await this.rethinkService.getTotalCount('events');
      return { result, totalCount };
    }
}