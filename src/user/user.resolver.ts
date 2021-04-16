import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { UpdateUserInput } from './dto/update-user.input';
import { UserService } from './user.service';
import { UserType } from './user.type';
import { AuthLoginInput } from './dto/auth-login.input';
import { UserTokenType } from './user-token.type';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from './guards/gql-auth.guard';

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
}
