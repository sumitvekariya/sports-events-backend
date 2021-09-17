import { ObjectType, Field } from '@nestjs/graphql';
import { IsEnum, IsOptional } from 'class-validator';
import { EventType } from 'src/event/event.type';

@ObjectType('User')
export class UserType {
  @Field({ nullable: true })
  id: string;

  @Field({ nullable: true })
  createdAt: Date;

  @Field({ nullable: true })
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

  @Field({ defaultValue: 'N/A', nullable: true })
  @IsOptional()
  nickName?: string;

  @Field({ defaultValue: '', nullable: true })
  @IsOptional()
  firstName?: string;

  @Field({ defaultValue: '', nullable: true })
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

  @Field({ nullable: true })
  @IsOptional()
  message?: string;

  @Field({ nullable: true })
  @IsOptional()
  playerId?: string;

  @Field({ nullable: true })
  @IsOptional()
  friendId?: string;

  @Field({ nullable: true })
  @IsOptional()
  eventId?: string;
  
  @Field(() => [UserType], { nullable: true })
  enrolledUsers: [UserType];

  @Field({ nullable: true })
  @IsOptional()
  addedByUser: string

  @Field({ nullable: true })
  @IsOptional()
  addedBy: string

  @Field({ nullable: true })
  @IsOptional()
  isCustomUser: number
}


@ObjectType()
export class NotificationType {
  @Field({ nullable: true })
  id: string;

  @Field({ nullable: true })
  type: string;

  @Field({ nullable: true })
  ownerId: string;

  @Field({ nullable: true })
  userId: string;

  @Field()
  message: string;

  @Field({ nullable: true } )
  title: string;

  @Field({ nullable: true } )
  description: string;

  @Field({ nullable: true } )
  playerLimit: string;

  @Field({ nullable: true } )
  teamSize: string;
  
  @Field({ nullable: true } )
  firstName: string;

  @Field({ nullable: true } )
  lastName: string;

  @Field({ nullable: true } )
  isRead: number;

  @Field({ nullable: true } )
  actionTaken: number;

  @Field({ nullable: true } )
  notification_type: string

  @Field({ nullable: true } )
  startTime: string

  @Field({ nullable: true } )
  endTime: string

  @Field({ nullable: true } )
  eventId: string
}

@ObjectType()
export class EventPlayerChangeOutput {
  @Field({ nullable: true })
  type: string;

  @Field({ nullable: true })
  eventId: string;

  @Field({ nullable: true })
  user: UserType;
}

@ObjectType()
export class NotificationChangeOutput {
  @Field({ nullable: true })
  type: string;

  @Field({ nullable: true })
  notification: NotificationType;
}

@ObjectType()
export class UserProfileType {
  @Field({ nullable: true })
  userProfileData: UserType;

  @Field(() => [UserType], { nullable: true })
  friends: [UserType];

  @Field(() => [UserType], { nullable: true })
  followers: [UserType];

  @Field({ nullable: true })
  totalEvent: number

  @Field({ nullable: true })
  notificationCount: number
}


@ObjectType()
export class UserFriendsType { 
  @Field(() => [UserType], { nullable: true })
  friends: [UserType];

  @Field(() => [UserType], { nullable: true })
  enrolledUsers: [UserType];

}