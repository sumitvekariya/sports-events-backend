import { Module } from '@nestjs/common';
import { CoreBotService } from './core.bot.service';
import { CoreBotUpdate } from './core.bot.update';
import { StartScene } from '../start/start.scene';
import { RethinkModule } from '../../rethink-db/rethink.module';
import { NewEventScene } from '../events/add-event.scene';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [RethinkModule],
  // providers: [CoreBotUpdate, CoreBotService],
  providers: [CoreBotUpdate, CoreBotService, ConfigService, StartScene, NewEventScene]
})
export class CoreBotModule {}