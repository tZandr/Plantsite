import type { Request, Response } from 'express';
import * as forumService from '../services/forumPost.services';

interface Params {
  id: string;
}

// Create
export const createPostController = async (req: Request, res: Response) => {
  try {
    const user = req.user as any;

    const postData = {
      ...req.body,
      author: user.username, // <-- nu funkar det!
    };

    const post = await forumService.createPost(postData);
    res.status(201).json({ post });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ message: 'Internal Server Error.' });
  }
};


// Read
export const getAllPostsController = async (req: Request, res: Response) => {
  try {
    const posts = await forumService.getAllPosts();
    res.json(posts);
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ message: 'Posts not found.' });
  }
};

export const getPostByIdController = async (
  req: Request<Params>,
  res: Response,
) => {
  try {
    const post = await forumService.getPostById(req.params.id);
    res.json(post);
  } catch (err) {
    console.error('Error:', err);
    res.status(404).json({ message: 'Post not found.' });
  }
};

// Update
export const updatePostController = async (
  req: Request<Params>,
  res: Response,
) => {
  try {
    const updatedPost = await forumService.updatePost(req.params.id, req.body);
    res.json(updatedPost);
  } catch (err) {
    console.error('Error:', err);
    res.status(401).json({ message: 'Post not found.' });
  }
};

// Delete
export const deletePostController = async (
  req: Request<Params>,
  res: Response,
) => {
  try {
    await forumService.deletePost(req.params.id);
    res.json({ message: 'Post deleted successfully.' });
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: 'Post not found.' });
  }
};
