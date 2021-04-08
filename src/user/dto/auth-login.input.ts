import { InputType, Field } from '@nestjs/graphql';
import { IsEmail } from 'class-validator';

@InputType()
export class AuthLoginInput {
    @Field()
    telegramId: number;

    @Field({ nullable: true })
    // @IsEmail()
    email?: string;

    @Field({ nullable: true })
    password?: string;
}