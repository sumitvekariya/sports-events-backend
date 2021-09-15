import { Resolver, Mutation, Args, Query, Subscription } from '@nestjs/graphql';
import { UpdateUserInput } from './dto/update-user.input';
import { UserService } from './user.service';
import { NotificationChangeOutput, NotificationType, UserFriendsType, UserProfileType, UserType } from './user.type';
import { AuthLoginInput } from './dto/auth-login.input';
import { UserTokenType } from './user-token.type';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from './guards/gql-auth.guard';
import { FollowUnfollowInput } from './dto/follow-unfollow.input';
import { CtxUser } from './decorators/ctx-user.decorator';
import { AddRemoveFriendInput } from './dto/add-remove-friend.input';
import { AcceptDeclineRequestInput } from './dto/accept-declint-request.intput';

@Resolver((of) => UserType)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @UseGuards(GqlAuthGuard)
  @Query(() => [UserType])
  getUsers() {
    return this.userService.getAll();
  }

  // @UseGuards(GqlAuthGuard)
  // @Query(() => UserType)
  // getUser(@Args('id') id: string) {
  //   return this.userService.getOne(id);
  // }

  @UseGuards(GqlAuthGuard)
  @Query(() => UserType)
  getProfile(@Args('id') id: string) {
    return this.userService.getOne(id);
  }

  @Mutation(() => UserTokenType)
  login(@Args('authLoginInput') authLoginInput: AuthLoginInput) {
    return this.userService.login(authLoginInput);
  }

  // @Mutation(() => UserTokenType)
  // register(@Args('authRegisterInput') authRegisterInput: AuthRegisterInput) {
  //   return this.userService.register(authRegisterInput);
  // }

  // @UseGuards(GqlAuthGuard)
  // @Mutation(() => UserType)
  // createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
  //   return this.userService.create(createUserInput);
  // }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => UserType)
  updateUser(@Args('updateUserInput') updateUserInput: UpdateUserInput) {
    return this.userService.update(updateUserInput);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => UserType)
  removeUser(@Args('id') id: string) {
    return this.userService.remove(id);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => UserProfileType)
  getUserProfile(
    @CtxUser() user: UserType,
    @Args('id') id: string
  ) {
    return this.userService.getUserProfile(user.id, id);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => String)
  followUser(
    @CtxUser() user: UserType,
    @Args('followUnfollowInput') followUnfollowInput: FollowUnfollowInput
  ) {
    return this.userService.followUser(user.id, followUnfollowInput);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => [UserType])
  getMyFollowers(
    @CtxUser() user: UserType
  ) {
    return this.userService.getFollowers(user.id);
  }

  @Subscription(() => UserType, {
    name: 'userChanges',
  })
  userChanges() {
    return this.userService.subscribe('userChanges', 'users');
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => String)
  addRemoveFriend(
    @CtxUser() user: UserType,
    @Args('addRemoveFriendInput') addRemoveFriendInput: AddRemoveFriendInput
  ) {
    return this.userService.addRemoveFriendInput(user.id, addRemoveFriendInput);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => UserFriendsType)
  getMyFriends(
    @CtxUser() user: UserType,
    @Args('eventId') eventId: string
  ) {
    return this.userService.getFriends(user.id, eventId);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => [UserType])
  getFollowedByMe(
    @CtxUser() user: UserType
  ) {
    return this.userService.getMyFollowing(user.id);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => [UserType])
  getFriendsWithMe(
    @CtxUser() user: UserType
  ) {
    return this.userService.getFriendsWithMe(user.id);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => [UserType])
  getAllUserList(
    @CtxUser() user: UserType
  ) {
    return this.userService.getAllUserList(user.id);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => [NotificationType])
  getAllNotifications(
    @CtxUser() user: UserType,
    @Args('isRead') isRead: number,
    @Args('userId') userId: string
  ) {
    isRead = isRead || 0;
    userId = userId || user.id;

    return this.userService.getNotificationList(userId, isRead);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => String)
  approveDeclineRequest(
    @CtxUser() user: UserType,
    @Args('acceptDeclineRequestInput') acceptDeclineRequestInput: AcceptDeclineRequestInput
  ) {
    return this.userService.approveDeclineRequest(user.id, acceptDeclineRequestInput);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => String)
  markReadAllNotifications(
    @CtxUser() user: UserType,
  ) {
    return this.userService.markReadAllNotifications(user.id);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => [UserType])
  getFollowingByUserId(
    @CtxUser() user: UserType,
    @Args('userId') userId: String
  ) {
    return this.userService.getMyFollowing(userId);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => [UserType])
  getFollowersByUserId(
    @CtxUser() user: UserType,
    @Args('userId') userId: String
  ) {
    return this.userService.getFollowers(userId);
  }

  @Subscription(() => NotificationChangeOutput, {
    name: 'notificationChanges',
  })
  notificationChanges() {
    return this.userService.subscribe('notificationChanges', 'notifications');
  }
}
