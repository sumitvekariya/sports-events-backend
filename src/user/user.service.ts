import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { UpdateUserInput } from './dto/update-user.input';
import { AuthRegisterInput } from './dto/auth-register.input';
import { AuthLoginInput } from './dto/auth-login.input';
import { UserTokenType } from './user-token.type';
import { JwtService } from '@nestjs/jwt';
import { AuthHelper } from './auth.helper';
import { JwtDto } from './dto/jwt.dto';
// import { createHash } from 'crypto';

@Injectable()
export class UserService {
  private rethinkService;
  private logger = new Logger(UserService.name);

  constructor(
    @Inject('RethinkService') service,
    private jwtService: JwtService,
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
    // createHash
    let found = await this.rethinkService.getDB('users', {
      telegramId: authLoginInput.telegramId,
    });
    if (!found.length) {
      found = await this.create(authLoginInput);
      this.logger.log('New user registered: ' + found.id);
      // throw new UnauthorizedException('Invalid credentials');
    } else {
      found = found[0];
    }
    // if (authLoginInput.password) {
    //     const passwordValid = await AuthHelper.validate(authLoginInput.password, found[0].password);

    //     if (!passwordValid) {
    //         throw new UnauthorizedException('Invalid credentials');
    //     }
    // }
    const payload: JwtDto = { id: found.id };
    return {
      user: found,
      token: this.jwtService.sign(payload),
    };
  }

  async register(authRegisterInput: AuthRegisterInput): Promise<UserTokenType> {
    const found = await this.rethinkService.getDB('users', {
      telegramId: authRegisterInput.telegramId,
    });
    if (found.length > 0) {
      throw new BadRequestException(
        `Cannot register with telegramId ${authRegisterInput.telegramId}`,
      );
    }
    if (authRegisterInput.password) {
      authRegisterInput.password = await AuthHelper.hash(
        authRegisterInput.password,
      );
    }

    const createUser = await this.create(authRegisterInput);

    return {
      user: createUser,
      token: this.jwtService.sign({ id: createUser.id }),
    };
  }

  async validateUser(id: string) {
    // Check here if JWT not expired???
    const result = await this.rethinkService.getByID('users', id);
    return result;
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
