import { SetMetadata, UseGuards } from "@nestjs/common";
import { Args, Mutation, Query, Resolver, Subscription } from "@nestjs/graphql";
import { CtxUser } from "src/user/decorators/ctx-user.decorator";
import { Roles } from "src/user/decorators/roles.decorator";
import { GqlAuthGuard } from "src/user/guards/gql-auth.guard";
import { RolesGuard } from "src/user/guards/role-auth.guard";
import { UserType } from "src/user/user.type";
import { CreateEventInput, PaginationInputType, UpdateEventInput, GetEventDetailInput } from "./dto/create-event.input";
import { EventService } from "./event.service";
import { EventType, EventTypeWithCount } from "./event.type";

@Resolver()
export class EventResolver {

    constructor(private eventService: EventService) {}

    @Query(() => EventTypeWithCount)
    // @UseGuards(GqlAuthGuard)
    async getAllEvents(
        @CtxUser() user: UserType,
        @Args('PaginationInputType') PaginationInputType: PaginationInputType
    ) {
        const skip = PaginationInputType.skip || 1;
        const limit = PaginationInputType.limit || 10;
        let filter = {};
        if (PaginationInputType.city) {
            filter['city'] = PaginationInputType.city;
        }
        if (PaginationInputType.type) {
            filter['type'] = PaginationInputType.type;
        }
        // if (user && user.id) {
        //     filter['owner'] = user.id;
        // }

        const data = await this.eventService.getAllWithCount(filter, skip, limit);
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

    @Query(() => EventType)
    @UseGuards(GqlAuthGuard)
    async getEventDetail(
        @CtxUser() user: UserType,
        @Args('GetEventDetailInput') GetEventDetailInput: GetEventDetailInput
    ) {
        const result = await this.eventService.getEventDetail(GetEventDetailInput.id);
        return result
    }

    // TODO:: add auth guard in subscription.
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
    async removeEvent(@CtxUser() user: UserType, @Args('eventId') eventId: string) {
        const removedData = await this.eventService.remove(user.id, eventId);
        console.log(removedData)
        if (removedData) {
            return 'Event deleted successfully'
        } else {
            return 'You can\'t delete other\'s event.'
        }
    }
}