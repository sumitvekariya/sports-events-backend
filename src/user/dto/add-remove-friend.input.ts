import { InputType, Field, PartialType, ID } from '@nestjs/graphql';
import { IsNumber, IsUUID } from 'class-validator';

@InputType()
export class AddRemoveFriendInput {
  @Field(() => String)
  @IsUUID()
  userId: string;

  @Field(() => Number)
  @IsNumber()
  addFriend: number;
}
