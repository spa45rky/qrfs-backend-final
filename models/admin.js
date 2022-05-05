const mongoose = require('mongoose');

const adminSchema = mongoose.Schema({
    name: {
        type: String,
    }
}, { versionKey: false });

module.exports = mongoose.model("Admin", adminSchema);