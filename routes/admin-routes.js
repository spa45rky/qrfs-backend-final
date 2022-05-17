const express = require('express');
const mongoose = require('mongoose');
const admin_router = express.Router();
const adminController = require('../controllers/adminController');

// ADMIN USER ROUTES
admin_router.get('/users', adminController.getUsersList);
// admin_router.get('/users/:id', adminController.getSpecificUser);
admin_router.post('/users/add', adminController.addSpecificUser);
admin_router.put('/users/update/:id', adminController.updateSpecificUser);
admin_router.delete('/users/delete/:id', adminController.deleteSpecificUser);
admin_router.delete('/users/deleteMultiple', adminController.deleteMultipleUsers);

// ADMIN ROLES ROUTES
// admin_router.get('/roles', adminController.getRolesList);
// // admin_router.get('/role/:id', adminController.getSpecificRole);
// admin_router.put('/role/update/:id', adminController.updateSpecificRole);
// admin_router.delete('/role/delete/:id', adminController.deleteSpecificRole);
// admin_router.delete('/role/delete/miultiple', adminController.deleteMultipleRole);

// ADMIN COMPLAINT ROUTES
admin_router.get('/complaints', adminController.getComplaintsList);
// admin_router.get('/complaint/:id', adminController.getSpecificComplaint);
admin_router.put('/complaints/update/:id', adminController.updateSpecificComplaint); //assign
admin_router.put('/complaints/archive/:id', adminController.archiveSpecificComplaint);
admin_router.delete('/complaints/delete/:id', adminController.deleteSpecificComplaint);

// ADMIN DEPARTMENTS ROUTES
admin_router.get('/depts', adminController.getDeptsList);
admin_router.get('/depts/:id', adminController.getSpecificDept);
admin_router.post('/deptsAdd', adminController.addSpecificDept);
admin_router.put('/depts/update/:id', adminController.updateSpecificDept);
admin_router.delete('/depts/delete/:id', adminController.deleteSpecificDept);

// ADMIN PAYMENT ROUTES
// admin_router.get('/payment', adminController.getPaymentInfo);
// admin_router.put('/payment/update', adminController.updatePaymentInfo);
// admin_router.put('/payment/addons', adminController.addServices);
// admin_router.post('/payment/rewards', adminController.addRewards);

module.exports = admin_router;