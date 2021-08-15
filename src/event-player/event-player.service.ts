import { Inject, Injectable } from "@nestjs/common";
import { JoinEventInput } from './dto/event-player.dto';

@Injectable()
export class EventPlayerService {
  private rethinkService;

  constructor(@Inject('RethinkService') service) {
    this.rethinkService = service;
  }

  async create(userId: string, JoinEventInput: JoinEventInput) {
    const checkExistingData = await this.rethinkService.getDataWithFilter('eventPlayers', { eventId: JoinEventInput.eventId, playerId: userId });

    if (checkExistingData && checkExistingData.length === 0) {
      const uuid = await this.rethinkService.generateUID();
      const eventPlayerObj = {
        ...JoinEventInput,
        id: uuid,
        playerId: userId,
        status: true
      };
  
      const { inserted, changes } = await this.rethinkService.saveDB(
        'eventPlayers',
        eventPlayerObj,
      );
      if (inserted) {
        return changes[0].new_val;
      } else {
        throw Error('Error in join event');
      }
    } else {
      return checkExistingData[0];
    }
  }  

  async remove(playerId: string, eventId: string) {
    const [existingEventPlayer] = await this.rethinkService.getDataWithFilter('eventPlayers', { playerId , eventId });

    if (existingEventPlayer && existingEventPlayer.playerId === playerId) {
      const { deleted } = await this.rethinkService.removeDB('eventPlayers', existingEventPlayer.id);
      if (deleted) {
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
}