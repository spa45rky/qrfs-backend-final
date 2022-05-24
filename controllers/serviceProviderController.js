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

exports.transferComplaint = async(req, res) => {
    try {
        const sp_id = req.params.sp_id;
        const c_id = req.params.c_id;
        const t_id = req.params.t_id;
        const query = { _id: sp_id, assignedComplaints: { c_id: c_id } };
        SP.findOneAndDelete(query, async(err, result) => {
            if (err) res.send("SA ISN'T ABLE TO DELETE THE COMPLAINT!");
            else if (result == null) res.send("COMPLAINT DOES NOT EXIST!");
            else {
                await SP.findOneAndUpdate({ _id: t_id }, { assignedComplaints: { c_id: result.c_id } },
                    async(err, complaint) => {
                        if (err)
                            if (err) res.send("SA ISN'T ABLE TO TRANSFER THE COMPLAINT!");
                            else {
                                await Complaint.create(complaint, (err, db_res) => {
                                    if (err) res.send("SA ISN'T ABLE TO TRANSFER THE COMPLAINT!");
                                    else res.send("COMPLAINT IS SUCCESSFULLY TRANSFERRED!");
                                });
                            }
                    });
            }
        });
    } catch (err) {
        console.log(err);
    }
}