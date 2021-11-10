const express = require("express");
const path = require('path');
const dotenv = require('dotenv');
const cors = require("cors");
const HttpException = require('./utils/HttpException.utils');
const errorMiddleware = require('./middleware/error.middleware');
const userRouter = require('./routes/user.route');
const postRouter = require('./routes/post.route');
const likeRouter = require('./routes/like.route');
const commentRouter = require('./routes/comment.route');
const uploadRouter = require('./routes/upload.route');

// Init express
const app = express();
// Init environment
dotenv.config();
// parse requests of content-type: application/json
// parses incoming requests with JSON payloads
app.use(express.json());
// enabling cors for all requests by using cors middleware
app.use(cors());
// Enable pre-flight
app.options("*", cors());

const port = Number(process.env.PORT || 3331);

app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(`/api/v1/users`, userRouter);
app.use(`/api/v1/posts`, postRouter);
app.use(`/api/v1/likes`, likeRouter);
app.use(`/api/v1/comments`, commentRouter);
app.use(`/api/v1/upload`, uploadRouter);

// 404 error
app.all('*', (req, res, next) => {
    const err = new HttpException(404, 'Endpoint Not Found');
    next(err);
});

// Error middleware
app.use(errorMiddleware);

// starting the server
app.listen(port, () =>
    console.log(`🚀 Server running on port ${port}!`));


module.exports = app;