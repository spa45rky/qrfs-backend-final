const mongoose = require('mongoose');

const customerSchema = mongoose.Schema({
    name: {
        type: String,
        // required: [true, "NAME IS REQUIRED!"],
        // min: [10, "MINIMUM 10 CHARACTERS ARE REQUIRED!"]
    },
    permissions: {
        type: Array,
        // required: true
    }
}, { versionKey: false });

module.exports = mongoose.model("Customer", customerSchema);