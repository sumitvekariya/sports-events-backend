import { Module } from '@nestjs/common';
import { PostResolver } from './post.resolver';
import { PostService } from './post.service';
import { RethinkModule } from '../rethink-db/rethink.module';

@Module({
    imports: [RethinkModule],
    providers: [PostResolver, PostService]
})
export class PostModule {}
