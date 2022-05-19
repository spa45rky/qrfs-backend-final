const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        // required: [true, "NAME IS REQUIRED!"],
        min: [5, "MINIMUM 10 CHARACTERS ARE REQUIRED!"],
        max: [10, "USERNAME CAN'T EXCEED 10 CHARACTERS!"],
    },
    email: {
        type: String,
        // index: false,
        required: [true, "EMAIL IS REQUIRED!"],
        unique: true,
    },
    password: {
        type: String,
        required: [true, "PASSWORD IS REQUIRED!"],
        // min: [12, "MINIMUM 12 CHARACTERS ARE REQUIRED!"],
        // max: [20, "PASSWORD CAN'T EXCEED 20 CHARACTERS!"],
    },
    sign_type: {
        type: String,
    },
    role: {
        type: String,
        required: [true, "USER ROLE IS REQUIRED!"],
        enum: ['SUPERADMIN', 'ADMIN', 'COMPLAINEE', 'SERVICEPROVIDER'],
    },
    company_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Customer",
        // required: true
    },
    pfp: {
        data: Buffer,
        contentType: String
    },

}, { versionKey: false });

module.exports = mongoose.model("User", userSchema);