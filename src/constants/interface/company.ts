import {IAddress} from './address';
import { IHour } from './hour';

export interface ICompany {
  id?: string;
  title: string;
  shortTitle?: string;
  address?: IAddress;
  webUrl?: string;
  workHours?: IHour;
  places?: string[];
  admin: string;
}
