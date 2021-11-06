const express = require('express');
const router = express.Router();
const commentController = require('../controllers/comment.controller');
const auth = require('../middleware/auth.middleware');
const commentAuth = require('../middleware/commentAuth.middleware');
const Role = require('../utils/userRoles.utils');
const awaitHandlerFactory = require('../middleware/awaitHandlerFactory.middleware');

const { createCommentSchema } = require('../middleware/validators/commentValidator.middleware');


router.get('/post_id/:post_id', auth(), awaitHandlerFactory(commentController.getCommentsByPostId)); // localhost:3000/api/v1/comments/id/1
router.post('/post_id/:post_id', auth(), createCommentSchema, awaitHandlerFactory(commentController.createComment)); // localhost:3000/api/v1/comments/
router.delete('/comment_id/:comment_id', commentAuth(Role.admin), awaitHandlerFactory(commentController.deleteComment)); // localhost:3000/api/v1/comments/id/1


module.exports = router;