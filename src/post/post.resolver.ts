import { Resolver, Mutation, Query, Args, Subscription } from '@nestjs/graphql';
import { CreatePostInput } from './dto/create-post.input';
import { PostType } from './post.type';
import { PostService } from './post.service';
import { UpdatePostInput } from './dto/update-post.input';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../user/guards/gql-auth.guard';
import { CtxUser } from 'src/user/decorators/ctx-user.decorator';
import { UserType } from '../user/user.type';

@Resolver((of) => PostType)
@UseGuards(GqlAuthGuard)
export class PostResolver {
  constructor(private postService: PostService) {}

  @Query(() => [PostType])
  getAllPosts() {
    return this.postService.getAll();
  }

  @Subscription(() => PostType, {
    name: 'postChanges',
  })
  postChanges() {
    return this.postService.subscribe('postChanges');
  } 

  @Query(() => PostType)
  getPost(@Args('id') id: string) {
    return this.postService.getOne(id);
  }

  @Mutation(() => PostType)
  createPost(
    @CtxUser() user: UserType,
    @Args('createPostInput') createPostInput: CreatePostInput,
  ) {
    if (!user) {
      user = {
        id: 'test',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    }
    // console.log(user, createPostInput)
    const post = this.postService.create(user.id, createPostInput);
    return post;
  }

  @Mutation(() => PostType)
  updatePost(@Args('updatePostInput') updatePostInput: UpdatePostInput) {
    return this.postService.update(updatePostInput);
  }

  @Mutation(() => PostType)
  removePost(@Args('postId') postId: string) {
    return this.postService.remove(postId);
  }
}
