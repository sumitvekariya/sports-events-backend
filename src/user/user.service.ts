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

  async update(updateUserInput: UpdateUserInput) {
    const { id, ...rest } = updateUserInput;
    if (!rest.firstName) {
      delete rest.firstName;
    }
    if (!rest.lastName) {
      delete rest.lastName;
    }
    const { replaced, changes } = await this.rethinkService.updateDB(
      'users',
      id,
      rest,
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

  async getUserProfile(id: string) {
    const result = await this.rethinkService.getByID('users', id);
    return result;
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
        type: "follow_user",
        isRead: 0, // unread - 0, read - 1,
        ownerId: followUserInput.userId
      };
      await this.rethinkService.saveDB('notifications', notificationObj);

      return "You have started following this user";
    } else {
      if (existingFollower) {
        await this.rethinkService.removeDB('followers', existingFollower.id);
         // add notification object
        const notificationObj = {
          userId: followerId,
          type: "unfollow_user",
          isRead: 0, // unread - 0, read - 1,
          ownerId: followUserInput.userId
        };
        await this.rethinkService.saveDB('notifications', notificationObj);

        return "You unfollowed this user";
      } else {
        return "First follow the user";
      }
    }
  }

  async getFollowers(userId: String) {
    const followersList = await this.rethinkService.getDataWithFilter('followers', { followerId: userId });
    if (followersList && followersList.length) {
      return followersList.map(f => f.userId);
    } else {
      return []
    }
  }

  async subscribe(subAction: string) {
    const data = await this.rethinkService.getSubscription(subAction, 'users');
    return data
  }

  async addRemoveFriendInput(friendId: string, addRemoveFriendInput: AddRemoveFriendInput) {
    if (friendId === addRemoveFriendInput.userId) {
      return "You can't follow yourself."
    }

    // find if already friend or not
    const [existingFollower] = await this.rethinkService.getDataWithFilter('friends', { friendId , userId: addRemoveFriendInput.userId });

    if (existingFollower && addRemoveFriendInput.addFriend) {
      return "You are already friend of this user."
    }

    if (!existingFollower && addRemoveFriendInput.addFriend) {
      const objToSave = {
        friendId,
        userId: addRemoveFriendInput.userId,
        status: "pending"
      }

      await this.rethinkService.saveDB('friends', objToSave);
      // add notification object
      const notificationObj = {
        userId: friendId,
        type: "add_friend",
        isRead: 0, // unread - 0, read - 1,
        ownerId: addRemoveFriendInput.userId
      };
      await this.rethinkService.saveDB('notifications', notificationObj);

      return "You are a friend of this user";
    } else {
      if (existingFollower) {
        await this.rethinkService.removeDB('friends', existingFollower.id);
        // add notification object
        const notificationObj = {
          userId: friendId,
          type: "remove_friend",
          isRead: 0, // unread - 0, read - 1,
          ownerId: addRemoveFriendInput.userId
        };
        await this.rethinkService.saveDB('notifications', notificationObj);
        return "You unfriend this user";
      } else {
        return "First add this user to your friend list";
      }
    }

  }

  async getFriends(userId: String) {
    const friendList = await this.rethinkService.getFriendList({ userId: userId });
    if (friendList && friendList.length) {
      return friendList;
    } else {
      return []
    }
  }
}
