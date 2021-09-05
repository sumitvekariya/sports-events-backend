import { UseGuards } from "@nestjs/common";
import { Query, Args, Mutation, Resolver, Subscription } from "@nestjs/graphql";
import { CtxUser } from "src/user/decorators/ctx-user.decorator";
import { GqlAuthGuard } from "src/user/guards/gql-auth.guard";
import { UserType } from "src/user/user.type";
import { AcceptDeclineInvitationInput, AddPlayerEventInput, InviteUninvitePlayersInput, JoinEventInput, LeaveEventInput, UpdatePositionInput } from "./dto/event-player.dto";
import { EventPlayerService } from "./event-player.service";
import { JoinEventType, LeaveEventType, EventPlayerList, UpdatePositionType } from "./event-player.type";

@Resolver()
export class EventPlayerResolver {
  constructor(private eventPlayerService: EventPlayerService) {}

  @Mutation(() => JoinEventType)
  @UseGuards(GqlAuthGuard)
  async joinEvent(
    @CtxUser() user: UserType,
    @Args('joinEventInput') joinEventInput: JoinEventInput
  ) {
    const eventJoin = await this.eventPlayerService.create(user.id, joinEventInput);
    return {...eventJoin, positions: user.positions || []};
  }

  @Mutation(() => LeaveEventType)
  @UseGuards(GqlAuthGuard)
  async leaveEvent(
    @CtxUser() user: UserType,
    @Args('leaveEventInput') leaveEventInput: LeaveEventInput
  ) {
    const leaveEvent = await this.eventPlayerService.remove(user.id, leaveEventInput.eventId);

    if (leaveEvent) {
    return { message: 'You successfully left the event.' }
    } else {
      return { message: "Please join event first" }
    }
  }
    
  @Query(() => [EventPlayerList])
  @UseGuards(GqlAuthGuard)
  async getPlayerList(
      @CtxUser() user: UserType,
      @Args('eventId') eventId: string
  ) {
      const result = await this.eventPlayerService.getPlayerDetail(eventId);
      return result
  }
  
  @Mutation(() => UserType)
  @UseGuards(GqlAuthGuard)
  async updatePosition(
    @CtxUser() user: UserType,
    @Args('updatePositionInput') updatePositionInput: UpdatePositionInput
  ) {
    try {
      const updatePositions = await this.eventPlayerService.update(user.id, updatePositionInput);
  
      if (updatePositions) {
        return updatePositions
      } else {
        return { message: 'Error in position update' }
      }
    } catch(err) {
      console.log(err);
    }
  }

  @Subscription(() => UpdatePositionType, {
    name: 'eventPlayerChanges',
  })
  eventPlayerChanges() {
    return this.eventPlayerService.subscribe('eventPlayerChanges');
  }

  @Mutation(() => UserType)
  @UseGuards(GqlAuthGuard)
  async addRemovePlayerToEvent(
    @CtxUser() user: UserType,
    @Args('addPlayerEventInput') addPlayerEventInput: AddPlayerEventInput
  ) {
    const eventJoin = await this.eventPlayerService.addRemovePlayer(user.id, addPlayerEventInput);
    return eventJoin;
  }

  @Query(() => [UserType])
  @UseGuards(GqlAuthGuard)
  async getFriendsEnrolledInEvent(
      @CtxUser() user: UserType,
      @Args('eventId') eventId: string
  ) {
      const result = await this.eventPlayerService.getFriendsEnrolledInEvent(user.id, eventId);
      return result
  }

  @Mutation(() => String)
  @UseGuards(GqlAuthGuard)
  async inviteUninvitePlayers(
      @CtxUser() user: UserType,
      @Args('inviteUninvitePlayersInput') inviteUninvitePlayersInput: InviteUninvitePlayersInput
  ) {
      const result = await this.eventPlayerService.inviteUninvitePlayers(user.id, inviteUninvitePlayersInput);
      return result
  }

  @Mutation(() => String)
  @UseGuards(GqlAuthGuard)
  async acceptDeclineInvitation(
      @CtxUser() user: UserType,
      @Args('acceptDeclineInvitationInput') acceptDeclineInvitationInput: AcceptDeclineInvitationInput
  ) {
      const result = await this.eventPlayerService.acceptDeclineInvitation(user.id, acceptDeclineInvitationInput);
      return result
  }
}