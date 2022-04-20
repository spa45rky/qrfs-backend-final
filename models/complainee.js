const mongoose = require('mongoose');

const complaineeSchema = mongoose.Schema({
    complaints: [{
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
        complaint_id: String,
        response: String,
    }],
    rating: { type: Number },
    level: { type: Number },
    points: { type: Number },
    inventory: [{
        videos: [{
            data: Buffer,
            contentType: String
        }]
    }]

}, { versionKey: false });

module.exports = mongoose.model('Complainee', complaineeSchema);