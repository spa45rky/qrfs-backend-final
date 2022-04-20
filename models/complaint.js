const mongoose = require('mongoose');

const complaintSchema = mongoose.Schema({
    complainee: {
        type: Object,
        name: {
            type: String,
        },
        id: {
            type: String,
        }
    },
    assignedTo: {
        type: Object,
        name: {
            type: String,
        },
        id: {
            type: String,
        }
    },
    details: {
        type: String
    },
    category: {
        type: String
    },
    status: {
        type: String
    },
}, { versionKey: false });

module.exports = mongoose.model("Complaint", complaintSchema);