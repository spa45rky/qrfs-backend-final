const express = require('express');
const mongoose = require('mongoose');
const user_router = express.Router();
const userController = require('../controllers/userController');

// USER GET ROUTES
user_router.get('/', userController.login);
user_router.post('/register', userController.register);
user_router.get('/logout', userController.logout);
user_router.get('/profile', userController.profile);


module.exports = user_router;