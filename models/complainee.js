const mongoose = require('mongoose');

const complaineeSchema = mongoose.Schema({
    username: {
        type: String,
        // required: [true, "USERNAME IS REQUIRED!"],
        min: [5, "MINIMUM 10 CHARACTERS ARE REQUIRED!"],
        max: [10, "USERNAME CAN'T EXCEED 10 CHARACTERS!"],
    },
    email: {
        type: String,
        // index: false,
        required: [true, "EMAIL IS REQUIRED!"],
        // unique: true,
    },
    password: {
        type: String,
        // required: [true, "PASSWORD IS REQUIRED!"],
        min: [12, "MINIMUM 12 CHARACTERS ARE REQUIRED!"],
        max: [20, "PASSWORD CAN'T EXCEED 20 CHARACTERS!"],
    },
    complaints: [{
        type: Object,
        title: String,
        description: String,
        category: String,
        status: String,
        assignedTo: [{
            ID: { type: String },
            username: { type: String },
            email: { type: String },
        }],
    }],
    feedback: [{
        type: Object,
        complaint_id: String,
        response: String,
    }],
    rating: { type: Number },
    level: { type: Number },
    points: { type: Number },
    inventory: [{
        type: Object,
        videos: [{
            type: Object,
            data: Buffer,
            contentType: String
        }]
    }]

}, { versionKey: false });

module.exports = mongoose.model('Complainee', complaineeSchema);