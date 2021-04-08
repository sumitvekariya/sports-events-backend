import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UserService } from '../user.service';
import { ConfigService } from '@nestjs/config';
import { JwtDto } from "../dto/jwt.dto";
import { Injectable, UnauthorizedException } from "@nestjs/common";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly userService: UserService, private configService: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>('JWT_SALT')
        });
    }

    async validate(payload: JwtDto) {
        const user = this.userService.validateUser(payload.id);

        if (!user) {
            throw new UnauthorizedException()
        }

        return user;
    }
}