import { Field, InputType } from "@nestjs/graphql";
import { IsArray, IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

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

  @IsOptional()
  @IsString()
  @Field()
  playerId: string;

  @IsNotEmpty()
  @IsNumber()
  @Field()
  isAdd: number;

  @IsOptional()
  @IsString()
  @Field()
  userName: string;
}

@InputType()
export class InviteUninvitePlayersInput {
  @IsNotEmpty()
  @IsString()
  @Field()
  eventId: string;

  @IsNotEmpty()
  @Field(() => [Users])
  users: [Users];
}

@InputType()
export class Users {
  @IsNotEmpty()
  @IsString()
  @Field()
  userId: string;

  @IsNotEmpty()
  @IsNumber()
  @Field()
  isInvite: number;
}

@InputType()
export class AcceptDeclineInvitationInput {
  @IsNotEmpty()
  @IsString()
  @Field()
  eventId: string;

  @IsNotEmpty()
  @IsNumber()
  @Field()
  isAccept: number;
}