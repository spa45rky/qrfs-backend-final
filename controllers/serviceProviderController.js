const SP = require('../models/serviceProvider');
const Complaint = require('../models/complaint');
const mongoose = require('mongoose');

exports.getAssignedComplaints = (req, res) => {
    try {
        const sp_id = mongoose.Types.ObjectId(req.params.id);
        SP.find({ _id: sp_id }).select('assignedComplaints').exec((err, result) => {
            if (err) res.send("NOT ABLE TO GET THE ASSIGNED COMPLAINTS!");
            else {
                const complaint_ids = result[0].assignedComplaints;
                Complaint.find({ _id: { "$in": complaint_ids } }).exec((err, result) => {
                    if (err) res.send("NOT ABLE TO FIND ANY COMPLAINT!");
                    else res.send(result);
                })
            }
        });

    } catch (err) {
        console.log(err);
    }
}

exports.updateComplaint = (req, res) => {
    try {
        const status = req.body.status;
        const workUpdate = req.body.workUpdate;
        const id = mongoose.Types.ObjectId(req.params.id);
        Complaint.updateOne({ _id: id }, { status: status, workUpdate: workUpdate }).exec((err, complaint) => {
            if (err) res.send("SERVICEPROVIDER ISN'T ABLE TO UPDATE THE COMPLAINT!");
            else res.send("SERVICEPROVIDER HAS SUCCESSFULLY UPDATED THE COMPLAINT!");
        });
    } catch (err) {
        console.log(err);
    }
}

exports.resolveComplaint = async(req, res) => {
    try {
        const sp_id = req.params.sp_id;
        const c_id = req.params.c_id;
        const status = req.body.status;
        const query = { _id: sp_id, assignedComplaints: { c_id: c_id } };
        await SP.findOneAndUpdate(query, { status: status }, async(err, result) => {
            if (err) res.send("SA ISN'T ABLE TO UPDATE THE COMPLAINT!");
            else if (result == null) res.send("COMPLAINT DOES NOT EXIST!");
            else {
                await Complaint.findOneAndUpdate({ _id: c_id }, { status: status }, (err, result) => {
                    if (err) res.send("NOT ABLE TO UPDATE THE COMPLAINT!");
                    else res.send("COMPALINT IS SUCCESSFULLY UPDATED!");
                });
            }
        });
    } catch (err) {
        console.log(err);
    }
}

exports.transferComplaint = (req, res) => {
    try {
        const complaint_id = mongoose.Types.ObjectId(req.params.id);
        const sp_1 = mongoose.Types.ObjectId(req.body.id_1);
        const sp_2 = mongoose.Types.ObjectId(req.body.id_2);
        SP.findOne({ _id: sp_2 }).exec((err, sp) => {
            if (err) res.send("NOT ABLE TO FIND THE SERVICEPROVIDER!");
            else if (sp == null) res.send("SP_2 DOES NOT EXIST! NOT ABLE TO TRANSFER THE COMPLAINT!");
            else {
                SP.updateOne({ _id: sp_1 }, { $pull: { assignedComplaints: { _id: complaint_id } } }).exec((err, sp) => {
                    if (err) res.send("NOT ABLE TO UPDATE THE SP_1!");
                    else {
                        SP.updateOne({ _id: sp_2 }, { $push: { assignedComplaints: { _id: complaint_id } } }).exec((err, sp) => {
                            if (err) res.send("NOT ABLE TO UPDATE THE SP_2!");
                            else {
                                Complaint.updateOne({ _id: complaint_id }, {
                                    $pull: { assignedTo: { _id: sp_1 } },
                                    $push: { assignedTo: { _id: sp_2 } }
                                }).exec((err, result) => {
                                    if (err) res.send("NOT ABLE TO TRANSFER THE COMPLAINT!");
                                    else res.send("COMPLAINT IS SUCCESSFULLY TRANSFERRED!");
                                });
                            }
                        });
                    }
                });
            }
        });
    } catch (err) {
        console.log(err);
    }
}