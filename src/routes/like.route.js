const express = require('express');
const router = express.Router();
const likeController = require('../controllers/like.controller');
const auth = require('../middleware/auth.middleware');
const Role = require('../utils/userRoles.utils');
const awaitHandlerFactory = require('../middleware/awaitHandlerFactory.middleware');

const { likeSchema } = require('../middleware/validators/likeValidator.middleware');


router.post('/id/:id', auth(), likeSchema, awaitHandlerFactory(likeController.likePost)); // localhost:3000/api/v1/likes/id/10


module.exports = router;