import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType('Event')
export class EventType {
    @Field()
    id: string;

    @Field()
    name: string;
  
    @Field()
    date: Date;
  
    @Field()
    startTime: string;

    @Field(type => Int)
    duration: number;

    @Field()
    field: string;

    @Field()
    team: string;
}