import { Router } from 'express';
import {
  showLatestArticleController,
  searchArticlesController,
  getArticlesController,
  getArticleByIdController,
  getArticleBySlugController,
  createArticleController,
  updateArticleController,
  deleteArticleController,
  getArticlesByIdController,
  getFavoriteArticlesController,
} from '../controllers/article.controllers';
import { requireAuth } from '../middleware/auth.middleware';

const router = Router();

router.get('/latest', showLatestArticleController);

router.get('/search', searchArticlesController);

router.get('/', getArticlesController);

router.post('/get/by-ids', getArticlesByIdController);

router.get('/favorites', requireAuth, getFavoriteArticlesController);

router.get('/get/:id', getArticleByIdController);

router.get('/:slug', getArticleBySlugController);

router.post('/', createArticleController);

router.put('/get/:id', updateArticleController);

router.delete('/get/:id', deleteArticleController);

export default router;
