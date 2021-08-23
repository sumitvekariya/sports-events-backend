import { Inject, Injectable, Logger } from '@nestjs/common';
import * as rethinkDB from 'rethinkdb';
import { ConfigService } from '@nestjs/config';
import { RethinkIterator } from './rethink-iterator';

// export class RethinkResponse {
//     inserted: number;
//     replaced: number;
//     unchanged: number;
//     errors: number;
//     deleted: number;
//     skipped: number;
//     first_error: Error;
//     generated_keys: string[]; // only for insert
//     changes: {
//         new_val: object | null;
//         old_val: object | null;
//     }
// }

@Injectable()
export class RethinkService {
    private readonly logger = new Logger(RethinkService.name);
    private connection: rethinkDB.Connection
    private readonly r: any;

    constructor(@Inject('RethinkProvider') connection, private config: ConfigService) {
        this.connection = connection;
        this.r = rethinkDB.db(this.config.get<string>('rethinkdb.db'));
    }

     /**
     * Creates a new table in the RethinkDB instance
     * @param tableName Name of the new Table
     * @returns Creation status promise
     */
    async createTable(tableName:string): Promise<rethinkDB.CreateResult> {
        let result = await rethinkDB.db('test').tableCreate(tableName).run(this.connection);
        return result
    }

    async generateUID() {
        return await rethinkDB.uuid().run(this.connection);
    }

    async getByID(tableName, uuid) {
        let result;
        await rethinkDB.db(this.config.get<string>('rethinkdb.db'))
            .table(tableName)
            .get(uuid)
            .run(this.connection)
            .then(res => {
                result = res;
                if (tableName === 'users') {
                    this.updateDB('users', uuid, {});
                }
            }).catch(err => {
                this.logger.error(`Some error fetching ${tableName} from DB`, err);
            });
        return result
    }

    async getDB(tableName, filter: any = {}) {
        let result;
        const self = this;
        await rethinkDB.db(this.config.get<string>('rethinkdb.db'))
            .table(tableName)
            .filter(filter)
            .run(this.connection)
            .then(cursor => {
                cursor.toArray(function(err, res) {
                    if (err) throw err;
                    result = res;

                    if (tableName === 'users' && filter?.telegramId) {
                        const user = res.length > 0 ? res[0] : null;
                        if (user) {
                            self.updateDB('users', user.id, {});
                        }
                    }
                });
            }).catch(err => {
                this.logger.error(`Some error fetching ${tableName} from DB`, err);
            });
        return result
    }

    // ToDo: finalize rethink subscription
    async getSubscription(subAction, tableName, filter: any = {}) {
        return new RethinkIterator(
            subAction,
            rethinkDB.db(this.config.get<string>('rethinkdb.db'))
            .table(tableName)
            .filter(filter),
            this.connection,
        );
    }

    async saveDB(tableName, data): Promise<any> {
        const uuid = await this.generateUID();
        data = {
            ...data,
            id: uuid,
            createdAt: rethinkDB.now(),
            updatedAt: rethinkDB.now()
        }
        let result = await rethinkDB.db(this.config.get<string>('rethinkdb.db'))
            .table(tableName)
            .insert(data, { returnChanges: true })
            .run(this.connection)
            .catch(err => {
                this.logger.error(`Some error when adding ${data} to table ${tableName} in DB`, err);
            });

        return result;
    }

    async updateDB(tableName, uuid, data) {
        data = {
            ...data,
            updatedAt: rethinkDB.now()
        }
        let result = await rethinkDB.db(this.config.get<string>('rethinkdb.db'))
            .table(tableName)
            .get(uuid)
            .update(data, { returnChanges: true })
            .run(this.connection)
            .catch(err => {
                this.logger.error(`Some error when updating ${data} to table ${tableName} in DB`, err);
            });

        return result;
    }

    async removeDB(tableName, uuid) {
        let result = await rethinkDB.db(this.config.get<string>('rethinkdb.db'))
            .table(tableName)
            .get(uuid)
            .delete({returnChanges: true})
            .run(this.connection)
            .catch(err => {
                this.logger.error(`Some error when deleting element with id: ${uuid} in table ${tableName} in DB`, err);
            });

        return result
    }

    async getTotalCount(tableName, filter) {
        let result = await rethinkDB.db(this.config.get<string>('rethinkdb.db'))
            .table(tableName)
            .filter(filter)
            .count()
            .run(this.connection)
            .catch(err => {
                this.logger.error(`Some error when getting total count`, err);
            });

        return result
    }

    async getDataWithFilter(tableName, filter) {
        let result;
        await rethinkDB.db(this.config.get<string>('rethinkdb.db'))
            .table(tableName)
            .filter(filter)
            .run(this.connection)
            .then(cursor => {
                cursor.toArray(function(err, res) {
                    if (err) throw err;
                    result = res;
                })
            })
            .catch(err => {
                this.logger.error(`Some error when getDataWithFilter`, err);
            });

        return result
    }

    async getDataWithPagination(tableName, filter: any = {}, skip, limit, betweenRange: any = {}) {
        let result;
        await rethinkDB.db(this.config.get<string>('rethinkdb.db'))
            .table(tableName)
            .skip((skip * limit) - limit)
            .limit(limit)
            .filter(filter)
            .filter((doc) => {
                if (betweenRange && betweenRange.start && betweenRange.end) {
                    return doc("startDate").ge(betweenRange.start) && (doc("endDate").le(betweenRange.end))
                }
                return {};
            })
            .run(this.connection)
            .then(cursor => {
                cursor.toArray(function(err, res) {
                    if (err) throw err;
                    result = res;
                })
            })
            .catch(err => {
                this.logger.error(`Some error when getting getDataWithPagination`, err);
            });

        return result
    }

    async getPlayerList(filter: any) {
        let result;
        const r = rethinkDB.db(this.config.get<string>('rethinkdb.db'));
        await r
            .table("eventPlayers")
            .filter(filter)
            .innerJoin(r.table("users"), (eventRow, userRow) => {
                return eventRow('playerId').eq(userRow('id'))
            })
            .withFields(
                {"left": { "id": true, "playerId": true, "eventId": true, "status": true }},{"right": { "firstName": true, "lastName": true, "positions": true }}
            )
            .zip()
            .run(this.connection)
            .then(cursor => {
                cursor.toArray(function(err, res) {
                    if (err) throw err;
                    result = res;
                })
            })
            .catch(err => {
                this.logger.error(`Some error when getPlayerList`, err);
            });

        return result
    }

    async getFriendList(filter: any) {
        let result;
        const r = rethinkDB.db(this.config.get<string>('rethinkdb.db'));
        await r
            .table("friends")
            .filter(filter)
            .innerJoin(r.table("users"), (friendRow, userRow) => {
                return friendRow('friendId').eq(userRow('id'))
            })
            // .withFields(
            //     {"left": { "id": true, "playerId": true, "eventId": true, "status": true }},{"right": { "firstName": true, "lastName": true, "positions": true }}
            // )
            .zip()
            .run(this.connection)
            .then(cursor => {
                cursor.toArray(function(err, res) {
                    if (err) throw err;
                    result = res;
                })
            })
            .catch(err => {
                this.logger.error(`Some error when getPlayerList`, err);
            });

        return result
    }
}