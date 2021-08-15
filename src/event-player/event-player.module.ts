import { Module } from '@nestjs/common';
import { EventService } from 'src/event/event.service';
import { RethinkModule } from 'src/rethink-db/rethink.module';
import { EventPlayerResolver } from './event-player.resolver';
import { EventPlayerService } from './event-player.service';

@Module({
  imports: [RethinkModule],
  providers: [EventPlayerResolver, EventService, EventPlayerService],
  exports: []
})
export class EventPlayerModule {}
