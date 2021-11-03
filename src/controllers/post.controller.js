const PostModel = require('../models/post.model');
const HttpException = require('../utils/HttpException.utils');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

/******************************************************************************
 *                              Post Controller
 ******************************************************************************/
class PostController {
    getAllPosts = async (req, res, next) => {
        let page = req.query.page ? req.query.page : 0;
        let limit = req.query.limit ? req.query.limit : 5;
        let postList = await PostModel.find(page, limit, req.currentUser.id);
        if (!postList) {
            throw new HttpException(404, 'Posts not found');
        }
        postList = postList.map(post => {
            const formatedPost = {
                authorName: post.author_username,
                authorAvatarUrl: post.author_avatar_url,
                title: post.title,
                text: post.text,
                postImageUrl: post.image_url,
                postCreationDate: post.creation_date,
                authorId: post.author_id,
                id: post.id,
                likes: post.likes,
                dislikes: post.dislikes,
                likeStatus: post.like_status || 0,
                commentsCount: post.comments_count
            }
            return formatedPost;
        });
        res.send(postList);
    };


    getAllHottestPosts = async (req, res, next) => {
        let page = req.query.page ? req.query.page : 0;
        let limit = req.query.limit ? req.query.limit : 5;
        
        let postList = await PostModel.findHottest(page, limit, req.currentUser.id);
        if (!postList) {
            throw new HttpException(404, 'Posts not found');
        }

        postList = postList.map(post => {
            const formatedPost = {
                authorName: post.author_username,
                authorAvatarUrl: post.author_avatar_url,
                title: post.title,
                text: post.text,
                postImageUrl: post.image_url,
                postCreationDate: post.creation_date,
                authorId: post.author_id,
                id: post.id,
                likes: post.likes,
                dislikes: post.dislikes,
                likeStatus: post.like_status || 0,
                commentsCount: post.comments_count,
                hotness: post.hotness
            }
            return formatedPost;
        });
        res.send(postList);
    };

    getPostsByAuthorId = async (req, res, next) => {
        let page = req.query.page ? req.query.page : 0;
        let limit = req.query.limit ? req.query.limit : 5;
        let postList = await PostModel.findAllByAuthorId({ author_id: req.params.author_id }, page, limit, req.currentUser.id);
        if (!postList) {
            throw new HttpException(404, 'Posts not found');
        }

        postList = postList.map(post => {
            const formatedPost = {
                authorName: post.author_username,
                authorAvatarUrl: post.author_avatar_url,
                title: post.title,
                text: post.text,
                postImageUrl: post.image_url,
                postCreationDate: post.creation_date,
                authorId: post.author_id,
                id: post.id,
                likes: post.likes,
                dislikes: post.dislikes,
                likeStatus: post.like_status || 0,
                commentsCount: post.comments_count
            }
            return formatedPost;
        });

        res.send(postList);
    };

    createPost = async (req, res, next) => {
        
        this.checkValidation(req);
        req.body.author_id = req.currentUser.id;

        const result = await PostModel.create(req.body);

        if (!result) {
            throw new HttpException(500, 'Something went wrong');
        }

        res.status(201).send('Post was created!');
    };

    updatePost = async (req, res, next) => {
        this.checkValidation(req);

        // do the update query and get the result
        // it can be partial edit
        const result = await PostModel.update(req.body, req.params.id);

        if (!result) {
            throw new HttpException(404, 'Something went wrong');
        }

        const { affectedRows, changedRows, info } = result;

        const message = !affectedRows ? 'Post not found' :
            affectedRows && changedRows ? 'Post updated successfully' : 'Updated faild';

        res.send({ message, info });
    };

    deletePost = async (req, res, next) => {
        const result = await PostModel.delete(req.params.id);
        if (!result) {
            throw new HttpException(404, 'Post not found');
        }
        res.send('Post has been deleted');
    };

    checkValidation = (req) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            console.log("errors : ", errors)
            throw new HttpException(400, 'Validation faild', errors);
        }
    }

    
}


module.exports = new PostController;