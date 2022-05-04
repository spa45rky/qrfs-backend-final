const express = require('express');
const mongoose = require('mongoose');
const auth_router = express.Router();
const authController = require('../controllers/authController');

// USER GET ROUTES
auth_router.get('/login', authController.login);


module.exports = auth_router;