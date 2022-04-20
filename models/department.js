const mongoose = require('mongoose');

const deptSchema = mongoose.Schema({
    title: {
        type: String,
        required: [true, "TITLE IS REQUIRED!"],
        min: [5, "MINIMUM 10 CHARACTERS ARE REQUIRED!"],
        max: [10, "TITLE CAN'T EXCEED 10 CHARACTERS!"],
    },
    service_providers: [{
        type: Object
    }],
    complaints: [{
        type: Object
    }],
    rules: {

    },
    company_id: { type: String, required: true }

}, { versionKey: false });

module.exports = mongoose.model("Department", deptSchema);