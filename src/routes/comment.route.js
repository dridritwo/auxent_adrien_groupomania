const express = require('express');
const router = express.Router();
const postController = require('../controllers/post.controller');
const commentController = require('../controllers/comment.controller');
const auth = require('../middleware/auth.middleware');
const postAuth = require('../middleware/postAuth.middleware');
const Role = require('../utils/userRoles.utils');
const awaitHandlerFactory = require('../middleware/awaitHandlerFactory.middleware');

const { createCommentSchema, updateCommentSchema } = require('../middleware/validators/commentValidator.middleware');


// router.get('/', auth(), awaitHandlerFactory(postController.getAllPosts)); // localhost:3000/api/v1/posts
router.get('/post_id/:post_id', auth(), awaitHandlerFactory(commentController.getPostsByPostId)); // localhost:3000/api/v1/comments/id/1
router.post('/post_id/:post_id', auth(), createCommentSchema, awaitHandlerFactory(commentController.createComment)); // localhost:3000/api/v1/comments/
// router.patch('/id/:id', postAuth(Role.superAdmin), updatePostSchema, awaitHandlerFactory(postController.updatePost)); // localhost:3000/api/v1/posts/id/1 , using patch for partial update
// router.delete('/id/:id', postAuth(Role.admin), awaitHandlerFactory(postController.deletePost)); // localhost:3000/api/v1/posts/id/1


module.exports = router;