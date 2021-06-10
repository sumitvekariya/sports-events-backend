import { Query } from '@nestjs/common';
import { ObjectType, Field, Int } from '@nestjs/graphql';
import { UserType } from 'src/user/user.type';

@ObjectType('Event')
export class EventType {
    @Field()
    id: string;

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

    @Field()
    owner: string;
}

@ObjectType()
export class EventTypeWithCount {
    @Field()
    totalCount: number

    @Field(type => [EventType])
    result: []
}
