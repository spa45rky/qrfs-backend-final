const mongoose = require('mongoose');

const customerSchema = mongoose.Schema({
    title: {
        type: String,
        required: [true, "TITLE IS REQUIRED!"],
        min: [5, "MINIMUM 10 CHARACTERS ARE REQUIRED!"],
        max: [10, "TITLE CAN'T EXCEED 10 CHARACTERS!"],
    },
    subscription_plans: {

    },
    employees: [{
        name: String,
        email: String,
        role: String,
        company_id: String,
        img: {
            data: Buffer,
            contentType: String
        }
    }],
    addons: {

    },
    departments: {

    },
    analytics: {

    },
    billing_info: {

    },
    billing_cycle: {

    }

}, { versionKey: false });

module.exports = mongoose.model("Customer", customerSchema);