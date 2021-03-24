export interface Sport {
  name: string;
  shortName?: string;
  id?: number;
}

export interface Status {
  code: number;
  description?: string;
  type?: string;
}

export interface ChatInfo {
  warnings: number;
  bans: number;
  permaBans: number;
  upVotes: number;
  messages: number;
}

export interface FollowInfo {
  places: number;
  teams: number;
  players: number;
  tournaments: number;
}

export interface AdminInfo {
  places: string[];
  teams: string[];
  tournaments: string[];
}

export interface Item {
  name: string;
  value: number;
}

export interface Info {
  title: string;
  items: Item[];
}
