import { Inject } from "@nestjs/common";
// Async iterator to access the RethinkDB change feed
const { $$asyncIterator } = require("iterall");

export class RethinkIterator {
  public actionName;
  // @Inject('RethinkService') service;

  constructor(subAction, query, conn) {
    (this as any).cursor = query.changes().run(conn);
    this.actionName = subAction;
  }

  async next() {
    const val = await (await (this as any).cursor).next();
    // if (this.actionName === "eventPlayerChanges" && val.new_val) {
    //   console.log("her");
    //   const data = await this.service.getByID('users', val.new_val.playerId);
    //   console.log(data);
    // }
    return { value: { [this.actionName]: val.new_val }, done: false };
  }

  async return() {
    await (await (this as any).cursor).close();
    return { value: undefined, done: true };
  }

  async throw(error) {
    return Promise.reject(error);
  }

  [$$asyncIterator]() {
    return this;
  }
}