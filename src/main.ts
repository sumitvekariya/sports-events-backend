import { NestFactory } from '@nestjs/core';
import { getBotToken } from 'nestjs-telegraf';
import { AppModule } from './app.module';
import * as rethinkDB from 'rethinkdb';

declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  if (process.env.NODE_ENV === 'production') {
    const bot = app.get(getBotToken());
    app.use(bot.webhookCallback(`https://${process.env.TELEGRAM_HOST}/${process.env.TELEGRAM_TOKEN}`));
  }

  app.enableCors();
  await app.listen(parseInt(process.env.PORT));

  // if (module.hot) {
  //   module.hot.accept();
  //   module.hot.dispose(() => app.close());
  // }
}
bootstrap();

 /*
 * Create a RethinkDB connection, and save it in DBInstance.connection
 */
// function createConnection(req, res, next) {
//   rethinkDB.connect(config.rethinkdb.db).then(function() {
//     // connection is saved in DBInstance.connection
//     next();
//   }).catch(err => console.log(err));
// }
