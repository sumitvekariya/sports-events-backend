import { ObjectType, Field } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';

@ObjectType('Post')
export class PostType {
    @Field()
    id: string;

    @Field()
    text: string;

    @Field()
    chatId: number;

    @Field()
    messageId: number;

    @Field()
    createdAt: Date;

    @Field()
    updatedAt: Date;

    @Field()
    @IsOptional()
    count?: number;

    @Field(() => [String])
    @IsOptional()
    idArray?: string[];
}