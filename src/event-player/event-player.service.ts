import { Inject, Injectable } from "@nestjs/common";
import { JoinEventInput, UpdatePositionInput } from './dto/event-player.dto';

@Injectable()
export class EventPlayerService {
  private rethinkService;

  constructor(@Inject('RethinkService') service) {
    this.rethinkService = service;
  }

  async create(userId: string, JoinEventInput: JoinEventInput) {

    const allPlayers = await this.rethinkService.getDataWithFilter('eventPlayers', { eventId: JoinEventInput.eventId });

    const checkExistingData = allPlayers.find(ap => ap.playerId === userId);

    // get event Detail
    const eventData = await this.rethinkService.getByID('events', JoinEventInput.eventId);

    if (eventData && eventData.playerLimit > allPlayers.length) {
      if (!checkExistingData) {
        const uuid = await this.rethinkService.generateUID();
        const eventPlayerObj = {
          ...JoinEventInput,
          id: uuid,
          playerId: userId,
          status: true,
          positions: []
        };
    
        const { inserted, changes } = await this.rethinkService.saveDB(
          'eventPlayers',
          eventPlayerObj,
        );
        if (inserted) {
          // add notification object
          const notificationObj = {
            userId,
            type: "join_event",
            isRead: 0, // unread - 0, read - 1,
            eventId: JoinEventInput.eventId,
            ownerId: eventData.owner
          };
          await this.rethinkService.saveDB('notifications', notificationObj);

          return {...changes[0].new_val, message: "You have joined the event successfully"};
        } else {
          throw Error('Error in join event');
        }
      } else {
        return {...checkExistingData, message: "You have joined the event successfully"};
      }
    } else {
      return { message: "Event is full. You can't join right now."}
    }
  }  

  async remove(playerId: string, eventId: string) {
    const [existingEventPlayer] = await this.rethinkService.getDataWithFilter('eventPlayers', { playerId , eventId });

    if (existingEventPlayer && existingEventPlayer.playerId === playerId) {
      const { deleted } = await this.rethinkService.removeDB('eventPlayers', existingEventPlayer.id);
      if (deleted) {
        const eventData = await this.rethinkService.getByID('events', eventId);
        // add notification object
        const notificationObj = {
          userId: playerId,
          type: "leave_event",
          isRead: 0, // unread - 0, read - 1,
          eventId: eventId,
          owner: eventData.owner
        };
        await this.rethinkService.saveDB('notifications', notificationObj);

        return true;
      } else {
        throw Error('Error while deleting a eventPlayers');
      }
    } else {
      return false;
    }
  }

  async getPlayerDetail(eventId: String) {
    const result = await this.rethinkService.getPlayerList({ eventId });
    return result
  }

  async update(userId: string, updatePositionInput: UpdatePositionInput) {
      const { replaced, changes } = await this.rethinkService.updateDB(
        'users',
        userId,
        { positions: updatePositionInput.positions },
      );
      if (replaced) {
      return changes[0].new_val;
      } else {
        throw Error('Error while updating a Positions');
      }
  }

  async subscribe(subAction: string) {
    const data = await this.rethinkService.getSubscription(subAction, 'eventPlayers');
    return data
  }

}