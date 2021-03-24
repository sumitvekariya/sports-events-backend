import { Sport, Status } from './others';

export interface ITeam {
  id?: string;
  name: string;
  shortName?: string;
  flag?: string;
  sport?: Sport;
  createdTimestamp?: number;
  admin: string;
  members?: string[];
  status?: Status;
}
