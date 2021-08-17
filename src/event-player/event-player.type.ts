import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class JoinEventType {
  @Field({ nullable: true })
  id: string;
  
  @Field({ nullable: true })
  eventId: string;

  @Field({ nullable: true })
  playerId: string;

  @Field({ nullable: true })
  status: string;

  @Field({ nullable: true })
  message?: string;
}

@ObjectType()
export class LeaveEventType {
  @Field({ nullable: true })
  id: string;
  
  @Field({ nullable: true })
  eventId: string;

  @Field({ nullable: true })
  playerId: string;

  @Field({ nullable: true })
  status: string;

  @Field({ nullable: true })
  message?: string;
}

@ObjectType()
export class EventPlayerList {
  @Field({ nullable: true })
  id: string;
  
  @Field({ nullable: true })
  eventId: string;

  @Field({ nullable: true })
  playerId: string;

  @Field({ nullable: true })
  status: string;

  @Field({ nullable: true })
  firstName?: string;

  @Field({ nullable: true })
  lastName?: string;

  @Field({ nullable: true })
  nickName?: string;

  @Field(() => [String], { nullable: true })
  positions: [string];
}

@ObjectType()
export class UpdatePositionType {
  @Field({ nullable: true })
  message: string;

  @Field({ nullable: true })
  playerId: string;
}