import { CreatePostInput } from './create-post.input';
import { InputType, Field, PartialType, ID } from '@nestjs/graphql';
import { IsUUID, MinLength } from 'class-validator';

@InputType()
export class UpdatePostInput extends PartialType(CreatePostInput) {
  @IsUUID()
  @Field(() => ID)
  id: string;

  @MinLength(1)
  @Field()
  text: string;

  @Field()
  chatId: number;

  @Field()
  messageId: number;

  @IsUUID('all', {each: true})
  @Field(() => [ID])
  idArray?: string[];
}
