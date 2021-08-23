import { InputType, Field, PartialType, ID } from '@nestjs/graphql';
import { IsNumber, IsUUID } from 'class-validator';

@InputType()
export class FollowUnfollowInput{
  @Field(() => String)
  @IsUUID()
  userId: string;

  @Field(() => Number)
  @IsNumber()
  isFollow: number;
}
