import { InputType, Field } from '@nestjs/graphql';
import { IsEmail } from 'class-validator';

@InputType()
export class AuthRegisterInput {
    @Field()
    telegramId: number;

    @Field({ nullable: true })
    // @IsEmail()
    email?: string;

    @Field({ nullable: true })
    firstName?: string;

    @Field({ nullable: true })
    lastName?: string;

    @Field({ nullable: true })
    password?: string;
}