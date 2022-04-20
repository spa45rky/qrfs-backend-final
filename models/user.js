const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "NAME IS REQUIRED!"],
        min: [5, "MINIMUM 10 CHARACTERS ARE REQUIRED!"],
        max: [10, "USERNAME CAN'T EXCEED 10 CHARACTERS!"],
        lowercase: true,
        match: /^[a-zA-Z0-9]+$/

    },
    email: {
        type: String,
        index: false,
        required: [true, "EMAIL IS REQUIRED!"],
        unique: true,
        match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    },
    password: {
        type: String,
        required: [true, "PASSWORD IS REQUIRED!"],
        min: [12, "MINIMUM 12 CHARACTERS ARE REQUIRED!"],
        max: [20, "PASSWORD CAN'T EXCEED 20 CHARACTERS!"],
        match: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,20}$/
    },
    sign_type: {

    },
    role: {
        type: String,
        max: [10, "MAXIMUM 10 CHARACTERS ARE REQUIRED!"]
    },
    company_id: {
        type: String,
    },
    img: {
        data: Buffer,
        contentType: String
    }
}, { versionKey: false });

module.exports = mongoose.model("User", userSchema);