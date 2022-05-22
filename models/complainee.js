const mongoose = require('mongoose');

const complaineeSchema = mongoose.Schema({
    user_id: {
        type: mongoose.Types.ObjectId,
    },
    company_id: {
        type: mongoose.Schema.Types.ObjectId,
        // ref: "Customer",
        // required: true
    },
    complaints: [{
        type: Object,
        title: { type: String },
        description: { type: String },
        category: { type: String },
        status: { type: String },
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

}, { versionKey: false });

module.exports = mongoose.model('Complainee', complaineeSchema);