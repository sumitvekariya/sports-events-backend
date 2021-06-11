import { InputType, Field, Int } from '@nestjs/graphql';
import { IsNotEmpty, IsNumber, IsOptional, IsString, MinLength } from 'class-validator';

@InputType()
export class CreateEventInput {
  @IsNotEmpty()
  @Field()
  name: string;

  @IsNotEmpty()
  @Field()
  date: Date;

  @IsNotEmpty()
  @Field()
  startTime: string;

  @IsNotEmpty()
  @Field(type => Int)
  duration: number;

  @IsNotEmpty()
  @Field()
  field: string;

  @IsNotEmpty()
  @Field()
  team: string;
  
}

@InputType()
export class PaginationInputType {
 
  @IsNotEmpty()
  @IsNumber()
  @Field()
  skip: number;

  @IsNotEmpty()
  @IsNumber()
  @Field()
  limit: number;

}