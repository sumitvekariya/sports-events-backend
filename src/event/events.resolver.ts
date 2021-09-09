import { SetMetadata, UseGuards } from "@nestjs/common";
import { Args, Mutation, Query, Resolver, Subscription } from "@nestjs/graphql";
import { CtxUser } from "src/user/decorators/ctx-user.decorator";
import { Roles } from "src/user/decorators/roles.decorator";
import { GqlAuthGuard } from "src/user/guards/gql-auth.guard";
import { RolesGuard } from "src/user/guards/role-auth.guard";
import { UserType } from "src/user/user.type";
import { CreateEventInput, PaginationInputType, UpdateEventInput, GetEventDetailInput, LeaveJoinEventInput, GetEventByUserInput } from "./dto/create-event.input";
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
        let betweenRange = {};
        if (PaginationInputType.city) {
            filter['city'] = PaginationInputType.city;
        }
        if (PaginationInputType.type) {
            filter['type'] = PaginationInputType.type;
        }
        if (PaginationInputType.sportType) {
            filter['sportType'] = PaginationInputType.sportType;
        }
        if ('isIndoor' in PaginationInputType) {
            filter['isIndoor'] = PaginationInputType.isIndoor ? 1 : 0;
        }

        if (PaginationInputType.teamSize) {
            filter['teamSize'] = PaginationInputType.teamSize;
        }

        if (PaginationInputType.startTime) {
            filter['startTime'] = PaginationInputType.startTime;
        }
            // if (user && user.id) {
        //     filter['owner'] = user.id;
        // }
        
        if ('startDate' in PaginationInputType && PaginationInputType.startDate) {
            filter['startDate'] = new Date(PaginationInputType.startDate)
        }

        if (PaginationInputType.startDate && PaginationInputType.endDate) {
            betweenRange['start'] = PaginationInputType.startDate === 0 ? 0 : new Date(PaginationInputType.startDate);
            betweenRange['end'] = PaginationInputType.endDate === 0 ? 0 : new Date(PaginationInputType.endDate);
            delete filter['startDate'];
        }

        const data = await this.eventService.getAllWithCount(filter, skip, limit, betweenRange);
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
        let filter = {
            owner: user.id
        };

        let betweenRange = {};

        if (PaginationInputType.city) {
            filter['city'] = PaginationInputType.city;
        }
        if (PaginationInputType.type) {
            filter['type'] = PaginationInputType.type;
        }
        if (PaginationInputType.sportType) {
            filter['sportType'] = PaginationInputType.sportType;
        }
        if ('isIndoor' in PaginationInputType) {
            filter['isIndoor'] = PaginationInputType.isIndoor ? 1 : 0;
        }

        if (PaginationInputType.teamSize) {
            filter['teamSize'] = PaginationInputType.teamSize;
        }

        if (PaginationInputType.startTime) {
            filter['startTime'] = PaginationInputType.startTime;
        }

        if ('startDate' in PaginationInputType && PaginationInputType.startDate) {
            filter['startDate'] = new Date(PaginationInputType.startDate)
        }

        if (PaginationInputType.startDate && PaginationInputType.endDate) {
            betweenRange['start'] = PaginationInputType.startDate === 0 ? 0 : new Date(PaginationInputType.startDate);
            betweenRange['end'] = PaginationInputType.endDate === 0 ? 0 : new Date(PaginationInputType.endDate);
            delete filter['startDate'];
        }
        
        const data = await this.eventService.getAllWithCount(filter, skip, limit, betweenRange, user.id);
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
        if (removedData) {
            return 'Event deleted successfully'
        } else {
            return 'You can\'t delete other\'s event.'
        }
    }

    @Query(() => EventTypeWithCount)
    @UseGuards(GqlAuthGuard)
    async getEventByUserId(
        @CtxUser() user: UserType,
        @Args('getEventByUserInput') getEventByUserInput: GetEventByUserInput
    ) {
        const skip = getEventByUserInput.skip || 1;
        const limit = getEventByUserInput.limit || 10;

        let filter = {
            owner: getEventByUserInput.userId
        };
        const data = await this.eventService.getAllWithCount(filter, skip, limit, null, getEventByUserInput.userId);
        return { totalCount: data['totalCount'], result: data['result'] }
    }
}