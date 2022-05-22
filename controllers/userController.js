const Complaint = require('../models/complaint');
const User = require('../models/user');
const Complainee = require('../models/complainee');

exports.getAllComplaints = async(req, res) => {
    try {
        const status = req.params.status;
        await Complaint.find({ status: status }, (err, complaints) => {
            if (err) res.send("NOT ABLE TO GET COMPLAINT LIST!");
            else if (complaints == null) res.send("NOT ABLE TO FIND COMPLAINTS WITH STATUS: " + status);
            else res.send(complaints);
        });
    } catch (err) {
        console.log(err);
    }
}

exports.fileNewComplaint = (req, res) => {
    try {
        const title = req.body.title;
        const description = req.body.description;
        const category = req.body.category; // complete object
        const date_created = new Date();
        const status = (category == null) ? "pending" : "created";
        const user_id = req.params.id;
        Complaint.create({
            title: title,
            description: description,
            category: category,
            dateCreated: date_created,
            status: status,
            user_id: user_id
        }, (err, complaint) => {
            if (err) res.send("NOT ABLE TO FILE A COMPLAINT! " + err);
            else res.send("COMPLAINT IS SUCCESSFULLY FILED!");
        });
    } catch (err) {
        console.log(err);
    }
}

exports.updateComplaint = async(req, res) => {
    try {
        const title = req.body.title;
        const description = req.body.description;
        const category = req.body.category;
        const date_created = req.body.date;
        const status = req.body.status;
        await Complaint.findOneAndUpdate({ _id: req.params.id }, {
            title: title,
            description: description,
            category: category,
            dateCreated: date_created,
            status: status
        }, (err, complaint) => {
            if (err) res.send("NOT ABLE TO UPDATE THE COMPLAINT!");
            else res.send("COMPLAINT IS UPDATED SUCCESSFULLY!");
        })
    } catch (err) {
        console.log(err);
    }
}

exports.deleteComplaint = async(req, res) => {
    try {
        await Complaint.findOneAndDelete(req.params.id, (err, result) => {
            if (err) res.send("NOT ABLE TO DELETE THE COMPLAINT!");
            else res.send("COMPLAINT IS SUCCESSFULLY DELETED!");
        })
    } catch (err) {
        console.log(err);
    }
}