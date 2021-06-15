import {
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { UpdateUserInput } from './dto/update-user.input';
import { AuthLoginInput } from './dto/auth-login.input';
import { JwtService } from '@nestjs/jwt';
import { JwtDto } from './dto/jwt.dto';
// import { createHash } from 'crypto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserService {
  private rethinkService;
  private logger = new Logger(UserService.name);

  constructor(
    @Inject('RethinkService') service,
    private jwtService: JwtService,
    private configService: ConfigService
  ) {
    this.rethinkService = service;
  }

  async getAll() {
    const result = await this.rethinkService.getDB('users');
    return result;
  }

  async getOne(id: string) {
    const result = await this.rethinkService.getByID('users', id);
    return result;
  }

  async login(authLoginInput: AuthLoginInput) {
    let found = await this.rethinkService.getDB('users', {
      telegramId: authLoginInput.telegramId,
    });
    // Register user if new
    if (!found.length) {
      found = await this.create(authLoginInput);
      this.logger.log('New user registered: ' + found.id);
    } else {
      found = found[0];
    }
    // check if user is banned
    if (found.banned) {
      throw new UnauthorizedException('Banned user');
    }
    // if (authLoginInput.password) {
    //     const passwordValid = await AuthHelper.validate(authLoginInput.password, found[0].password);

    //     if (!passwordValid) {
    //         throw new UnauthorizedException('Invalid credentials');
    //     }
    // }
    const payload: JwtDto = { sub: found.id, role: found.role };
    const token = this.jwtService.sign(payload)

    return {
      user: found,
      token
    };
  }

  async validateUser(id: string) {
    const user = await this.rethinkService.getByID('users', id);
    if (user) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async create(createUserInput: AuthLoginInput) {
    const uuid = await this.rethinkService.generateUID();
    const user = {
      ...createUserInput,
      id: uuid,
    };
    const { inserted, changes } = await this.rethinkService.saveDB(
      'users',
      user,
    );
    if (inserted) {
      return changes[0].new_val;
    } else {
      throw Error('user was not created');
    }
  }

  async update(updateUserInput: UpdateUserInput) {
    const { id, ...rest } = updateUserInput;
    if (!rest.firstName) {
      delete rest.firstName;
    }
    if (!rest.lastName) {
      delete rest.lastName;
    }
    const { replaced, changes } = await this.rethinkService.updateDB(
      'users',
      id,
      rest,
    );
    if (replaced) {
      return changes[0].new_val;
    } else {
      throw Error('Error while updating a user');
    }
  }

  async remove(id: string) {
    const { deleted, changes } = await this.rethinkService.removeDB(
      'users',
      id,
    );
    if (deleted) {
      return changes[0].old_val;
    } else {
      throw Error('Error while deleting a user');
    }
  }
}
