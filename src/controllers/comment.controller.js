const CommentModel = require("../models/comment.model");
const PostModel = require("../models/post.model");
const HttpException = require("../utils/HttpException.utils");
const { validationResult } = require("express-validator");
const dotenv = require("dotenv");
dotenv.config();

/******************************************************************************
 *                              Comment Controller
 ******************************************************************************/
class CommentController {
  createComment = async (req, res, next) => {
    this.checkValidation(req);
    // check if the post exists
    const post = await PostModel.findOne({ id: req.params.post_id})
            
    if (!post) {
        throw new HttpException(404, 'Post not found');
    }
    
    const result = await CommentModel.create({
      post_id: post.id,
      author_id: req.currentUser.id,
      text: req.body.text
    })

    if (!result) {
      throw new HttpException(500, "Something went wrong");
    }

    res.status(201).send("Comment was created!");
  };

  getCommentsByPostId = async (req, res, next) => {
    const commentList = await CommentModel.getByPostId(req.params.post_id);
    if (!commentList) {
      throw new HttpException(404, "Comments not found");
    }

    res.send(commentList);
  }

  deleteComment = async (req, res, next) => {
    const result = await CommentModel.delete(req.params.comment_id);
    if (!result) {
        throw new HttpException(404, 'Comment not found');
    }
    res.send('Comment has been deleted');
};

  checkValidation = (req) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log("errors : ", errors);
      throw new HttpException(400, "Validation faild", errors);
    }
  };
}

module.exports = new CommentController();
