const mongoose = require('mongoose');

const subscriptionSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
}, { versionKey: false });

module.exports = mongoose.model("Subscription", subscriptionSchema);