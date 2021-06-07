import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { CreateEventInput } from "./dto/create-event.input";
import { EventService } from "./event.service";
import { EventType } from "./event.type";

@Resolver()
export class EventResolver {

    constructor(private eventService: EventService) {}

    @Query(() => [EventType])
    getAllEvents() {
      return this.eventService.getAll();
    }

    @Mutation(() => EventType)
    async createEvent(
        @Args('createEventInput') CreateEventInput: CreateEventInput,
    ) {
        const post = this.eventService.create(CreateEventInput);
        return post;
    }

}