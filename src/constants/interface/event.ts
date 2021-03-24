import {ITournament} from './tournament';
import {ITeam} from './team';
import { Status, Sport } from './others';

export interface IEvent {
  id?: string;
  title: string;
  start: number;
  end?: number;
  tournament?: ITournament;
  status?: Status;
  sport?: Sport;
  admin: string;
  scoreA: number;
  scoreB: number;
  teamA: ITeam;
  teamB: ITeam;
}
