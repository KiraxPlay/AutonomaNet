import { Router } from 'express';
import { authRequired } from '../middlewares/validateToken.js';
import { createComment, getCommentsByTask } from '../controllers/comment.controller.js';

const router = Router();

router.post('/task/:id/comments', authRequired, createComment);
router.get('/task/:id/comments', authRequired, getCommentsByTask);

export default router;
