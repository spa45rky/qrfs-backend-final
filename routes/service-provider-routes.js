const express = require('express');
const service_provider_router = express.Router();
const serviceProviderController = require('../controllers/serviceProviderController');

service_provider_router.get('/complaints/assigned/:id', serviceProviderController.getAssignedComplaints);
service_provider_router.put('/complaints/update/:id', serviceProviderController.updateComplaint);
service_provider_router.put('/complaints/resolve/:sp_id/:c_id', serviceProviderController.resolveComplaint);
service_provider_router.put('/complaints/transfer/:id', serviceProviderController.transferComplaint);

module.exports = service_provider_router;