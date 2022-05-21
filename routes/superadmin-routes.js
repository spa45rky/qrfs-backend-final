const express = require('express');
const superadmin_router = express.Router();
const superadminController = require('../controllers/superadminController');

// SUPERADMIN CUSTOMER ROUTES
superadmin_router.post('/customers/add', superadminController.addCustomer);

module.exports = superadmin_router;