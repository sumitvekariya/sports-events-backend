import { Module } from '@nestjs/common';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';
import { RethinkModule } from '../rethink-db/rethink.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';
import { GqlAuthGuard } from './guards/gql-auth.guard';

@Module({
    imports: [
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get<string>('JWT_SALT'),
                signOptions: {
                    expiresIn: configService.get<number>('JWT_ACCESS_TOKEN_EXPIRATION_TIME') // 60s or 60m or 2h
                }
            }),
            inject: [ConfigService] 
        }),
        RethinkModule,
        ConfigModule
    ],
    providers: [UserResolver, UserService, JwtStrategy, GqlAuthGuard]
})
export class UserModule {}
