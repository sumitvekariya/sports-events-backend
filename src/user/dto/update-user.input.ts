import { CreateUserInput } from './create-user.input';
import { InputType, Field, PartialType, ID, ObjectType } from '@nestjs/graphql';
import { IsOptional, IsString, IsUUID } from 'class-validator';

@InputType()
export class Links {
  @Field({ nullable: true })
  @IsString()
  title: string;

  @Field({ nullable: true })
  @IsString()
  url: string;
}

@InputType()
export class UpdateUserInput extends PartialType(CreateUserInput) {
  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  name: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  city: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  bio: string;

  @Field(() => [String], { nullable: true })
  hobbies: [String]

  @Field(() => [Links], { nullable: true })
  links: [Links]

  @Field({ nullable: true } )
  facebookUrl: string

  @Field({ nullable: true } )
  instagramUrl: string

  @Field({ nullable: true } )
  twitterUrl: string

  @Field({ nullable: true } )
  phoneNumber: string
}
