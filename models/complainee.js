const mongoose = require('mongoose');

const complaineeSchema = mongoose.Schema({
    complaints: [{

    }],
    feedback: [{

    }],
    rating: { type: Number },
    level: { type: Number },
    points: { type: Number },
    inventory: {}

}, { versionKey: false });

module.exports = mongoose.model('Complainee', complaineeSchema);