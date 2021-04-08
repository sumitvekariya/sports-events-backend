import { Field, ObjectType } from '@nestjs/graphql';
import { UserType } from './user.type';

@ObjectType('UserToken')
export class UserTokenType {
  @Field()
  token: string;

  @Field()
  user: UserType;
}