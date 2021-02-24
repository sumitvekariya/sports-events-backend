import { InputType, Int, Field } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty } from 'class-validator';

@InputType()
export class CreateUserInput {
  @Field()
  @IsEmail()
  email?: string;

  @Field()
  @IsNotEmpty()
  password: string;

  @Field()
  nickName?: string;
}
