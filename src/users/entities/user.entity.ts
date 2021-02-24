import { ObjectType, Field, Int } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';

@ObjectType()
export class User {
  @Field(() => Int)
  id: number;

  @Field({ nullable: true })
  @IsOptional()
  email?: string;

  @Field({ nullable: true })
  @IsOptional()
  nickName?: string;
}
