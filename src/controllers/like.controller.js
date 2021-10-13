const LikeModel = require("../models/like.model");
const HttpException = require("../utils/HttpException.utils");
const { validationResult } = require("express-validator");
const dotenv = require("dotenv");
dotenv.config();

/******************************************************************************
 *                              Like Controller
 ******************************************************************************/
class LikeController {
  likePost = async (req, res, next) => {
    this.checkValidation(req);
    let postId = parseInt(req.params.id, 10);
    // check if like exists on post id and user id
    const likeExists = await LikeModel.findOne({
      user_id: req.currentUser.id,
      post_id: postId,
    });
    let result;
    if (likeExists) {
      // if exist update like
      result = await LikeModel.update(
        { like_status: req.body.like },
        postId,
        req.currentUser.id
      );
    } else {
      // if not exist create like
      result = await LikeModel.create({
        like_status: req.body.like,
        post_id: postId,
        user_id: req.currentUser.id,
      });
    }

    if (!result) {
      throw new HttpException(500, "Something went wrong");
    }

    res.status(201).send("Like was created!");
  };

  checkValidation = (req) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log("errors : ", errors);
      throw new HttpException(400, "Validation faild", errors);
    }
  };
}

module.exports = new LikeController();
