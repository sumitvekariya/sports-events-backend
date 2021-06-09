import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { CreateEventInput, PaginationInputType } from "./dto/create-event.input";
import { EventService } from "./event.service";
import { EventType, EventTypeWithCount } from "./event.type";

@Resolver()
export class EventResolver {

    constructor(private eventService: EventService) {}

    @Query(() => EventTypeWithCount)
    async getAllEvents(
        @Args('PaginationInputType') PaginationInputType: PaginationInputType
    ) {
        const skip = PaginationInputType.skip || 1;
        const limit = PaginationInputType.limit || 10;
        const data = await this.eventService.getAllWithCount(skip, limit);
        return { totalCount: data['totalCount'], result: data['result'] }
    }

    @Mutation(() => EventType)
    async createEvent(
        @Args('createEventInput') CreateEventInput: CreateEventInput
    ) {
        const post = this.eventService.create(CreateEventInput);
        return post;   
    }

}