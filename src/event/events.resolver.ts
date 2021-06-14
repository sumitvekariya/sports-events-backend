import { UseGuards } from "@nestjs/common";
import { Args, Mutation, Query, Resolver, Subscription } from "@nestjs/graphql";
import { CtxUser } from "src/user/decorators/ctx-user.decorator";
import { GqlAuthGuard } from "src/user/guards/gql-auth.guard";
import { UserType } from "src/user/user.type";
import { CreateEventInput, PaginationInputType, UpdateEventInput } from "./dto/create-event.input";
import { EventService } from "./event.service";
import { EventType, EventTypeWithCount } from "./event.type";

@Resolver()
export class EventResolver {

    constructor(private eventService: EventService) {}

    @Query(() => EventTypeWithCount)
    @UseGuards(GqlAuthGuard)
    async getAllEvents(
        @Args('PaginationInputType') PaginationInputType: PaginationInputType
    ) {
        const skip = PaginationInputType.skip || 1;
        const limit = PaginationInputType.limit || 10;
        const data = await this.eventService.getAllWithCount({}, skip, limit);
        return { totalCount: data['totalCount'], result: data['result'] }
    }

    @Query(() => EventTypeWithCount)
    @UseGuards(GqlAuthGuard)
    async getMyEvents(
        @CtxUser() user: UserType,
        @Args('PaginationInputType') PaginationInputType: PaginationInputType
    ) {
        const skip = PaginationInputType.skip || 1;
        const limit = PaginationInputType.limit || 10;
        const data = await this.eventService.getAllWithCount({ owner: user.id }, skip, limit);
        return { totalCount: data['totalCount'], result: data['result'] }
    }

    @Subscription(() => EventType, {
        name: 'eventChanges',
      })
      eventChanges() {
        return this.eventService.subscribe('eventChanges');
      } 

    @Mutation(() => EventType)
    @UseGuards(GqlAuthGuard)
    async createEvent(
        @CtxUser() user: UserType,
        @Args('createEventInput') CreateEventInput: CreateEventInput
    ) {
        const post = this.eventService.create(user.id, CreateEventInput);
        return post;   
    }

    @Mutation(() => EventType)
    @UseGuards(GqlAuthGuard)
    async updateEvent(
        @Args('updateEventInput') UpdateEventInput: UpdateEventInput
    ) {
        const post = this.eventService.update(UpdateEventInput);
        return post;   
    }

    @Mutation(() => String)
    @UseGuards(GqlAuthGuard)
    removeEvent(@Args('eventId') eventId: string) {
        this.eventService.remove(eventId);
        return 'Event deleted successfully'
    }
}