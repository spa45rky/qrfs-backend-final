const express = require('express');
const user_router = express.Router();
const userController = require('../controllers/userController');

// USERS COMPLAINT ROUTES
user_router.get('/complaints/:status', userController.getAllComplaints);
user_router.post('/complaints/file/complaint/:id', userController.fileNewComplaint);
user_router.put('/complaints/update/:id', userController.updateComplaint);
user_router.delete('/complaints/delete/:id', userController.deleteComplaint);

module.exports = user_router;