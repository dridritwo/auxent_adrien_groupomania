const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/upload.controller');
const auth = require('../middleware/auth.middleware');
const awaitHandlerFactory = require('../middleware/awaitHandlerFactory.middleware');
const multer = require('../middleware/multer-config');

router.post('/', auth(), multer, awaitHandlerFactory(uploadController.uploadImage)); // localhost:3000/api/v1/upload


module.exports = router;