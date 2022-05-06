const ServiceProvider = require('../models/serviceProvider');
const Complaint = require('../models/complaint');

exports.getAssignedComplaints = (req, res) => {
    try {
        const sp_id = req.params.id;
        ServiceProvider.find({ _id: sp_id }).select('assignedComplaints').exec((err, assignedComplaints) => {
            if (err) res.send("NOT ABLE TO GET THE ASSIGNED COMPLAINTS!");
            else res.send(assignedComplaints);
        });

    } catch (err) {
        console.log(err);
    }
}

exports.updateComplaint = async(req, res) => {
    try {
        const sp_id = req.params.sp_id;
        const c_id = req.params.c_id;
        const update = req.body.update;
        const query = { _id: sp_id, assignedComplaints: { c_id: c_id } };
        await ServiceProvider.findOneAndUpdate(query, { workUpdate: update }, async(err, result) => {
            if (err) res.send("SA ISN'T ABLE TO UPDATE THE COMPLAINT!");
            else if (result == null) res.send("COMPLAINT DOES NOT EXIST!");
            else {
                await Complaint.findOneAndUpdate({ _id: c_id }, { workUpdate: update }, (err, result) => {
                    if (err) res.send("NOT ABLE TO UPDATE THE COMPLAINT!");
                    else res.send("COMPALINT IS SUCCESSFULLY UPDATED!");
                });
            }
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
        await ServiceProvider.findOneAndUpdate(query, { status: status }, async(err, result) => {
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
        ServiceProvider.findOneAndDelete(query, async(err, result) => {
            if (err) res.send("SA ISN'T ABLE TO DELETE THE COMPLAINT!");
            else if (result == null) res.send("COMPLAINT DOES NOT EXIST!");
            else {
                await ServiceProvider.findOneAndUpdate({ _id: t_id }, { assignedComplaints: { c_id: result.c_id } },
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