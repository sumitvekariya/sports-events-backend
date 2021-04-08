import { Inject, Injectable } from '@nestjs/common';
import { UpdateUserInput } from './dto/update-user.input';
import { CreateUserInput } from './dto/create-user.input';

@Injectable()
export class UserService {
    private rethinkService;

    constructor(@Inject('RethinkService') service) {
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

    async create(createUserInput: CreateUserInput) {
        const uuid = await this.rethinkService.generateUID();
        const user = {
            ...createUserInput,
            id: uuid
        }
        const { inserted, changes } = await this.rethinkService.saveDB('users', user);
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
        const { replaced, changes } = await this.rethinkService.updateDB('users', id, rest);
        if (replaced) {
            return changes[0].new_val;
        } else {
            throw Error('Error while updating a user');
        }
    }

    async remove(id: string) {
        const { deleted, changes } = await this.rethinkService.removeDB('users', id);
        if (deleted) {
            return changes[0].old_val;
        } else {
            throw Error('Error while deleting a user');
        }
    }
}
