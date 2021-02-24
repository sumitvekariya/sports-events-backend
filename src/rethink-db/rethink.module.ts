import { Module } from '@nestjs/common';
import { RethinkProvider } from './database.provider';
import { RethinkService } from './rethink.service';
import { RethinkController } from './rethink.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [ConfigModule],
    controllers: [RethinkController],
    providers: [RethinkService, RethinkProvider],
    exports: [RethinkProvider, RethinkService]
})
export class RethinkModule {}