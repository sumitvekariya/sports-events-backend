import { Resolver, Mutation, Query, Args } from '@nestjs/graphql';
import { CreatePostInput } from './dto/create-post.input';
import { PostType } from "./post.type";
import { PostService } from './post.service';
import { UpdatePostInput } from './dto/update-post.input';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../user/guards/gql-auth.guard';

@Resolver(of => PostType)
@UseGuards(GqlAuthGuard)
export class PostResolver {
    constructor(private postService: PostService) {}

    @Query(() => [PostType])
    getAllPosts() {
        return this.postService.getAll();
    }

    @Query(() => PostType)
    getPost(@Args('id') id: string) {
        return this.postService.getOne(id);
    }

    @Mutation(() => PostType)
    createPost(@Args('createPostInput') createPostInput: CreatePostInput) {
        return this.postService.create(createPostInput);
    }

    @Mutation(() => PostType)
    updatePost(@Args('updatePostInput') updatePostInput: UpdatePostInput) {
        return this.postService.update(updatePostInput);
    }

    @Mutation(() => PostType)
    removePost(@Args('id') id: string) {
        return this.postService.remove(id);
    }
}