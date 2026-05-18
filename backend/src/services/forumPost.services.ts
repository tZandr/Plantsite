import { ForumPost } from '../models/forumPost.model';
import type { IPost, IComment } from '../models/forumPost.model';

// Create
export const createPost = async (data: IPost) => {
  const posts = await ForumPost.create(data);
  return posts;
};

// Read
export const getAllPosts = async () => {
  const posts = await ForumPost.find();
  return posts;
};

export const getPostById = async (PostId: string) => {
  const post = await ForumPost.findById(PostId);

  if (!post) {
    throw new Error('Post not found.');
  }

  return post;
};

// Update
export const updatePost = async (PostId: string, data: any) => {
  const post = await ForumPost.findByIdAndUpdate(PostId, data, {
    new: true,
    runValidators: true,
  });
  if (!post) {
    throw new Error('Post not found');
  }
  return post;
};

// Delete
export const deletePost = async (postId: string) => {
  const post = await ForumPost.findByIdAndDelete(postId);

  if (!post) {
    throw new Error('Post not found.');
  }

  return post;
};

// Create(comment)
export const addCommentToPost = async (postId: string, comment: IComment) => {
  const post = await ForumPost.findById(postId);

  if (!post) {
    throw new Error('Post not found.');
  }
  post.comments.push(comment);
  await post.save();
  return post;
};
