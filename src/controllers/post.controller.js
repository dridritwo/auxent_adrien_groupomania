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
        let postList = await PostModel.find(page, limit);
        if (!postList.length) {
            throw new HttpException(404, 'Users not found');
        }

        postList = postList.map(post => {
            const formatedPost = {
                authorName: post.username,
                authorAvatarUrl: post.avatar_url,
                title: post.title,
                text: post.text,
                postImageUrl: post.image_url,
                postCreationDate: post.creation_date,
                authorId: post.author_id,
                id: post.id
            }
            return formatedPost;
        });

        res.send(postList);
    };

    getUserById = async (req, res, next) => {
        const user = await UserModel.findOne({ id: req.params.id });
        if (!user) {
            throw new HttpException(404, 'User not found');
        }

        const { password, ...userWithoutPassword } = user;

        res.send(userWithoutPassword);
    };

    getUserByuserName = async (req, res, next) => {
        const user = await UserModel.findOne({ username: req.params.username });
        if (!user) {
            throw new HttpException(404, 'User not found');
        }

        const { password, ...userWithoutPassword } = user;

        res.send(userWithoutPassword);
    };

    getCurrentUser = async (req, res, next) => {
        const { password, ...userWithoutPassword } = req.currentUser;

        res.send(userWithoutPassword);
    };

    createPost = async (req, res, next) => {
        
        this.checkValidation(req);

        await this.hashPassword(req);
        req.body.author_id = req.currentUser.id;

        const result = await PostModel.create(req.body);

        if (!result) {
            throw new HttpException(500, 'Something went wrong');
        }

        res.status(201).send('Post was created!');
    };

    updateUser = async (req, res, next) => {
        this.checkValidation(req);

        await this.hashPassword(req);

        // do the update query and get the result
        // it can be partial edit
        const result = await UserModel.update(req.body, req.params.id);

        if (!result) {
            throw new HttpException(404, 'Something went wrong');
        }

        const { affectedRows, changedRows, info } = result;

        const message = !affectedRows ? 'User not found' :
            affectedRows && changedRows ? 'User updated successfully' : 'Updated faild';

        res.send({ message, info });
    };

    deletePost = async (req, res, next) => {
        const result = await PostModel.delete(req.params.id);
        if (!result) {
            throw new HttpException(404, 'Post not found');
        }
        res.send('Post has been deleted');
    };

    userLogin = async (req, res, next) => {
        this.checkValidation(req);

        const { email, password: pass } = req.body;

        const user = await UserModel.findOne({ email });

        if (!user) {
            throw new HttpException(401, 'Unable to login!');
        }

        const isMatch = await bcrypt.compare(pass, user.password);

        if (!isMatch) {
            throw new HttpException(401, 'Incorrect password!');
        }

        // user matched!
        const secretKey = process.env.SECRET_JWT || "";
        const token = jwt.sign({ user_id: user.id.toString() }, secretKey, {
            expiresIn: '24h'
        });

        const { password, ...userWithoutPassword } = user;

        res.send({ ...userWithoutPassword, token });
    };

    checkValidation = (req) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            console.log("errors : ", errors)
            throw new HttpException(400, 'Validation faild', errors);
        }
    }

    // hash password if it exists
    hashPassword = async (req) => {
        if (req.body.password) {
            req.body.password = await bcrypt.hash(req.body.password, 8);
        }
    }
}


module.exports = new PostController;