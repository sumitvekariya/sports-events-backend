import { InputType, Field } from '@nestjs/graphql';
import { IsNumber, IsUUID } from 'class-validator';

@InputType()
export class AcceptDeclineRequestInput {
  @Field(() => String)
  @IsUUID()
  userId: string;

  @Field(() => Number)
  @IsNumber()
  isAccept: number;
}
