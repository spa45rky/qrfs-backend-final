const mongoose = require('mongoose');

const customerSchema = mongoose.Schema({
    email: {
        type: String,
        // index: false,
        unique: true,
        required: [true, "EMAIL IS REQUIRED!"],
        match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    },
    title: {
        type: String,
        required: [true, "TITLE IS REQUIRED!"],
    },
    subscription_plan: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Subscription"
    },
    employees: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    addons: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Addon"
    },
    departments: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Department"
    },
    // analytics: {},
    billing_info: {
        type: Object,
        // required: true,
        payment_method: {type: String},
    }

}, { versionKey: false });

module.exports = mongoose.model("Customer", customerSchema);