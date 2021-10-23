const HttpException = require('../utils/HttpException.utils');
const UserModel = require('../models/user.model');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const postModel = require('../models/post.model');
dotenv.config();

const commentAuth = (...roles) => {
    return async function (req, res, next) {
        try {
            const authHeader = req.headers.authorization;
            const bearer = 'Bearer ';

            if (!authHeader || !authHeader.startsWith(bearer)) {
                throw new HttpException(401, 'Access denied. No credentials sent!');
            }

            const token = authHeader.replace(bearer, '');
            const secretKey = process.env.SECRET_JWT || "";

            // Verify Token
            const decoded = jwt.verify(token, secretKey);
            const user = await UserModel.findOne({ id: decoded.user_id });
            
            if (!user) {
                throw new HttpException(401, 'Authentication failed!');
            }
            req.currentUser = user;

            next();

        } catch (e) {
            e.status = 401;
            next(e);
        }
    }
}

module.exports = commentAuth;