import { InputType, Field, Int, ID } from '@nestjs/graphql';
import { IsBoolean, IsEmpty, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, MinLength } from 'class-validator';

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

  @Field({ nullable: true })
  endDate?: Date;

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
  limit!: number;

  @Field({ nullable: true })
  city?: string;

  @Field({ nullable: true })
  startDate?: number;

  @Field({ nullable: true })
  endDate?: number;

  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  type?: string;

  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  followedBy?: string;

  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  sportType?: string;

  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  startTime?: string;

  @IsOptional()
  @IsBoolean()
  @Field({ nullable: true })
  isIndoor?: boolean;

  @IsOptional()
  @IsBoolean()
  @Field({ nullable: true })
  isOutdoor?: boolean;

  @IsOptional()
  @IsBoolean()
  @Field({ nullable: true })
  openToJoin?: boolean;

  @IsOptional()
  @IsNumber()
  @Field({ nullable: true })
  teamSize?: number;
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

  @Field({ nullable: true })
  endDate?: Date;

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
export class GetEventDetailInput {
 
  @IsNotEmpty()
  @Field(() => ID)
  id: string;

}
@InputType()
export class LeaveJoinEventInput {
  @IsNotEmpty()
  @Field(() => ID)
  eventId: string;

  @IsNotEmpty()
  @Field()
  isJoin: string;
}