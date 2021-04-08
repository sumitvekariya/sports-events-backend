import { InputType, Field } from '@nestjs/graphql';
import { MinLength } from 'class-validator';

@InputType()
export class CreatePostInput {
  @MinLength(1)
  @Field()
  text: string;

  @Field()
  chatId: number;

  @Field()
  messageId: number;
}
