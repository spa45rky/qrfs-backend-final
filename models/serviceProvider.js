const mongoose = require('mongoose');

const service_providers_schema = mongoose.Schema({
    assignedComplaints: [{
        type: Object,
        title: String,
        description: String,
        category: String,
        status: String,
    }],
    feedbackGiven: [{
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

module.exports = mongoose.model("ServiceProvider", service_providers_schema);