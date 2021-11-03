import { Inject, Injectable } from "@nestjs/common";
import { CreateEventInput, UpdateEventInput } from "./dto/create-event.input";
import { EventType } from "./event.type";

@Injectable()
export class EventService {
    private rethinkService;

    constructor(@Inject('RethinkService') service) {
        this.rethinkService = service;
    }

    async create(userId: string, CreateEventInput: CreateEventInput) {
      const uuid = await this.rethinkService.generateUID();
      const event = {
        ...CreateEventInput,
        id: uuid,
        owner: userId,
        lat: "48.3794",
        long: "31.1656"
      };

      const { inserted, changes } = await this.rethinkService.saveDB(
        'events',
        event,
      );
      if (inserted) {
        return changes[0].new_val;
      } else {
        throw Error('Event was not created');
      }
    }
    
    async getAllWithCount(filter: any, skip: number,limit: number, betweenRange: any, userId?, followedBy?): Promise<{ result: EventType, totalCount: number}> {
      let result = await this.rethinkService.getDataWithPagination('events', filter, skip, limit, betweenRange);
      let totalCount = await this.rethinkService.getTotalCount('events', filter);

      // get eventids with followedby is enrolled from eventPlayer table
      const keys = Object.keys(filter);
      if (followedBy) {
        const followedByEvents = await this.rethinkService.getDataWithFilter('eventPlayers', { playerId : followedBy });
        // if (followedByEvents?.length) {
          const eventsToPush = [];
          for (let fe of followedByEvents) {
            const foundEvent = result.find(r => r.id === fe?.eventId)
            if (!foundEvent) {
              // fetch Event detail
              const eventDetails = await this.rethinkService.getDataWithFilter('events', { id: fe?.eventId });
              eventsToPush.push(...eventDetails);
              
            } else if (keys.length === 1) {
              eventsToPush.push(foundEvent);
            }
          }
          if (keys.length === 1) {
              result = [...eventsToPush];
          } else {
            result = [...result, ...eventsToPush]
          }
        // }
      }
      // TODO:: query is not working that's why. filter based on between ragne
      if (betweenRange && betweenRange.start && betweenRange.end) {
        result = result.filter((event) => {
          return event.startDate >= betweenRange.start && event.endDate <= betweenRange.end
        })
      }

      // Get events in which user is involved
      // TODO :: implement pagination using slice as we are merging two different array
      if (userId) {
        let enrolledEvents = await this.rethinkService.getUserEnrolledEvents('eventPlayers', { playerId: userId });
        for (let event of enrolledEvents) {
          const found = result.findIndex(r => r.id === event.id);
          if (found === -1) {
            result.push(event);
            totalCount += 1;
          }
        }
        // result = [...result, ...enrolledEvents];
        // totalCount += enrolledEvents.length;
      }
      
      // get followers event
      const followers = await this.rethinkService.getDataWithFilter('followers', { followerId: userId });
      if (followers?.length) {
        const userIds = followers.map(f => f.userId);
        if (userIds?.length) {
          for (let uId of userIds) {
            const events = await this.rethinkService.getDataWithFilter('events', { owner: uId });
            if (events?.length) {
              for (let e of events) {
                const found = result.findIndex(r => r.id === e.id);
                if (found === -1) {
                  result.push(e);
                  totalCount += 1;
                }
              }
            }
          }
        }
      }

      // get joined user count for each event
      for (let event of result) {
        if (event) {
          let playerCount = await this.rethinkService.getTotalCount('eventPlayers', { eventId: event.id });
          event['joinedPlayer'] = playerCount
        }
      }
      return { result, totalCount };
    }

    async update(updateEventInput: UpdateEventInput) {
      const { id, ...rest } = updateEventInput;
      const { replaced, changes } = await this.rethinkService.updateDB(
        'events',
        id,
        updateEventInput,
      );
      if (replaced) {
        return changes[0].new_val;
      } else {
        throw Error('Error while updating a events');
      }
    }
    
    async remove(userId: string, id: string) {
      const eventData = await this.rethinkService.getByID('events', id);
      if (eventData && userId === eventData.owner) {
        const { deleted } = await this.rethinkService.removeDB('events', id);
        if (deleted) {
          return true;
        } else {
          throw Error('Error while deleting a events');
        }
      } else {
        return false;
      }
    }

    async getEventDetail(userId: string, id:string) {
      // get players list
      const players = await this.rethinkService.getPlayerList({ eventId: id });
      
      // Event Detail
      const result = await this.rethinkService.getByID('events', id);

      // Get total associated user's list
      // get my follower List
      const myFollowersList = await this.rethinkService.getUserList('followers', { userId }, 'followerId');

      // get follower List whom I follow
      const usersWhomIFollow = await this.rethinkService.getUserList('followers', { followerId:  userId }, 'userId');

      // get My friend list
      const myFriendList = await this.rethinkService.getUserList('friends', { userId: userId, status: 'accepted' }, 'friendId');

      let playerCount = await this.rethinkService.getTotalCount('eventPlayers', { eventId: id });
      result['joinedPlayer'] = playerCount

      // get owner Data
      const ownerData = await this.rethinkService.getByID('users', result.owner);
      result['ownerName'] = ownerData.nickName;

      let totalUserList = [...myFollowersList, ...usersWhomIFollow, ...myFriendList];
      totalUserList = totalUserList.reduce((acc, data) => {
        const found = acc.findIndex(obj => obj.id === data.id);
        if (found === -1) {
          acc.push(data);
        }
        return acc
      }, []);

      for (let p of players) {
        if (p.addedBy) {
          const existingUser = await this.rethinkService.getDataWithFilter('users', { id: p.addedBy });
          if (existingUser?.length) {
            p.addedByUser = existingUser[0].nickName;
          }
        }
      }
      result['players'] = players;
      result['totalUserList'] = totalUserList;
      return result;
    }

    async subscribe(subAction: string) {
      return this.rethinkService.getSubscription(subAction, 'events');
    }
}