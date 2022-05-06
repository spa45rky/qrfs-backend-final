const mongoose = require('mongoose');
const User = require('../models/user');
const Role = require('../models/role');
const Complaint = require('../models/complaint');
const Department = require('../models/department');

exports.getUsersList = async(req, res) => {
    try {
        await User.find({}, (err, users) => {
            if (err) res.send("OOPS... NO DATA IN THE DATABASE!");
            else {
                res.send(users);
            }
        });
    } catch (err) {
        console.log(err);
    }
}

// exports.getSpecificUser = async(req, res) => {
//     const user_id = req.params.id;
//     await User.findOne({ id: user_id }, (err, user) => {
//         if (err) res.send("USER DOES NOT EXIST!");
//         else res.send(user);
//     });
// }

exports.addSpecificUser = async(req, res) => {
    try {
        console.log(req.body);
        const full_name = req.body.name;
        const email = req.body.email;
        await User.findOne({ name: full_name, email: email }, (err, user) => {
            if (err) console.log(err);
            else if (user) res.send("USER ALREADY EXISTS!");
            else {
                User.create({
                    name: req.body.name,
                    email: req.body.email,
                    password: req.body.password,
                    role: "user"
                }, (err, user) => {
                    if (err) {
                        console.log("\n\n" + err);
                        res.send("NOT ABLE TO ADD THE USER!");
                    }
                    res.send("USER IS SUCCESSFULLY ADDED!");
                });
            }
        });
    } catch (err) {
        console.log(err);
    }
}

exports.updateSpecificUser = async(req, res) => {
    try {
        const id = req.params.id;
        const full_name = req.body.name;
        const email = req.body.email;
        const role = req.body.role;
        await User.findByIdAndUpdate(id, { name: full_name, email: email, role: role }, (err, user) => {
            if (err) res.send("NOT ABLE TO UPDATE THE USER!");
            else res.send("USER IS SUCCESSFULLY UPDATED!");
        });
    } catch (err) {
        console.log(err);
    }
}

exports.deleteSpecificUser = async(req, res) => {
    try {
        const user_id = req.params.id;
        await User.findByIdAndDelete(user_id, (err, user) => {
            if (err) res.send("NOT ABLE TO DELETE THE USER!");
            else res.send("USER IS SUCCESSFULLY DELETED!");
        });
    } catch (err) {
        console.log(err);
    }
}

exports.deleteMultipleUsers = (req, res) => {
    try {
        const user_ids = req.body.ids;
        user_ids.forEach(id => {
            User.findByIdAndDelete(id, (err, user) => {
                if (err) res.send("NOT ABLE TO DELETE THE USER WITH ID: " + id);
            });
            res.send("SUCCESSFULLY DELETED ALL THE MENTIONED USERS!");
        });
    } catch (err) {
        console.log(err);
    }
}

exports.getRolesList = async(req, res) => {
    try {
        await Role.find({}, (err, roles) => {
            if (err) res.send("OOPS... NO DATA IN THE DATABASE!");
            else {
                res.send(roles);
            }
        });
    } catch (err) {
        console.log(err);
    }
}

// exports.getSpecificRole = async(req, res) => {
//     const _id = req.query.id;
//     await Role.findOne({ id: _id }, (err, role) => {
//         if (err) res.send("OOPS... NO DATA IN THE DATABASE!");
//         else res.send(role);
//     });
// }

exports.updateSpecificRole = async(req, res) => {
    const id = req.params.id;
    await Role.findByIdAndUpdate(id, {}, (err, role) => {
        if (role) res.send("NOT ABLE TO UPDATE THE ROLE!");
        else res.send("ROLE IS SUCCESSFULLY UPDATED!");
    });
}

exports.deleteSpecificRole = async(req, res) => {
    const role_id = req.params.id;
    await Role.findByIdAndDelete(role_id, (err, role) => {
        if (err) res.send("NOT ABLE TO DELETE THE ROLE!");
        else res.send("ROLE IS SUCCESSFULLY DELETED!");
    });
}

exports.deleteMultipleRole = (req, res) => {
    const role_ids = req.body.ids;
    role_ids.forEach(id => {
        Role.findByIdAndDelete(id, (err, role) => {
            if (err) res.send("NOT ABLE TO DELETE THE ROLE WITH ID: " + id);
        });
        res.send("SUCCESSFULLY DELETED ALL THE MENTIONED ROLES!");
    });
}

exports.getComplaintsList = async(req, res) => {
    try {
        await Complaint.find({}, (err, complaints) => {
            if (err) res.send("OOPS... NO DATA IN THE DATABASE!");
            else {
                res.send(complaints);
            }
        });
    } catch (err) {
        console.log(err);
    }
}

// exports.getSpecificComplaint = async(req, res) => {
//     try {
//         const _id = req.params.id;
//         await Complaint.findOne({ id: _id }, (err, complaint) => {
//             if (err) res.send("OOPS... NO DATA IN THE DATABASE!");
//             else res.send(complaint);
//         });
//     } catch (err) {
//         console.log(err);
//     }
// }

// ASSIGN COMPLAINT
exports.updateSpecificComplaint = async(req, res) => {
    try {
        const id = req.params.id;
        await Complaint.findByIdAndUpdate(id, {}, (err, complaint) => {
            if (err) res.send("NOT ABLE TO UPDATE THE COMPLAINT!");
            else if (complaint == null) res.send("COMPLAINT NOT FOUND!");
            else res.send("COMPLAINT IS SUCCESSFULLY UPDATED!");
        });
    } catch (err) {
        console.log(err);
    }
}

exports.deleteSpecificComplaint = async(req, res) => {
    try {
        const complaint_id = req.params.id;
        await Complaint.findByIdAndDelete(complaint_id, (err, complaint) => {
            if (err) res.send("NOT ABLE TO DELETE THE COMPLAINT!");
            else if (complaint == null) res.send("COMPLAINT NOT FOUND!");
            else res.send("COMPLAINT IS SUCCESSFULLY DELETED!");
        });
    } catch (err) {
        console.log(err);
    }
}

exports.archiveSpecificComplaint = async(req, res) => {
    try {
        const complaint_id = req.params.id;
        await Complaint.findByIdAndUpdate(complaint_id, { status: "archived" }, (err, complaint) => {
            if (err) res.send("NOT ABLE TO ARCHIVE THE COMPLAINT!");
            else if (complaint == null) res.send("COMPLAINT NOT FOUND!");
            else res.send("COMPLAINT IS SUCCESSFULLY ARCHIVED!");
        });
    } catch (err) {
        console.log(err);
    }
}

exports.getDeptsList = async(req, res) => {
    try {
        await Department.find({}, (err, depts) => {
            if (err) res.send("OOPS... NO DATA IN THE DATABASE!");
            else {
                res.send(depts);
            }
        });
    } catch (err) {
        console.log(err);
    }
}

exports.getSpecificDept = async(req, res) => {
    try {
        const dept_id = req.query.id;
        await Department.findOne({ id: dept_id }, (err, dept) => {
            if (err) res.send("DEPT DOES NOT EXIST!");
            else if (dept == null) res.send("DEPT NOT FOUND!");
            else res.send(dept);
        });
    } catch (err) {
        console.log(err);
    }
}

exports.addSpecificDept = async(req, res) => {
    try {
        const dept_title = req.body.title;
        await Department.findOne({ title: dept_title }, (err, dept) => {
            if (err) console.log("NOT ABLE TO ADD THE DEPT!");
            else if (dept) res.send("DEPT ALREADY EXISTS!");
            else {
                Department.create({
                    title: req.body.title,
                }, (err, dept) => {
                    if (err) res.send("NOT ABLE TO ADD THE DEPT!");
                    res.send("DEPT IS SUCCESSFULLY ADDED!");
                });
            }
        });
    } catch (err) {
        console.log(err);
    }
}

exports.updateSpecificDept = async(req, res) => {
    try {
        const id = req.params.id;
        const dept_title = req.body.title;
        await Department.findOne({ _id: id }).then((err, dept) => {
                if (err) res.send("NOT ABLE TO UPDATE THE DEPT!");
                else if (dept == null) res.send("DEPT NOT FOUND!");
                else {
                    Department.updateOne({ _id: dept._id }, { title: dept_title, }).then((err, res) => {
                        if (err) res.send("NOT ABLE TO UPDATE THE DEPT!");
                        else res.send("DEPT IS SUCCESSFULLY UPDATED!");
                    });
                }
            })
            // await Department.findByIdAndUpdate(id, { title: dept_title }, (err, dept) => {
            //     if (err) res.send("NOT ABLE TO UPDATE THE DEPT!");
            //     else if (dept == null) res.send("DEPT NOT FOUND!");
            //     else res.send("DEPT IS SUCCESSFULLY UPDATED!");
            // });
    } catch (err) {
        console.log(err);
    }
}

exports.deleteSpecificDept = async(req, res) => {
    try {
        const dept_id = req.params.id;
        await Department.findByIdAndDelete(dept_id, (err, dept) => {
            if (err) res.send("NOT ABLE TO DELETE THE DEPT!");
            else if (dept == null) res.send("DEPT NOT FOUND!");
            else res.send("DEPT IS SUCCESSFULLY DELETED!");
        });
    } catch (err) {
        console.log(err);
    }
}