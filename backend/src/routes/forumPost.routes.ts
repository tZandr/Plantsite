import { Router } from 'express';
import * as ForumPostController from '../controllers/forumPost.controller';
import { requireAuth } from '../middleware/auth.middleware';

const router = Router();

router.get('/', ForumPostController.getAllPostsController);
router.get('/:id', ForumPostController.getPostByIdController);

router.post('/', requireAuth, ForumPostController.createPostController);

router.put('/:id', ForumPostController.updatePostController);

router.delete('/:id', ForumPostController.deletePostController);

export default router;
