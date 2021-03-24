import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RethinkModule } from './rethink-db/rethink.module';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { HobbytsBotModule } from './hobbyts-bot/hobbyts-bot.module';
import configuration from './constants/config/configuration';


@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: process.env.NODE_ENV === 'production' ? '.env.prod' : '.env.dev',
      load: [configuration]
    }),
    RethinkModule,
    GraphQLModule.forRoot({
      autoSchemaFile: true,
    }),
    UsersModule,
    HobbytsBotModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
