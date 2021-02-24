import { Inject, Injectable, Logger } from '@nestjs/common';
import * as rethinkDB from 'rethinkdb';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RethinkService {
    private readonly logger = new Logger(RethinkService.name);
    private connection: rethinkDB.Connection

    constructor(@Inject('RethinkProvider') connection, private config: ConfigService) {
        this.connection = connection
    }

     /**
     * Creates a new table in the RethinkDB instance
     * @param tableName Name of the new Table
     * @returns Creation status promise
     */
    async createTable(tableName:string): Promise<rethinkDB.CreateResult> {
        console.log('uuid')
        let result = await rethinkDB.db('test').tableCreate(tableName).run(this.connection);
        return result
    }

    async generateUID() {
        return await rethinkDB.uuid().run(this.connection);
    }

    async getDB(tableName, filter = {}) {
        let result;
        await rethinkDB.db(this.config.get<string>('rethinkdb.db'))
            .table(tableName)
            .filter(filter)
            .run(this.connection)
            .then(cursor => {
                cursor.toArray(function(err, res) {
                if (err) throw err;
                    result = res;
                });
            }).catch(err => {
                this.logger.error(`Some error fetching ${tableName} from DB`, err);
            });
        return result
    }

}