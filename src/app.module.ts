import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { RethinkModule } from './rethink-db/rethink.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HobbytsBotModule } from './hobbyts-bot/hobbyts-bot.module';
import { PostModule } from './post/post.module';
import { UserModule } from './user/user.module';
import configuration from './constants/config/configuration';
import { ThrottlerModule } from '@nestjs/throttler';
import { EventModule } from './event/event.module';
import { DateScalar } from './scalars/date-scalar';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath:
        process.env.NODE_ENV === 'production' ? '.env.prod' : '.env.dev',
      load: [configuration],
    }),
    RethinkModule,
    GraphQLModule.forRoot({
      installSubscriptionHandlers: true,
      autoSchemaFile: true,
      context: ({ req, connection }) => {
        if (connection) {
          return connection.context;
        } else {
          return ({ headers: req.headers })
        }
      },
      cors: {
        origin: 'https://127.0.0.1',
        credentials: true,
      },
    }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        ttl: config.get<number>('THROTTLE_TTL'),
        limit: config.get<number>('THROTTLE_LIMIT'),
      }),
    }),
    HobbytsBotModule,
    UserModule,
    PostModule,
    EventModule
  ],
  providers: [DateScalar]
})
export class AppModule {}
