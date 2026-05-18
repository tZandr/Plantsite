import express from 'express';
import {
  loginUserController,
  refreshTokenController,
  logoutUserController,
  getMe
} from '../controllers/auth.controllers';
import { requireAuth } from '../middleware/auth.middleware';

const routes = express.Router();

routes.post('/login', loginUserController);

routes.post('/refresh', refreshTokenController);

routes.post('/logout', logoutUserController);

routes.get('/me', requireAuth, getMe);

export default routes;
