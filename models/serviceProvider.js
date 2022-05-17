const mongoose = require('mongoose');

const service_providers_schema = mongoose.Schema({
    user_id: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
     },
    assignedComplaints: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Complaint"
    }],
    feedbackGiven: [{
        type: Object,
        complaint_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Complaint"
        },
        response: String,
    }],
    department: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Department"
    },
    ratings: [{ 
        type: Object,
        complaint_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Complaint"
        },
        complainee_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Complainee"
        }
    }],
    averageRating: {
        type: Number,
    },
    level: { type: Number },
    points: { type: Number },
    // inventory: [{
    //     type: Object,
    // }]

}, { versionKey: false });

module.exports = mongoose.model("ServiceProvider", service_providers_schema);