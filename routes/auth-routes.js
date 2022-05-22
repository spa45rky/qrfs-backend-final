const express = require('express');
const mongoose = require('mongoose');
const auth_router = express.Router();
const authController = require('../controllers/authController');

// USER LOGIN ROUTES
auth_router.post('/login', authController.login);

// USER REGISTER ROUTES
auth_router.post('/register', authController.register);

// auth_router.post('/extra', authController.extra);


module.exports = auth_router;