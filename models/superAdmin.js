const mongoose = require('mongoose');

const superAdminSchema = mongoose.Schema({
    username: {
        type: String,
        required: [true, "USERNAME IS REQUIRED!"],
        min: [5, "MINIMUM 10 CHARACTERS ARE REQUIRED!"],
        max: [10, "USERNAME CAN'T EXCEED 10 CHARACTERS!"],
    },
    email: {
        type: String,
        // index: false,
        // unique: true,
        required: [true, "EMAIL IS REQUIRED!"],
        // match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    },
    password: {
        type: String,
        required: [true, "PASSWORD IS REQUIRED!"],
        min: [12, "MINIMUM 12 CHARACTERS ARE REQUIRED!"],
        max: [20, "PASSWORD CAN'T EXCEED 20 CHARACTERS!"],
        // match: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,20}$/
    },
    img: {
        data: Buffer,
        contentType: String
    },
    analytics: {

    }

}, { versionKey: false });

module.exports = mongoose.model('SuperAdmin', superAdminSchema);