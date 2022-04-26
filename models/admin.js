const mongoose = require('mongoose');

const adminSchema = mongoose.Schema({

}, { versionKey: false });

module.exports = mongoose.model("Admin", adminSchema);