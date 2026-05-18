import type { Request, Response } from 'express';
import { createUser, saveFavoriteArticle } from '../services/user.services';
import { JwtPayload } from 'jsonwebtoken';

export const createUserController = async (req: Request, res: Response) => {
  try {
    const newUser = await createUser(req.body);
    res.status(200).json(newUser);
  } catch (error) {
    res.status(400).json({ message: error });
  }
};

export const saveArticleController = async (req: Request, res: Response) => {
  try {
    const { articleId } = req.body;
    const userId = (req.user as JwtPayload).sub as string;
    await saveFavoriteArticle(articleId, userId);
    res.status(200).json({ message: 'successfully saved article' });
  } catch (error) {
    res.status(401).json({ message: error });
  }
};
