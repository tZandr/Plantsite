import type { Request, Response } from 'express';
import {
  showLatestArticle,
  searchArticles,
  getAllArticles,
  getArticleById,
  getArticleBySlug,
  createArticle,
  updateArticle,
  deleteArticle,
  getArticlesById
} from '../services/article.services';

import User from '../models/user';
import type { SearchParamsArticle } from '../types/article';
import { JwtPayload } from 'jsonwebtoken';

export const showLatestArticleController = async (req: Request, res: Response) => {
  const article = await showLatestArticle();

  if (!article) {
    return res.status(404).json({ message: 'Article not found' });
  }

  res.json(article);
};

export const searchArticlesController = async (req: Request, res: Response) => {
  try {
    const articles = await searchArticles(req.query as unknown as SearchParamsArticle);
    res.json(articles);
  } catch (err) {
    console.error('Error searching article', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const getArticlesController = async (req: Request, res: Response) => {
  try {
    const articles = await getAllArticles();
    res.json(articles);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err });
  }
};

export const getArticleByIdController = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const article = await getArticleById(id);

  if (!article) {
    return res.status(404).json({ message: 'Article not found' });
  }

  res.json(article);
};

export const getArticlesByIdController = async (req: Request, res: Response) => {
  try {
    const { ids } = req.body;
    const articles = await getArticlesById(ids);
    res.status(200).json({ articles });
  } catch (error) {
    res.status(404).json({ message: error });
  }
};

export const getFavoriteArticlesController = async (req: Request, res: Response) => {
  try {
    const userId = (req.user as JwtPayload).sub as string;
    const user = await User.findById(userId);

    if (!user) throw new Error('User not found');
    const { favoriteArticles } = user;

    if (!favoriteArticles || favoriteArticles.length === 0) {
      return res.status(200).json({ articles: [] });
    }
    const articles = await getArticlesById(favoriteArticles as [number]);
    res.status(200).json({ articles });
  } catch (error) {
    res.status(404).json({ message: error });
  }
};

export const getArticleBySlugController = async (req: Request, res: Response) => {
  const slug = String(req.params.slug);
  const article = await getArticleBySlug(slug);

  if (!article) {
    return res.status(404).json({ message: 'Article not found' });
  }

  res.json(article);
};

export const createArticleController = async (req: Request, res: Response) => {
  const id = await createArticle(req.body);
  res.status(201).json({ id });
};

export const updateArticleController = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  await updateArticle(id, req.body);

  res.json({ message: 'Article updated' });
};

export const deleteArticleController = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  await deleteArticle(id);

  res.json({ message: 'Article deleted' });
};
