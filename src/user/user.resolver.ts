import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { UpdateUserInput } from './dto/update-user.input';
import { CreateUserInput } from './dto/create-user.input';
import { UserService } from './user.service';
import { UserType } from './user.type';

@Resolver(of => UserType)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => [UserType])
  getUsers() {
    return this.userService.getAll();
  }

  @Query(() => UserType)
  getUser(@Args('id') id: string) {
    return this.userService.getOne(id);
  }

  @Mutation(() => UserType)
  createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
    return this.userService.create(createUserInput);
  }

  @Mutation(() => UserType)
  updateUser(@Args('updateUserInput') updateUserInput: UpdateUserInput) {
    return this.userService.update(updateUserInput);
  }

  @Mutation(() => UserType)
  removeUser(@Args('id') id: string) {
    return this.userService.remove(id);
  }
}