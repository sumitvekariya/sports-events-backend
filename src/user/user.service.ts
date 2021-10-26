import {
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { UpdateUserInput } from './dto/update-user.input';
import { AuthLoginInput } from './dto/auth-login.input';
import { JwtService } from '@nestjs/jwt';
import { JwtDto } from './dto/jwt.dto';
// import { createHash } from 'crypto';
import { ConfigService } from '@nestjs/config';
import { FollowUnfollowInput } from './dto/follow-unfollow.input';
import { AddRemoveFriendInput } from './dto/add-remove-friend.input';
import { AcceptDeclineRequestInput } from './dto/accept-declint-request.intput';

@Injectable()
export class UserService {
  private rethinkService;
  private logger = new Logger(UserService.name);

  constructor(
    @Inject('RethinkService') service,
    private jwtService: JwtService,
    private configService: ConfigService
  ) {
    this.rethinkService = service;
  }

  async getAll() {
    const result = await this.rethinkService.getDB('users');
    return result;
  }

  async getOne(id: string) {
    const result = await this.rethinkService.getByID('users', id);
    return result;
  }

  async login(authLoginInput: AuthLoginInput) {
    let found = await this.rethinkService.getDB('users', {
      telegramId: authLoginInput.telegramId,
    });
    // Register user if new
    if (!found.length) {
      found = await this.create(authLoginInput);
      this.logger.log('New user registered: ' + found.id);
    } else {
      found = found[0];
    }
    // check if user is banned
    if (found.banned) {
      throw new UnauthorizedException('Banned user');
    }
    // if (authLoginInput.password) {
    //     const passwordValid = await AuthHelper.validate(authLoginInput.password, found[0].password);

    //     if (!passwordValid) {
    //         throw new UnauthorizedException('Invalid credentials');
    //     }
    // }
    const payload: JwtDto = { sub: found.id, role: found.role };
    const token = this.jwtService.sign(payload)

    return {
      user: found,
      token
    };
  }

  async validateUser(id: string) {
    const user = await this.rethinkService.getByID('users', id);
    if (user) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async create(createUserInput: AuthLoginInput) {
    const uuid = await this.rethinkService.generateUID();
    const user = {
      ...createUserInput,
      id: uuid,
      isCustomUser: 0,
      positions: []
    };
    const { inserted, changes } = await this.rethinkService.saveDB(
      'users',
      user,
    );
    if (inserted) {
      return changes[0].new_val;
    } else {
      throw Error('user was not created');
    }
  }

  async update(userId: string, updateUserInput: UpdateUserInput) {
    const keys = Object.keys(updateUserInput);
    const objToUpdate = {};

    for (let key of keys) {
      if (updateUserInput[key]) {
        objToUpdate[key] = updateUserInput[key]
      }

      if (key === 'name') {
        objToUpdate['firstName'] = updateUserInput[key].split(' ')[0] || "";
        objToUpdate['lastName'] = updateUserInput[key].split(' ')[1] || ""
      }
    }

    const { replaced, changes } = await this.rethinkService.updateDB(
      'users',
      userId,
      objToUpdate,
    );
    if (replaced) {
      return changes[0].new_val;
    } else {
      throw Error('Error while updating a user');
    }
  }

  async remove(id: string) {
    const { deleted, changes } = await this.rethinkService.removeDB(
      'users',
      id,
    );
    if (deleted) {
      return changes[0].old_val;
    } else {
      throw Error('Error while deleting a user');
    }
  }

  async getUserProfile(loggedInUserId: string, id: string) {
    const response = {};

    const result = await this.rethinkService.getByID('users', id);

    // get followers
    const followersList = await this.rethinkService.getUserList('followers', { followerId: loggedInUserId }, 'userId');
    response['followers'] = followersList;

    // get friends
    const friendList = await this.rethinkService.getUserList('friends', { userId: loggedInUserId }, 'friendId');
    response['friends'] = friendList;

    // get event count
    let totalCount = await this.rethinkService.getTotalCount('events', { owner: id });
    // get event in which use is enrolled
    let enrolledEvents = await this.rethinkService.getUserEnrolledEvents('eventPlayers', { playerId: id });
    totalCount += enrolledEvents.length;
    response['totalEvent'] = totalCount;

    // get notification count
    const notificationCount = await this.rethinkService.getNotificationList('notifications', { ownerId: id });
    response['notificationCount'] = notificationCount.length;

    response['userProfileData'] = result;
    return response;
  }

  async followUser(followerId: string, followUserInput: FollowUnfollowInput) {
    if (followerId === followUserInput.userId) {
      return "You can't follow yourself."
    }
    
    // find if already following or not
    const [existingFollower] = await this.rethinkService.getDataWithFilter('followers', { followerId , userId: followUserInput.userId });

    if (existingFollower && followUserInput.isFollow) {
      return "You are already following this user."
    }

    if (!existingFollower && followUserInput.isFollow) {
      const objToSave = {
        followerId,
        userId: followUserInput.userId
      }
      await this.rethinkService.saveDB('followers', objToSave);

      // add notification object
      const notificationObj = {
        userId: followerId,
        notification_type: "follow_user",
        isRead: 0, // unread - 0, read - 1,
        eventId: "",
        ownerId: followUserInput.userId,
        actionTaken: 0
      };
      await this.rethinkService.saveDB('notifications', notificationObj);

      return "You have started following this user";
    } else {
      if (existingFollower) {
        await this.rethinkService.removeDB('followers', existingFollower.id);
         // add notification object
        const notificationObj = {
          userId: followerId,
          notification_type: "unfollow_user",
          isRead: 0, // unread - 0, read - 1,
          eventId: "",
          ownerId: followUserInput.userId,
          actionTaken: 0
        };
        await this.rethinkService.saveDB('notifications', notificationObj);

        return "You unfollowed this user";
      } else {
        return "First follow the user";
      }
    }
  }

  async getFollowers(userId: String) {
    const followersList = await this.rethinkService.getUserList('followers', { userId }, 'followerId');
    if (followersList && followersList.length) {
      return followersList
    } else {
      return []
    }
  }

  async subscribe(subAction: string, tableName: string) {
    const data = await this.rethinkService.getSubscription(subAction, tableName);
    return data
  }

  async addRemoveFriendInput(userId: string, addRemoveFriendInput: AddRemoveFriendInput) {
    if (userId === addRemoveFriendInput.userId) {
      return "You can't add yourself in friend."
    }

    // find if already friend or not
    const [existingFollower] = await this.rethinkService.getDataWithFilter('friends', { userId , friendId: addRemoveFriendInput.userId });

    if (existingFollower && addRemoveFriendInput.addFriend) {
      return "You are already friend of this user."
    }

    if (!existingFollower && addRemoveFriendInput.addFriend) {
      const objToSave = {
        friendId: addRemoveFriendInput.userId,
        userId,
        status: "pending"
      }

      await this.rethinkService.saveDB('friends', objToSave);
      // add notification object
      const notificationObj = {
        userId,
        notification_type: "add_friend",
        isRead: 0, // unread - 0, read - 1,
        eventId: "",
        ownerId: addRemoveFriendInput.userId,
        actionTaken: 0
      };
      await this.rethinkService.saveDB('notifications', notificationObj);

      return "You are a friend of this user";
    } else {
      if (existingFollower) {
        await this.rethinkService.removeDB('friends', existingFollower.id);
        await this.rethinkService.removeDataWithFilter('friends', { userId: addRemoveFriendInput.userId, friendId: userId });
        // add notification object
        const notificationObj = {
          userId,
          notification_type: "remove_friend",
          isRead: 0, // unread - 0, read - 1,
          eventId: "",
          ownerId: addRemoveFriendInput.userId,
          actionTaken: 0
        };
        await this.rethinkService.saveDB('notifications', notificationObj);
        return "You unfriend this user";
      } else {
        return "First add this user to your friend list";
      }
    }

  }

  async getFriends(userId: String, eventId: String) {
    const response = {};
    // TODO:: Add status filter while fetching friends
    const friendList = await this.rethinkService.getUserList('friends', { userId: userId }, 'friendId');

    
    if (friendList && friendList.length) {
      if (eventId) {
        // Get enrolled friends list
        const data = await this.rethinkService.getUsersEnrolledInEvent('friends', { userId }, { eventId, status: true }, 'friendId');
        response['enrolledUsers'] = data;
      }
      response['friends'] = friendList;
      return response;
    } else {
      return []
    }
  }

  async getMyFollowing(userId: String) {
    const followersList = await this.rethinkService.getUserList('followers', { followerId: userId }, 'userId');
    if (followersList && followersList.length) {
      return followersList
    } else {
      return []
    }
  }

  async getFriendsWithMe(userId: String) {
    // TODO:: Add status filter while fetching friends
    const followersList = await this.rethinkService.getUserList('friends', { friendId: userId }, 'userId');
    if (followersList && followersList.length) {
      return followersList
    } else {
      return []
    }
  }

  async getAllUserList(userId: String) {
    // get my follower List
    const myFollowersList = await this.rethinkService.getUserList('followers', { userId }, 'followerId');

    // get follower List whom I follow
    const usersWhomIFollow = await this.rethinkService.getUserList('followers', { followerId:  userId }, 'userId');

    // get My friend list
    // TODO:: Add status filter while fetching friends
    const myFriendList = await this.rethinkService.getUserList('friends', { userId: userId, status: 'accepted' }, 'friendId');

    let totalUserList = [...myFollowersList, ...usersWhomIFollow, ...myFriendList];
    totalUserList = totalUserList.reduce((acc, data) => {
      const found = acc.findIndex(obj => obj.id === data.id);
      if (found === -1) {
        acc.push(data);
      }
      return acc
    }, []);
    return totalUserList;
  }

  async getNotificationList(ownerId: string, isRead: number) {
    let notifications;
    if (isRead) {
      notifications = await this.rethinkService.getNotificationList('notifications', { ownerId });
    } else {
      notifications = await this.rethinkService.getNotificationList('notifications', { ownerId, isRead });
    }
    if (notifications && notifications.length) {
      for (let n of notifications) {
        switch(n.notification_type) {
          case 'add_friend':
            n.message = `${n.firstName} ${n.lastName} has sent a friend request`;
            n.title = `Friend Request`;
            break;
          case 'follow_user':
            n.message = `${n.firstName} ${n.lastName} has started following you`;
            n.title = `User is Following`;
            break;
          case 'join_event':
            n.message = `${n.firstName} ${n.lastName} joined the event: ${n?.description}`;
            n.title = `Join Event`;
            break;
          case 'leave_event':
            n.message = `${n.firstName} ${n.lastName} left the event: ${n?.description}`;
            n.title = `Left Event`;
            break;
          case 'add_player_event':
            n.message = `you are added into the event: ${n.description}`;
            n.title = `Player added in the event`;
            break;
          case 'remove_player_event':
            n.message = `you are removed from the event: ${n.description}`;
            n.title = `Player removed in the event`;
            break;
          case 'remove_friend':
              n.message = `${n.firstName} ${n.lastName} removed you as a friend`;
              n.title = `Remove friend request`;
              break;
          case 'unfollow_user':
            n.message = `${n.firstName} ${n.lastName} started unfollowing you`;
            n.title = `User unfollowed`;
            break;
          case 'friend_request_accept':
            n.message = `${n.firstName} ${n.lastName} has accepted your friend request`;
            n.title = `Friend Request accepted`;
            break;
          case 'friend_request_decline':
            n.message = `${n.firstName} ${n.lastName} has declined your friend request`;
            n.title = `Friend Request declined`;
            break;
          case 'invite_event':
            n.message = `${n.firstName} ${n.lastName} has invited you to the event`;
            n.title = `Invite to Event`;
            break;
          case 'accept_invitation':
            n.message = `${n.firstName} ${n.lastName} has accepted invitation`;
            n.title = `Invitation accepted`;
            break;
          case 'decline_invitation':
            n.message = `${n.firstName} ${n.lastName} has declined invitation`;
            n.title = `Invitation declined`;
            break;
          default:
            n.message = ``;
            break;
        }
      }
    }
    return notifications;
  }

  async approveDeclineRequest(userId: string, acceptDeclineRequestInput: AcceptDeclineRequestInput) {
    const [foundData] = await this.rethinkService.getDataWithFilter('friends', { friendId: userId  , userId: acceptDeclineRequestInput.userId });

    const status = acceptDeclineRequestInput?.isAccept ? 'accepted' : 'declined';
    let udpated = 0;
    if(foundData) {
      if (acceptDeclineRequestInput?.isAccept) {
        const { replaced, changes } = await this.rethinkService.updateDB(
          'friends',
          foundData.id,
          { status },
        );
        udpated = replaced;

        const objToSave = {
          friendId: acceptDeclineRequestInput.userId ,
          userId,
          status: "accepted"
        }
  
        await this.rethinkService.saveDB('friends', objToSave);
      } else {
        const { replaced, changes } = await this.rethinkService.removeDataWithFilter('friends', { friendId: userId  , userId: acceptDeclineRequestInput.userId });
        udpated = changes[0].old_val;

        await this.rethinkService.removeDataWithFilter('friends', { friendId: acceptDeclineRequestInput.userId  , userId });
      }

      if (udpated) {
        // update action taken obj

        const notificationObj = {
          userId: userId,
          notification_type: +acceptDeclineRequestInput?.isAccept ? "friend_request_accept" : "friend_request_decline",
          isRead: 0,
          eventId: "",
          ownerId: acceptDeclineRequestInput.userId,
          actionTaken: 0
        };

        await this.rethinkService.saveDB('notifications', notificationObj);

        const where = {
          notification_type: 'add_friend',
          ownerId: userId,
          userId: acceptDeclineRequestInput.userId
        };
        await this.rethinkService.updateWithFilter('notifications', where, { actionTaken: 1 });
        
        return `Friend request ${status}`;
      } else {
        throw Error('Error while updating a user');
      }
    } else {
      return 'First send friend request'
    }
  }

  async markReadAllNotifications(userId: string) {
    await this.rethinkService.updateAllRecords('notifications', { isRead: 1 });
    return 'All the nofitications are read.'
  }

  async updateProfile(userId: string, updateUserInput: UpdateUserInput) {
    const keys = Object.keys(updateUserInput);
    const objToUpdate = {};

    for (let key of keys) {
      if (updateUserInput[key]) {
        objToUpdate[key] = updateUserInput[key]
      }
    }

    const { replaced, changes } = await this.rethinkService.updateDB(
      'users',
      userId,
      {bio: 'test'},
    );

    if (replaced) {
      return changes[0].new_val;
    } else {
      throw Error('Error while updating a user');
    }

  }
}
