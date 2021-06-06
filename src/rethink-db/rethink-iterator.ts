// Async iterator to access the RethinkDB change feed
const { $$asyncIterator } = require("iterall");

export class RethinkIterator {
  constructor(query, conn) {
    (this as any).cursor = query.changes().run(conn);
  }

  async next() {
    const val = await (await (this as any).cursor).next();
    // return { value: { res: val.new_val }, done: false };
    return { value: val, done: false };
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