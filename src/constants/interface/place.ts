import {IContact} from './contact';
import {ICompany} from './company';
import {IAddress} from './address';

// https://t.me/joinchat/

export interface IPlace {
  id?: string;
  title: string;
  shortTitle?: string;
  inDoor: boolean;
  addressInfo: IAddress;
  contacts: IContact;
  telegramLink?: string;
  company?: ICompany;
  admin: string;
  info?: string[];
  createdAt?: string;
}
