const express = require('express');
const user_router = express.Router();
const userController = require('../controllers/userController');

// USERS COMPLAINT ROUTES
user_router.get('/complaints/:status', userController.getAllComplaints);
user_router.post('/complaints/file/:id', userController.fileNewComplaint);
user_router.put('/complaints/update/:id', userController.updateComplaint);
user_router.delete('/complaints/delete/:id', userController.deleteComplaint);
// user_router.delete('/deleteAll', userController.deleteAll);

module.exports = user_router;