import { Module } from '@nestjs/common';
import { CoreBotService } from './core.bot.service';
import { CoreBotUpdate } from './core.bot.update';
import { StartScene } from './start.scene';
import { RethinkModule } from '../../rethink-db/rethink.module';

@Module({
  imports: [RethinkModule],
  providers: [CoreBotUpdate, CoreBotService, StartScene],
})
export class CoreBotModule {}