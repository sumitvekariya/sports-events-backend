import { Inject, Injectable } from "@nestjs/common";
import { CreateEventInput } from "./dto/create-event.input";

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
    
    async getAll() {
      const result = await this.rethinkService.getDB('events');
      return result;
    }
}