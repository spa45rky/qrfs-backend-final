const express = require('express');
const superadmin_router = express.Router();
const superadminController = require('../controllers/superadminController');

// SUPERADMIN CUSTOMER ROUTES
superadmin_router.post('/customers/add', superadminController.addCustomer);
superadmin_router.delete('/customers/delete/:id', superadminController.deleteCustomer);

module.exports = superadmin_router;