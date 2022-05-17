const mongoose = require('mongoose');

const adminSchema = mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
}, { versionKey: false });

module.exports = mongoose.model("Admin", adminSchema);