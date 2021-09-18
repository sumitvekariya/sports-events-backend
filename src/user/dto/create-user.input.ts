import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsOptional } from 'class-validator';

@InputType()
export class CreateUserInput {
  @Field({ nullable: true })
  telegramId?: number;

  @Field({ nullable: true })
  nickName?: string;

  @Field({ nullable: true })
  @IsOptional()
  firstName?: string;

  @Field({ nullable: true })
  @IsOptional()
  lastName?: string;

  @Field({ nullable: true })
  @IsEmail()
  email?: string;

  @Field(() => [String], { nullable: true })
  positions?: [string];
}