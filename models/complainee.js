const mongoose = require('mongoose');

const complaineeSchema = mongoose.Schema({
    user_id: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
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