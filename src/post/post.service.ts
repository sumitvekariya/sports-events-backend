import { Inject, Injectable } from '@nestjs/common';
import { CreatePostInput } from './dto/create-post.input';
import { UpdatePostInput } from './dto/update-post.input';

@Injectable()
export class PostService {
  private rethinkService;

  constructor(@Inject('RethinkService') service) {
    this.rethinkService = service;
  }

  async getAll() {
    const result = await this.rethinkService.getDB('postMessages');
    return result;
  }

  async subscribe() {
    const result = await this.rethinkService.getSubscription('postMessages');
    return result;
  }

  async getOne(id: string) {
    const result = await this.rethinkService.getByID('postMessages', id);
    return result;
  }

  async create(userId: string, createPostInput: CreatePostInput) {
    const uuid = await this.rethinkService.generateUID();
    const post = {
      ...createPostInput,
      id: uuid,
      idArray: [],
      count: 0,
      owner: userId,
    };
    const { inserted, changes } = await this.rethinkService.saveDB(
      'postMessages',
      post,
    );
    if (inserted) {
      return changes[0].new_val;
    } else {
      throw Error('post was not created');
    }
  }

  async update(updatePostInput: UpdatePostInput) {
    const { id, ...rest } = updatePostInput;
    const { replaced, changes } = await this.rethinkService.updateDB(
      'postMessages',
      id,
      updatePostInput,
    );
    if (replaced) {
      return changes[0].new_val;
    } else {
      throw Error('Error while updating a post');
    }
  }

  async remove(id: string) {
    const { deleted } = await this.rethinkService.removeDB('postMessages', id);
    if (deleted) {
      return id;
    } else {
      throw Error('Error while deleting a post');
    }
  }
}
