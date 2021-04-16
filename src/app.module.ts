import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { RethinkModule } from './rethink-db/rethink.module';
import { ConfigModule } from '@nestjs/config';
import { HobbytsBotModule } from './hobbyts-bot/hobbyts-bot.module';
import { PostModule } from './post/post.module';
import { UserModule } from './user/user.module';
import configuration from './constants/config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath:
        process.env.NODE_ENV === 'production' ? '.env.prod' : '.env.dev',
      load: [configuration],
    }),
    RethinkModule,
    GraphQLModule.forRoot({
      autoSchemaFile: true,
      context: ({ req }) => ({ headers: req.headers }),
    }),
    HobbytsBotModule,
    UserModule,
    PostModule,
  ],
})
export class AppModule {}
