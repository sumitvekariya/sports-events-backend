import { Module } from '@nestjs/common';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';
import { RethinkModule } from '../rethink-db/rethink.module';

@Module({
    imports: [RethinkModule],
    providers: [UserResolver, UserService]
})
export class UserModule {}
