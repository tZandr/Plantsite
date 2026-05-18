import express from 'express';
import { createUserController, saveArticleController } from '../controllers/user.controllers';
import { requireAuth } from '../middleware/auth.middleware';

const routes = express.Router();

routes.post('/signup', createUserController);

routes.post('/save-article', requireAuth, saveArticleController);

export default routes;
