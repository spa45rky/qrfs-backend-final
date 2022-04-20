const mongoose = require('mongoose');

const customerSchema = mongoose.Schema({
    username: {
        type: String,
        required: [true, "USERNAME IS REQUIRED!"],
        min: [5, "MINIMUM 10 CHARACTERS ARE REQUIRED!"],
        max: [10, "USERNAME CAN'T EXCEED 10 CHARACTERS!"],
        lowercase: true,
        match: /^[a-zA-Z0-9]+$/

    },
    email: {
        type: String,
        index: false,
        required: [true, "EMAIL IS REQUIRED!"],
        unique: true,
        match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    },
    title: {
        type: String,
        required: [true, "TITLE IS REQUIRED!"],
        min: [5, "MINIMUM 10 CHARACTERS ARE REQUIRED!"],
        max: [10, "TITLE CAN'T EXCEED 10 CHARACTERS!"],
    },
    subscription_plans: {
        type: String
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