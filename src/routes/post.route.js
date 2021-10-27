const express = require('express');
const router = express.Router();
const postController = require('../controllers/post.controller');
const auth = require('../middleware/auth.middleware');
const postAuth = require('../middleware/postAuth.middleware');
const Role = require('../utils/userRoles.utils');
const awaitHandlerFactory = require('../middleware/awaitHandlerFactory.middleware');

const { createPostSchema, updatePostSchema } = require('../middleware/validators/postValidator.middleware');


router.get('/', auth(), awaitHandlerFactory(postController.getAllPosts)); // localhost:3000/api/v1/posts
router.get('/hottest', auth(), awaitHandlerFactory(postController.getAllHottestPosts)); // localhost:3000/api/v1/posts/hottest
router.get('/author_id/:author_id', auth(Role.user, Role.admin), awaitHandlerFactory(postController.getPostsByAuthorId)); // localhost:3000/api/v1/posts/id/1
router.post('/', auth(), createPostSchema, awaitHandlerFactory(postController.createPost)); // localhost:3000/api/v1/posts/
router.patch('/id/:id', postAuth(Role.superAdmin), updatePostSchema, awaitHandlerFactory(postController.updatePost)); // localhost:3000/api/v1/posts/id/1 , using patch for partial update
router.delete('/id/:id', postAuth(Role.admin), awaitHandlerFactory(postController.deletePost)); // localhost:3000/api/v1/posts/id/1


module.exports = router;