const mongoose = require('mongoose');

const addonSchema = mongoose.Schema({
    price: {
        type: Number,
        required: true
    },
    sth: {
        type: String
    }

}, { versionKey: false })

module.exports = mongoose.model("Addon", addonSchema);