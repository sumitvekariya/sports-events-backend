import { CreateUserInput } from './create-user.input';
import { InputType, Field, PartialType, ID } from '@nestjs/graphql';
import { IsString, IsUUID } from 'class-validator';

@InputType()
export class UpdateUserInput extends PartialType(CreateUserInput) {
  @Field({ nullable: true })
  @IsString()
  name: string;

  @Field({ nullable: true })
  @IsString()
  city: string;

  @Field({ nullable: true })
  @IsString()
  bio: string;
}
