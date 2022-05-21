const express = require('express');
const superadmin_router = express.Router();
const superadminController = require('../controllers/superadminController');

// SUPERADMIN CUSTOMER ROUTES
superadmin_router.post('/customers/add', superadminController.addCustomer);
superadmin_router.delete('/customers/delete/:id', superadminController.deleteCustomer);
superadmin_router.put('/customers/update/:id', superadminController.editCustomer);

module.exports = superadmin_router;