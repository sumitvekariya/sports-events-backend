import { Module } from '@nestjs/common';
import { RethinkModule } from 'src/rethink-db/rethink.module';
import { EventService } from './event.service';
import { EventResolver } from './events.resolver';

@Module({
  imports: [RethinkModule],
  providers: [EventResolver, EventService],
})
export class EventModule {}
