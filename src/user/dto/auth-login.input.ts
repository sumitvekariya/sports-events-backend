import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class AuthLoginInput {
  @Field()
  telegramId: number;

  @Field({ nullable: true })
  nickName?: string;

  @Field({ nullable: true })
  firstName?: string;

  @Field({ nullable: true })
  lastName?: string;

  @Field({ nullable: true })
  telegramAccessHash?: string;

  @Field({ nullable: true })
  photoUrl?: string;
}

// auth_date:   + add 3 zeroes (000) to match timeStamp
// first_name:
// hash:
// id: 253573611
// last_name:
// photo_url:
// username:
