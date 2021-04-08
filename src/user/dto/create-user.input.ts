import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsOptional } from 'class-validator';

@InputType()
export class CreateUserInput {
  @Field()
  telegramId?: number;

  @Field()
  nickName: string;

  @Field({ defaultValue: '' })
  @IsOptional()
  firstName?: string;

  @Field({ defaultValue: '' })
  @IsOptional()
  lastName?: string;

  @Field()
  @IsEmail()
  email?: string;
}