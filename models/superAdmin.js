const mongoose = require('mongoose');

const superAdminSchema = mongoose.Schema({

    // analytics: [{
    
    // }]

}, { versionKey: false });

module.exports = mongoose.model('SuperAdmin', superAdminSchema);