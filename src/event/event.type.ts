import { Query } from '@nestjs/common';
import { ObjectType, Field, Int, EnumOptions } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';
import User from 'src/rethink-db/models/user.model';
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

    @Field({ nullable: true })
    endDate?: string;

    @Field()
    endTime: string;

    @Field()
    teamSize: number;

    @Field()
    playerLimit: number;

    @Field()
    owner: string;

    @Field()
    status: string;

    @Field({ nullable: true  })
    lat: string;

    @Field({ nullable: true })
    long: string;

    @Field()
    type: string; // public or private

    @Field()
    isIndoor: number; // indoor = 1, outdoor = 0
    
    @Field(() => [UserType], { nullable: true })
    players: [UserType]

    @Field(() => [UserType], { nullable: true })
    totalUserList: [UserType]

    @Field({ nullable: true })
    joinedPlayer: number;

    @Field({ nullable: true })
    ownerName: string;
}

@ObjectType()
export class EventTypeWithCount {
    @Field()
    totalCount: number

    @Field(type => [EventType])
    result: []
}
