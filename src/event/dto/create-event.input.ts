import { InputType, Field, Int } from '@nestjs/graphql';
import { MinLength } from 'class-validator';

@InputType()
export class CreateEventInput {
  @MinLength(1)
  @Field()
  name: string;

  @Field()
  date: string;

  @Field()
  startTime: string;

  @Field(type => Int)
  duration: number;

  @Field()
  field: string;

  @Field()
  team: string;
  
}
