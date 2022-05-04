const express = require('express');
const mongoose = require('mongoose');
const auth_router = express.Router();
const authController = require('../controllers/authController');

// USER GET ROUTES
auth_router.get('/login', authController.login);
// auth_router.post('/register', authController.register);
// auth_router.get('/logout', authController.logout);
// auth_router.get('/profile', authController.profile);


module.exports = auth_router;