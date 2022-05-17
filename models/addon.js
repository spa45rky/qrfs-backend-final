const mongoose = require('mongoose');

const addonSchema = mongoose.Schema({
    price: {
        type: Number,
        required: true
    },
    title: {
        type: String,
        required: true
    }

}, { versionKey: false });

module.exports = mongoose.model("Addon", addonSchema);