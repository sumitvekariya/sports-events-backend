import { InputType, Field, Int, ID } from '@nestjs/graphql';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, MinLength } from 'class-validator';

@InputType()
export class CreateEventInput {
  @IsNotEmpty()
  @IsString()
  @Field()
  city: string;

  @IsNotEmpty()
  @Field()
  sportType: string;

  @IsNotEmpty()
  @Field()
  fieldType: string;

  @IsNotEmpty()
  @Field()
  description: string;

  @IsNotEmpty()
  @Field()
  startTime: string;

  @IsNotEmpty()
  @Field()
  startDate: Date;

  @IsNotEmpty()
  @Field()
  endDate: Date;

  @IsNotEmpty()
  @Field()
  endTime: string;

  @IsNotEmpty()
  @Field(type => Int)
  teamSize: number;

  @IsNotEmpty()
  @Field(type => Int)
  playerLimit: number;

  @IsNotEmpty()
  @IsEnum(['draft', 'published'])
  @Field()
  status: string;
  
  @IsNotEmpty()
  @Field()
  type: string;

  @IsNotEmpty()
  @Field()
  isIndoor: number;
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

  @IsOptional()
  @IsString()
  @Field()
  city: string;

}

@InputType()
export class UpdateEventInput {
  @IsUUID()
  @Field(() => ID)
  id: string;
  
  @IsNotEmpty()
  @IsString()
  @Field()
  city: string;

  @IsNotEmpty()
  @Field()
  sportType: string;

  @IsNotEmpty()
  @Field()
  fieldType: string;

  @IsNotEmpty()
  @Field()
  description: string;

  @IsNotEmpty()
  @Field()
  startTime: string;

  @IsNotEmpty()
  @Field()
  startDate: Date;

  @IsNotEmpty()
  @Field()
  endDate: Date;

  @IsNotEmpty()
  @Field()
  endTime: string;

  @IsNotEmpty()
  @Field(type => Int)
  teamSize: number;

  @IsNotEmpty()
  @Field(type => Int)
  playerLimit: number;

  @IsNotEmpty()
  @IsEnum(['draft', 'published'])
  @Field()
  status: string;
  
  @IsNotEmpty()
  @Field()
  type: string;

  @IsNotEmpty()
  @Field()
  isIndoor: number;
}