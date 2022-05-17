const mongoose = require('mongoose');
const complaintsSchema = require('../models/complaint');

const deptSchema = mongoose.Schema({
    title: {
        type: String,
        // required: [true, "TITLE IS REQUIRED!"],
        min: [1, "MINIMUM 10 CHARACTERS ARE REQUIRED!"],
        max: [10, "TITLE CAN'T EXCEED 10 CHARACTERS!"],
    },
    // complaints: { type: complaintsSchema },
    rules: {
        type: String
    },
    company_id: {
        type: String,
        // required: true 
    },
    employees: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "ServiceProvider"
    }]
}, { versionKey: false });

module.exports = mongoose.model("Department", deptSchema);