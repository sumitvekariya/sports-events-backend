import { Resolver, Mutation, Args, Query, Subscription } from '@nestjs/graphql';
import { UpdateUserInput } from './dto/update-user.input';
import { UserService } from './user.service';
import { UserType } from './user.type';
import { AuthLoginInput } from './dto/auth-login.input';
import { UserTokenType } from './user-token.type';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from './guards/gql-auth.guard';
import { FollowUnfollowInput } from './dto/follow-unfollow.input';
import { CtxUser } from './decorators/ctx-user.decorator';
import { AddRemoveFriendInput } from './dto/add-remove-friend.input';

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
  @Query(() => UserType)
  getUserProfile(@Args('id') id: string) {
    return this.userService.getUserProfile(id);
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
  @Query(() => [String])
  getFollowers(
    @CtxUser() user: UserType
  ) {
    return this.userService.getFollowers(user.id);
  }

  @Subscription(() => UserType, {
    name: 'userChanges',
  })
  userChanges() {
    return this.userService.subscribe('userChanges');
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
  @Query(() => [UserType])
  getFriends(
    @CtxUser() user: UserType
  ) {
    return this.userService.getFriends(user.id);
  }

}
