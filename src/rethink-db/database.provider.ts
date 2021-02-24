import * as rethinkDB from 'rethinkdb';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';

const logger = new Logger('RethinkProvider');

export const RethinkProvider = {
    imports: [ConfigModule],
    provide: 'RethinkProvider',
    useFactory: async (config: ConfigService) => {
        // const conn = await rethinkDB.connect(
        //     {
        //         host: process.env.DB_HOST,
        //         port: parseInt(process.env.DB_PORT),
        //         db: process.env.DB_NAME,
        //     });
        const conn = rethinkDB.connect(config.get<{}>('rethinkdb'), function(err, conn) {
            if (err) {
              logger.warn(`Couldn't open connection to initialize the database ${err.message}`);
              process.exit(1);
            }
            const tables = config.get<string[]>('rethinkdb.tables');
            tables.forEach((tb: string) => {
                rethinkDB.table(tb).indexWait('createdAt').run(conn)
                    .then(() => logger.log(`Table ${tb} and index are available.`))
                    .catch(() => {
                        // The database/table/index was not available, create them
                        rethinkDB.dbCreate(config.get<string>('rethinkdb.db')).run(conn)
                        .catch( e => logger.warn(`Table already exist ${e}`))
                        .finally(function() {
                            rethinkDB.db(config.get<string>('rethinkdb.db')).tableCreate(tb).run(conn, () => {
                                rethinkDB.table(tb).indexCreate('createdAt').run(conn, () => {
                                    rethinkDB.table(tb).indexWait('createdAt').run(conn)
                                        .then(() => {
                                            logger.log(`Table ${tb} and index are available.`);
                                            conn.close();
                                            return conn;
                                        });
                                });
                            });
                        })
                        .catch(function(error) {
                            if (error) {
                                logger.warn(`Could not wait for the completion of the index ${tb}
                                ${error}`);
                                process.exit(1);
                            }
                            logger.log(`Table ${tb} and index are available.`);
                            conn.close();
                        });
                    });
                });
          });
        return conn;
    },
    inject: [ConfigService],
}