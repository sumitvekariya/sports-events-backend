import { Query } from '@nestjs/common';
import { ObjectType, Field, Int, EnumOptions } from '@nestjs/graphql';
import { UserType } from 'src/user/user.type';

@ObjectType('Event')
export class EventType {
    @Field()
    id: string;
    
    @Field()
    city: string;

    @Field()
    sportType: string;

    @Field()
    fieldType: string;

    @Field()
    description: string;

    @Field()
    startTime: string;

    @Field()
    startDate: string;

    @Field()
    endDate: string;

    @Field()
    endTime: string;

    @Field()
    teamSize: string;

    @Field()
    playerLimit: string;

    @Field()
    owner: string;

    @Field()
    status: string;

    @Field()
    type: string; // public or private

    @Field()
    isIndoor: number; // indoor = 1, outdoor = 0
}

@ObjectType()
export class EventTypeWithCount {
    @Field()
    totalCount: number

    @Field(type => [EventType])
    result: []
}
