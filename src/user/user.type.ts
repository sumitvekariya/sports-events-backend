import { ObjectType, Field } from '@nestjs/graphql';
import { IsEnum, IsOptional } from 'class-validator';

@ObjectType('User')
export class UserType {
  @Field()
  id: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date; // Last Activity State

  @Field({ nullable: true })
  @IsOptional()
  telegramId?: number;

  @Field({ nullable: true })
  @IsOptional()
  email?: string;

  @Field({ nullable: true })
  @IsOptional()
  password?: string;

  @Field({ defaultValue: 'N/A' })
  @IsOptional()
  nickName?: string;

  @Field({ defaultValue: '' })
  @IsOptional()
  firstName?: string;

  @Field({ defaultValue: '' })
  @IsOptional()
  lastName?: string;

  @Field({ nullable: true })
  @IsOptional()
  displayName?: string;

  @Field({ nullable: true })
  @IsOptional()
  birthDate?: Date;

  @Field({ nullable: true })
  @IsOptional()
  sex?: boolean;

  @Field({ nullable: true })
  @IsOptional()
  archived?: boolean;

  @Field({ nullable: true })
  @IsOptional()
  phone?: string;

  @Field({ nullable: true })
  @IsOptional()
  telegramAccessHash?: string;

  @Field({ nullable: true })
  @IsOptional()
  photoUrl?: string;

  @Field({ nullable: true })
  @IsEnum(['admin','eventAdmin','regular-user'])
  role: string;

  
  @Field(() => [String], { nullable: true })
  @IsOptional()
  positions?: [string];
}
