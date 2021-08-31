import { Field, InputType } from "@nestjs/graphql";
import { IsArray, IsBoolean, IsNotEmpty, IsNumber, IsString } from "class-validator";

@InputType()
export class JoinEventInput {
  @IsNotEmpty()
  @IsString()
  @Field()
  eventId: string;
}

@InputType()
export class LeaveEventInput {
  @IsNotEmpty()
  @IsString()
  @Field()
  eventId: string;
}

@InputType()
export class UpdatePositionInput {
  @Field(() => [String], { nullable: true })
  positions: [string];
}

@InputType()
export class AddPlayerEventInput {
  @IsNotEmpty()
  @IsString()
  @Field()
  eventId: string;

  @IsNotEmpty()
  @IsString()
  @Field()
  playerId: string;

  @IsNotEmpty()
  @IsNumber()
  @Field()
  isAdd: number;
}