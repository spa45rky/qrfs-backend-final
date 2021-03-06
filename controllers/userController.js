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

exports.getAllComplaints = (req, res) => {
    try {
        const id = mongoose.Types.ObjectId(req.params.id);
        Complaint.find({ user_id: id }).exec((err, complaints) => {
            if (err) res.send("NOT ABLE TO GET COMPLAINT LIST!");
            else if (complaints == null) res.send("NOT ABLE TO FIND COMPLAINTS");
            else res.send(complaints);
        });
    } catch (err) {
        console.log(err);
    }
}

exports.fileNewComplaint = (req, res) => {

    // REMODEL USING QUERY ORDERING (!IMPORTANT)

    try {
        const title = req.body.title;
        const description = req.body.description;
        const user_id = mongoose.Types.ObjectId(req.body.user_id);
        const category = req.body.category; // complete object
        // const media = req.body.media;
        const date_created = new Date();
        const company_id = mongoose.Types.ObjectId(req.params.id);
        const status = "FILED";
        const complaint_obj = {
            title: title,
            description: description,
            user_id: user_id,
            company_id: company_id,
            category: category.id,
            status: status,
            dateCreated: date_created,
            workUpdate: "IN PROGRESS",
            // media: media
        };
        if (category !== 0) {
            if (category.assignedDepartment) {
                const id = category.assignedDepartment;
                Department.findOne({ _id: id }).exec((err, department) => {
                    if (err) res.send("NOT ABLE TO FIND THE DEPARTMENT!");
                    else if (department == null) {
                        Complaint.create(complaint_obj, (err, complaint) => {
                            if (err) res.send("DEPARTMENT IS NULL AND NOT ABLE TO FILE THE COMPLAINT!");
                            else {
                                Complainee.updateOne({ user_id: user_id }, { $push: { complaints: { _id: complaint._id } } }).exec((err, complainee) => {
                                    if (err) res.send("COMPALINT IS CREATED BUT COMPALINEE IS NOT UPDATED!");
                                    else res.send("COMPALINT IS CREATED AND COMPALINEE IS UPDATED!");
                                });
                            }
                        });
                    } else {
                        const employees = department.employees;
                        if (employees.length != 0) {
                            // add sort here
                            SP.find({ department: department._id }).exec((err, sps) => {
                                if (err) res.send("NOT ABLE TO FIND THE SERVICEPROVIDERS!");
                                else {
                                    Complaint.create(complaint_obj, (err, complaint) => {
                                        if (err) res.send("EMPLOYEES LEN IS ZERO AND NOT ABLE TO FILE THE COMPLAINT!");
                                        else {
                                            Complainee.updateOne({ user_id: user_id }, { $push: { complaints: { _id: complaint._id } } }).exec((err, complainee) => {
                                                if (err) res.send("COMPALINT IS CREATED BUT COMPALINEE IS NOT UPDATED!");
                                                else {
                                                    if (sps.length == 1) {
                                                        SP.updateOne({ _id: sps[0]._id }, { $push: { assignedComplaints: { _id: complaint._id } } }).exec((err, sp) => {
                                                            if (err) res.send("COMPLAINT IS FILED SUCCESSFULLY BUT THE SERVICEPROVIDER ISN'T UPDATED!");
                                                            else {
                                                                Complaint.updateOne({ _id: complaint._id }, { status: "ASSIGNED", $push: { assignedTo: { _id: sps[0]._id } } }).exec((err, result) => {
                                                                    if (err) res.send("COMPLAINT IS FILED SUCCESSFULLY BUT NOT ABLE TO ASSIGN TO THE SERVICEPROVIDER!");
                                                                    else res.send("COMPLAINT IS FILED SUCCESSFULLY AND SUCCESSFULLY ASSIGEND TO THE SERVICEPROVIDER!");
                                                                });
                                                            }
                                                        });
                                                    } else {
                                                        SP.findOne({ _id: sps[0]._id }, 'assignedComplaints averageRating', (err, sp_1) => {
                                                            if (err) res.send("NOT ABLE TO FIND THE SP[0] SERVICEPROVIDER!");
                                                            else {
                                                                SP.findOne({ _id: sps[1]._id }, 'assignedComplaints averageRating', (err, sp_2) => {
                                                                    if (err) res.send("NOT ABLE TO FIND THE SP[1] SERVICEPROVIDER!");
                                                                    else {
                                                                        if (sp_1.assignedComplaints.length == sp_2.assignedComplaints.length) {
                                                                            if (sp_1.averageRating >= sp_2.averageRating) {
                                                                                SP.updateOne({ _id: sp_1._id }, { $push: { assignedComplaints: { _id: complaint._id } } }).exec((err, result) => {
                                                                                    if (err) res.send("COMPLAINT IS SUCCESSFULLY FILLED BUT NOT ABLE TO UPDATE THE SERVICEPROVIDER!");
                                                                                    else {
                                                                                        Complaint.updateOne({ _id: complaint._id }, { status: "ASSIGNED", $push: { assignedTo: { _id: sp_1._id } } }).exec((err, result) => {
                                                                                            if (err) res.send("COMPLAINT IS FILED SUCCESSFULLY BUT NOT ABLE TO ASSIGN TO THE SERVICEPROVIDER!");
                                                                                            else res.send("COMPLAINT IS FILED SUCCESSFULLY AND SUCCESSFULLY ASSIGEND TO THE SERVICEPROVIDER!");
                                                                                        });
                                                                                    }
                                                                                });
                                                                            } else {
                                                                                SP.updateOne({ _id: sp_2._id }, { $push: { assignedComplaints: { _id: complaint._id } } }).exec((err, result) => {
                                                                                    if (err) res.send("COMPLAINT IS SUCCESSFULLY FILLED BUT NOT ABLE TO UPDATE THE SERVICEPROVIDER!");
                                                                                    else {
                                                                                        Complaint.updateOne({ _id: complaint._id }, { status: "ASSIGNED", $push: { assignedTo: { _id: sp_2._id } } }).exec((err, result) => {
                                                                                            if (err) res.send("COMPLAINT IS FILED SUCCESSFULLY BUT NOT ABLE TO ASSIGN TO THE SERVICEPROVIDER!");
                                                                                            else res.send("COMPLAINT IS FILED SUCCESSFULLY AND SUCCESSFULLY ASSIGEND TO THE SERVICEPROVIDER!");
                                                                                        });
                                                                                    }
                                                                                });
                                                                            }
                                                                        } else if (sp_1.assignedComplaints.length < sp_2.assignedComplaints.length) {
                                                                            SP.updateOne({ _id: sp_1._id }, { $push: { assignedComplaints: { _id: complaint._id } } }).exec((err, result) => {
                                                                                if (err) res.send("COMPLAINT IS SUCCESSFULLY FILLED BUT NOT ABLE TO UPDATE THE SERVICEPROVIDER!");
                                                                                else {
                                                                                    Complaint.updateOne({ _id: complaint._id }, { status: "ASSIGNED", $push: { assignedTo: { _id: sp_1._id } } }).exec((err, result) => {
                                                                                        if (err) res.send("COMPLAINT IS FILED SUCCESSFULLY BUT NOT ABLE TO ASSIGN TO THE SERVICEPROVIDER!");
                                                                                        else res.send("COMPLAINT IS FILED SUCCESSFULLY AND SUCCESSFULLY ASSIGEND TO THE SERVICEPROVIDER!");
                                                                                    });
                                                                                }
                                                                            });
                                                                        } else {
                                                                            SP.updateOne({ _id: sp_2._id }, { $push: { assignedComplaints: { _id: complaint._id } } }).exec((err, result) => {
                                                                                if (err) res.send("COMPLAINT IS SUCCESSFULLY FILLED BUT NOT ABLE TO UPDATE THE SERVICEPROVIDER!");
                                                                                else {
                                                                                    Complaint.updateOne({ _id: complaint._id }, { status: "ASSIGNED", $push: { assignedTo: { _id: sp_2._id } } }).exec((err, result) => {
                                                                                        if (err) res.send("COMPLAINT IS FILED SUCCESSFULLY BUT NOT ABLE TO ASSIGN TO THE SERVICEPROVIDER!");
                                                                                        else res.send("COMPLAINT IS FILED SUCCESSFULLY AND SUCCESSFULLY ASSIGEND TO THE SERVICEPROVIDER!");
                                                                                    });
                                                                                }
                                                                            });
                                                                        }
                                                                    }
                                                                });
                                                            }
                                                        });
                                                    }
                                                }
                                            });
                                        }
                                    });
                                }
                            });
                        } else {
                            Complaint.create(complaint_obj, (err, complaint) => {
                                if (err) res.send("EMPLOYEES LEN IS ZERO AND NOT ABLE TO FILE THE COMPLAINT!");
                                Complainee.updateOne({ user_id: user_id }, { $push: { complaints: { _id: complaint._id } } }).exec((err, complainee) => {
                                    if (err) res.send("COMPALINT IS CREATED BUT COMPALINEE IS NOT UPDATED!");
                                    else res.send("EMPLOYEES LENGTH IS ZERO AND COMPLAINT IS SUCCESSFULLY FILED!");
                                });
                            });
                        }
                    }
                });
            }
        } else {
            Complaint.create(complaint_obj, (err, complaint) => {
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