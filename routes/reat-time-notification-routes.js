const express = require('express');
const notifyController = require('../controllers/notifyController');
const notify_router = express.Router();

notify_router.post('/notify/users', notifyController.userNotification);