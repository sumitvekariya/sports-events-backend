import { IContact } from "src/constants/interface/contact";
import { IUser } from "src/constants/interface/user";

export default class User implements IUser {
  public id: number;
  public nickName: string;
  public firstName: string;
  public lastName: string;
  public displayName: string;
  public birthDateTimestamp: number;
  public contact: IContact;
  public sex: boolean;
  public archived: boolean;
  public createdAt: number;
  public lastTelegramActivityAt: number;

  constructor(user: IUser) {
    this.id = user.id || null;
    this.nickName = user.nickName || null;
    this.firstName = user.firstName || null;
    this.lastName = user.lastName || null;
    this.displayName = this.getFullName();
    this.birthDateTimestamp = user.birthDate || null;
    this.contact = user.contact || null;
    this.sex = user.sex || null;
    this.archived = user.archived || false;
    this.createdAt = user.createdAt;
    this.lastTelegramActivityAt = user.lastTelegramActivityAt;
  }

  getFullName() {
    return this.firstName + ' ' + this.lastName; 
  }
}
