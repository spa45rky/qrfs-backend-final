const express = require('express');
const mongoose = require('mongoose');
const auth_router = express.Router();
const authController = require('../controllers/authController');

// USER GET ROUTES
auth_router.post('/login', authController.login);


module.exports = auth_router;