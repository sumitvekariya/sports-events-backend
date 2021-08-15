import { Field, InputType } from "@nestjs/graphql";
import { IsBoolean, IsNotEmpty, IsString } from "class-validator";

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