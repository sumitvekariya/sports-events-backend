import { Item, ChatInfo, FollowInfo, Info } from './others';
import { IContact } from './contact';

export interface Roles {
  subscriber?: boolean;
  groupAdmin?: string[];
  teamAdmin?: string[];
  superAdmin?: boolean;
}

export interface IUser {
  archived?: boolean;
  id?: number;
  email?: string;
  displayName?: string;
  photoURL?: string;
  emailVerified?: boolean;
  providerId?: string;
  validSince?: number;
  lastLoginAt?: number;
  lastTelegramActivityAt?: number;
  createdAt?: number;
  updatedAt?: number;
  avatar?: string;
  firstName?: string;
  lastName?: string;
  nickName?: string;
  contact?: IContact;
  numberVerified?: boolean;
  confirmed?: boolean;
  country?: string;
  city?: string;
  birthDate?: number;
  age?: number;
  sex?: boolean;
  sports?: number[];
  tags?: number[];
  accounts?: Item[];
  ownTeams?: string[];
  favEvents?: string[];
  favTeams?: string[];
  mutedEvents?: string[];
  favPlaces?: string[];
  favPlayers?: string[];
  favTournaments?: string[];
  pinnedLeagues?: string[];
  devicesToSync?: any[];
  unsubscribed?: boolean;
  hasAds?: boolean;
  chatInfo?: ChatInfo;
  followInfo?: FollowInfo;
  info?: Info[];
  roles?: Roles;
}
