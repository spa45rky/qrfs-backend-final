const Complaint = require('../models/complaint');
const User = require('../models/user');
const Complainee = require('../models/complainee');
const Department = require('../models/department');
const SP = require('../models/serviceProvider');
const mongoose = require('mongoose');

// exports.deleteAll = (req, res) => {
//     try {
//         Complaint.deleteMany({}).exec((err, result) => {
//             if (err) throw err;
//             else res.send("DELETED");
//         });
//     } catch (err) {
//         console.log(err);
//     }
// }

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
        const user_id = mongoose.Types.ObjectId(req.body.id);
        const category = req.body.category; // complete object
        // const media = req.body.media;
        const date_created = new Date();
        const company_id = mongoose.Types.ObjectId(req.params.id);
        const status = "FILED";
        if (category !== 0) {
            console.log("assingedDept: " + category.assignedDepartment);
            if (category.assignedDepartment) {
                const id = category.assignedDepartment;
                console.log("id: " + id);
                Department.findOne({ _id: id }).exec((err, department) => {
                    if (err) res.send("NOT ABLE TO FIND THE DEPARTMENT!");
                    else if (department == null) {
                        Complaint.create({
                            title: title,
                            description: description,
                            user_id: user_id,
                            company_id: company_id,
                            category: category.title,
                            status: status,
                            dateCreated: date_created,
                            workUpdate: "IN PROGRESS",
                            // media: media
                        }, (err, complaint) => {
                            if (err) res.send("DEPARTMENT IS NULL AND NOT ABLE TO FILE THE COMPLAINT!");
                            else res.send("DEPARTMENT IS NULL AND COMPLAINT IS SUCCESSFULLY FILED!");
                        });
                    } else {
                        const employees = department.employees;
                        if (employees.length != 0) {
                            SP.find({ department: department._id }, { sort: { assignedComplaints: 1 } }).exec((err, sps) => {
                                if (err) res.send("NOT ABLE TO FIND THE SERVICEPROVIDERS!");
                                else {
                                    Complaint.create({
                                        title: title,
                                        description: description,
                                        user_id: user_id,
                                        company_id: company_id,
                                        category: category.title,
                                        status: status,
                                        dateCreated: date_created,
                                        workUpdate: "IN PROGRESS",
                                        // media: media
                                    }, (err, complaint) => {
                                        if (err) res.send("EMPLOYEES LEN IS ZERO AND NOT ABLE TO FILE THE COMPLAINT!");
                                        else {
                                            if (sps.length == 1) {
                                                SP.updateOne({ _id: sps[0]._id }, { $push: { assignedComplaints: { _id: complaint._id } } }).exec((err, sp) => {
                                                    if (err) res.send("COMPLAINT IS FILED SUCCESSFULLY BUT THE SERVICEPROVIDER ISN'T UPDATED!");
                                                    else res.send("COMPLAINT IS FILED SUCCESSFULLY AND SERVICEPROVIDER IS UPDATED!");
                                                });
                                            } else {
                                                sps = JSON.stringify(sps);
                                                res.send("SPS: " + sps);
                                                // if (sps[0].assignedComplaints.length == sps[1].assignedComplaints.length) {
                                                //     if (sps[0].averageRating >= sps[1].averageRating) {
                                                //         SP.updateOne({ _id: sps[0]._id }, { $push: { assignedComplaints: { _id: complaint._id } } }).exec((err, result) => {
                                                //             if (err) res.send("COMPLAINT IS SUCCESSFULLY FILLED BUT NOT ABLE TO UPDATE THE SERVICEPROVIDER!");
                                                //             else res.send("COMPLAINT IS SUCCESSFULLY FILLED AND SERVICEPROVIDER IS UPDATED!");
                                                //         });
                                                //     } else {
                                                //         SP.updateOne({ _id: sps[1]._id }, { $push: { assignedComplaints: { _id: complaint._id } } }).exec((err, result) => {
                                                //             if (err) res.send("COMPLAINT IS SUCCESSFULLY FILLED BUT NOT ABLE TO UPDATE THE SERVICEPROVIDER!");
                                                //             else res.send("COMPLAINT IS SUCCESSFULLY FILLED AND SERVICEPROVIDER IS UPDATED!");
                                                //         });
                                                //     }
                                                // } else {
                                                //     SP.updateOne({ _id: sps[0]._id }, { $push: { assignedComplaints: { _id: complaint._id } } }).exec((err, result) => {
                                                //         if (err) res.send("COMPLAINT IS SUCCESSFULLY FILLED BUT NOT ABLE TO UPDATE THE SERVICEPROVIDER!");
                                                //         else res.send("COMPLAINT IS SUCCESSFULLY FILLED AND SERVICEPROVIDER IS UPDATED!");
                                                //     });
                                                // }
                                            }
                                        }
                                    });
                                }
                            })
                        } else {
                            Complaint.create({
                                title: title,
                                description: description,
                                user_id: user_id,
                                company_id: company_id,
                                category: category.title,
                                status: status,
                                dateCreated: date_created,
                                workUpdate: "IN PROGRESS",
                                // media: media
                            }, (err, complaint) => {
                                if (err) res.send("EMPLOYEES LEN IS ZERO AND NOT ABLE TO FILE THE COMPLAINT!");
                                else res.send("EMPLOYEES LEN IS ZERO AND COMPLAINT IS SUCCESSFULLY FILED!");
                            });
                        }
                    }
                });
            }
        } else {
            Complaint.create({
                title: title,
                description: description,
                user_id: user_id,
                company_id: company_id,
                category: category.title,
                status: status,
                dateCreated: date_created,
                workUpdate: "IN PROGRESS",
                // media: media
            }, (err, complaint) => {
                if (err) res.send("CATEGORY IS ZERO AND NOT ABLE TO FILE THE COMPLAINT!");
                else res.send("CATEGORY IS ZERO AND COMPLAINT IS SUCCESSFULLY FILED!");
            });
        }
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