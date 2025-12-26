const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const { User } = require('../models/User.model');
const logger = require('../utils/logger');
const { client: redisClient } = require('../config/redisClient');
const ApiError = require('../utils/ApiError');

const protect = asyncHandler(async (req, res, next) => {
    let token;

    //  Check for token in Cookies 
    if (req.cookies && req.cookies.jwt) {
        token = req.cookies.jwt;
    } 
    // Fallback: Check for Bearer token in headers
    else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return next(new ApiError(401, 'Not authorized, no token provided'));
    }

    try {
        // Check if blacklisted
        const isBlacklisted = await redisClient.get(`blacklist:${token}`);
        if (isBlacklisted) {
            // if blacklisted, clear the cookie to prevent loop
            res.clearCookie('jwt'); 
            return next(new ApiError(401, 'Not authorized, token has been invalidated. Please log in again.'));
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select('-password');

        if (!req.user) {
            return next(new ApiError(401, 'Not authorized, user not found'));
        }
        next();

    } catch (error) {
        logger.error(`Token verification failed: ${error.message}`);
        // Clear invalid cookie
        res.clearCookie('jwt');
        return next(new ApiError(401, 'Not authorized, token failed'));
    }
});

const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return next(new ApiError(403, `User role '${req.user.role}' is not authorized for this resource`));
        }
        next();
    };
};

module.exports = { protect, authorize };