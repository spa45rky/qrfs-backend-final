const mongoose = require('mongoose');

const complaintSchema = mongoose.Schema({
    title: {
        type: String,
        // required: [true, "TITLE IS REQUIRED!"],
        min: [5, "MINIMUM 10 CHARACTERS ARE REQUIRED!"],
        max: [10, "TITLE CAN'T EXCEED 10 CHARACTERS!"],
    },
    complainee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Complainee'
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    media: {
        data: Buffer,
        contentType: String
    },
    dateCreated: {
        type: Date
    },
    dateUpdated: {
        type: Date
    },
    dateResolved: {
        type: Date
    },
    status: { type: String },
    assignedTo: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ServiceProvider'
    }],
    geolocation: {
        latitude: { type: Number },
        longitude: { type: Number }
    },
    rating: {
        type: Number,
    }



}, { versionKey: false });

module.exports = mongoose.model("Complaint", complaintSchema);