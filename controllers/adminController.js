const User = require('../models/user');
const Complaint = require('../models/complaint');
const Category = require('../models/category');
const Customer = require('../models/customer')
const Department = require('../models/department');
const Complainee = require('../models/complainee');
const SP = require('../models/serviceProvider');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const user = require('../models/user');

exports.getUsersList = (req, res) => {
    try {
        const company_id = mongoose.Types.ObjectId(req.params.id);
        User.find({ company_id: company_id }).exec((err, result) => {
            if (err) res.send("NOT ABLE TO FIND ANY USER!");
            else if (result == null) res.send("USERS DOES NOT EXIST!");
            else res.json(result);
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

exports.addSpecificUser = (req, res) => {
    try {
        let salt = bcrypt.genSaltSync(10);
        const full_name = req.body.name;
        const email = req.body.email;
        const role = req.body.role;
        User.findOne({ name: full_name, email: email }).exec((err, user) => {
            if (err) res.send(err);
            else if (user) res.send("USER ALREADY EXISTS!");
            else {
                User.create({
                    name: req.body.name,
                    email: req.body.email,
                    password: bcrypt.hashSync('user', salt),
                    role: role,
                    sign_type: 'PLATFORM',
                    company_id: mongoose.Types.ObjectId(req.params.id)
                }, (err, user) => {
                    if (err) {
                        res.send("NOT ABLE TO ADD THE USER!" + err);
                    } else {
                        Customer.updateOne({ _id: user.company_id }, { $push: { employees: { email: user.email, _id: user._id } } }).exec((err, result) => {
                            if (err) res.send("NOT ABLE TO ADD THE USER'S EMAIL IN THE EMPLOYEES ARRAY!");
                            else {
                                if (role == "COMPLAINEE") {
                                    Complainee.create({
                                        user_id: user._id,
                                        company_id: user.company_id
                                    }, (err, result) => {
                                        if (err) res.send(err);
                                        else res.send("BOTH USER AND COMPLAINEE ARE CREATED!");
                                    });
                                } else if (role == "SERVICEPROVIDER") {
                                    SP.create({
                                        user_id: user._id,
                                        company_id: user.company_id,
                                        averageRating: 0
                                    }, (err, result) => {
                                        if (err) res.send(err);
                                        else res.send("BOTH USER AND SERVICEPROVIDER ARE CREATED!");
                                    });
                                }
                            }
                        });
                    }
                });
            }
        });
    } catch (err) {
        console.log(err);
        return;
    }
}

exports.updateSpecificUser = async(req, res) => {
    try {
        const id = req.params.id;
        const full_name = req.body.name;
        const email = req.body.email;
        await User.findByIdAndUpdate(id, { name: full_name, email: email }, (err, user) => {
            if (err) res.send("NOT ABLE TO UPDATE THE USER!");
            else res.send("USER IS SUCCESSFULLY UPDATED!");
        });
    } catch (err) {
        console.log(err);
    }
}

exports.deleteSpecificUser = (req, res) => {
    try {
        const company_id = mongoose.Types.ObjectId(req.params.id);
        const user_id = mongoose.Types.ObjectId(req.body.id);
        User.findByIdAndDelete({ _id: user_id }).exec((err, user) => {
            if (err) res.send("NOT ABLE TO DELETE THE USER!");
            else if (user == null) res.send("USER DOES NOT EXIST!");
            else {
                console.log("DELETED USER: " + JSON.stringify(user));
                const userid = user._id;
                console.log("DELETED USER ID: " + userid);
                console.log("USER ID: " + user_id);
                if (user.role == "COMPLAINEE") {
                    Complainee.findOneAndDelete({ user_id: user._id }).exec((err, complainee) => {
                        if (err) res.send("NOT ABLE TO DELETE THE COMPLAINEE!");
                        else if (complainee == null) res.send("COMPLAINEE DOES NOT EXIST!");
                    });
                } else if (user.role == "SERVICEPROVIDER") {
                    SP.findOneAndDelete({ user_id: user.id }).exec((err, sp) => {
                        if (err) res.send("NOT ABLE TO DELETE THE SERVICEPROVIDER!");
                        else if (sp == null) res.send("SERVICEPROVIDER DOES NOT EXIST!");
                    });
                }
                Customer.findOne({ _id: company_id }).exec((err, customer) => {
                    if (err) res.send("NOT ABLE TO DELETE USER FROM THE CUSTOMER TABLE!");
                    else if (customer == null) res.send("CUSTOMER DOES NOT EXIST!");
                    else {
                        Customer.updateOne({ _id: customer._id }, { $pull: { employees: { _id: userid } } }).exec((err, result) => {
                            if (err) res.send("NOT ABLE TO DELETE USER FROM THE CUSTOMER'S TABLE!");
                            else res.send("USER IS SUCCESSFULLY DELETED FROM THE USER'S AND CUSTOMER'S TABLE!");
                        });
                    }
                });
            }
        })
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
                else res.send("SUCCESSFULLY DELETED ALL THE MENTIONED USERS!");
            });
        });
    } catch (err) {
        console.log(err);
    }
}

// exports.getRolesList = async(req, res) => {
//     try {
//         await Role.find({}, (err, roles) => {
//             if (err) res.send("OOPS... NO DATA IN THE DATABASE!");
//             else {
//                 res.send(roles);
//             }
//         });
//     } catch (err) {
//         console.log(err);
//     }
// }

// exports.getSpecificRole = async(req, res) => {
//     const _id = req.query.id;
//     await Role.findOne({ id: _id }, (err, role) => {
//         if (err) res.send("OOPS... NO DATA IN THE DATABASE!");
//         else res.send(role);
//     });
// }

// exports.updateSpecificRole = async(req, res) => {
//     const id = req.params.id;
//     await Role.findByIdAndUpdate(id, {}, (err, role) => {
//         if (role) res.send("NOT ABLE TO UPDATE THE ROLE!");
//         else res.send("ROLE IS SUCCESSFULLY UPDATED!");
//     });
// }

// exports.deleteSpecificRole = async(req, res) => {
//     const role_id = req.params.id;
//     await Role.findByIdAndDelete(role_id, (err, role) => {
//         if (err) res.send("NOT ABLE TO DELETE THE ROLE!");
//         else res.send("ROLE IS SUCCESSFULLY DELETED!");
//     });
// }

// exports.deleteMultipleRole = (req, res) => {
//     const role_ids = req.body.ids;
//     role_ids.forEach(id => {
//         Role.findByIdAndDelete(id, (err, role) => {
//             if (err) res.send("NOT ABLE TO DELETE THE ROLE WITH ID: " + id);
//         });
//         res.send("SUCCESSFULLY DELETED ALL THE MENTIONED ROLES!");
//     });
// }

exports.getComplaintsList = async(req, res) => {
    try {
        await Complaint.find({}, (err, complaints) => {
            if (err) res.send("OOPS... NO DATA IN THE DATABASE!");
            else res.send(complaints);
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

exports.getDeptsList = (req, res) => {
    try {
        Department.find({ company_id: req.params.id }).exec((err, depts) => {
            if (err) res.send("OOPS... NO DATA IN THE DATABASE!");
            else res.send(depts);
        });
    } catch (err) {
        console.log(err);
    }
}

exports.getSpecificDept = (req, res) => {
    try {
        const dept_id = mongoose.Types.ObjectId(req.params.id);
        Department.findOne({ _id: dept_id }).exec((err, dept) => {
            if (err) res.send("DEPT DOES NOT EXIST!");
            else if (dept == null) res.send("DEPT NOT FOUND!");
            else res.send(dept);
        });
    } catch (err) {
        console.log(err);
    }
}

// exports.addSpecificDept = (req, res) => {
//     try {
//         const dept_title = req.body.title;
//         const company_id = mongoose.Types.ObjectId(req.params.company_id);
//         const category_title = req.body.category_title;
//         const dept = new Department({ title: dept_title, company_id: company_id });
//         const category = new Category({ title: category_title, company_id: company_id });
//         dept.category.push(category);
//         category.save();
//         dept.save((err, dept) => {
//             if (err) res.send("NOT ABLE TO SAVE THE DEPARTMENT!");
//             else {
//                 Department.findOne({ title: dept_title }).populate('category').exec((err, dept) => {
//                     if (err) res.send("NOT ABLE TO ADD DEPARTMENT!");
//                     else res.send("DEPARTMENT IS SUCCESSFULLY ADDED!" + JSON.stringify(dept));
//                 });
//             }
//         });
//     } catch (err) {
//         console.log(err);
//     }
// }

exports.addSpecificDept = (req, res) => {
    try {
        const dept_title = req.body.title;
        const company_id = mongoose.Types.ObjectId(req.params.id);
        Department.create({
            title: dept_title,
            company_id: company_id
        }, (err, department) => {
            if (err) res.send("NOT ABLE TO ADD THE DEPARTMENT!");
            else {
                Customer.updateOne({ _id: company_id }, { $push: { departments: { title: dept_title, _id: department._id } } }).exec((err, customer) => {
                    if (err) res.send("NOT ABLE TO ADD THE DEPARTMENT IN CUSTOMER'S TABLE!");
                    else res.send("DEPARTMENT IS SUCCESSFULLY ADDED AND CUSTOMER IS SUCCESSFULLY UPDATED!");
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
        await Department.findByIdAndUpdate(id, { title: dept_title }, (err, dept) => {
            if (err) res.send("NOT ABLE TO UPDATE THE DEPT!");
            else if (dept == null) res.send("DEPT NOT FOUND!");
            else res.send("DEPT IS SUCCESSFULLY UPDATED!");
        });
    } catch (err) {
        console.log(err);
    }
}

// exports.deleteSpecificDept = (req, res) => {
//     try {
//         const dept_id = mongoose.Types.ObjectId(req.params.id);
//         Department.findByIdAndDelete({ _id: dept_id }).exec((err, dept) => {
//             if (err) res.send("NOT ABLE TO DELETE THE DEPT!");
//             else if (dept == null) res.send("DEPT NOT FOUND!");
//             else {
//                 Customer.updateOne({ _id: dept.company_id }, { $pull: { departments: { _id: dept_id } } }).exec((err, result) => {
//                     if (err) res.send("NOT ABLE TO DELETE DEPARTMENTS FROM THE CUSTOMER'S TABLE!");
//                     else res.send("DEPARTMENT IS SUCCESSFULLY DELETED FROM THE DEPARTMENT'S AND CUSTOMER'S TABLE!");
//                 });
//             }
//         });
//     } catch (err) {
//         console.log(err);
//     }
// }

exports.deleteSpecificDept = (req, res) => {
    try {
        const dept_id = mongoose.Types.ObjectId(req.params.id);
        Department.findByIdAndDelete({ _id: dept_id }).exec((err, dept) => {
            if (err) res.send("NOT ABLE TO DELETE THE DEPT!");
            else if (dept == null) res.send("DEPT NOT FOUND!");
            else {
                Customer.updateOne({ _id: dept.company_id }, { $pull: { departments: { _id: dept_id } } }).exec((err, result) => {
                    if (err) res.send("NOT ABLE TO DELETE DEPARTMENTS FROM THE CUSTOMER'S TABLE!");
                    else {
                        Category.updateOne({ assignedDepartment: dept._id }, { assignedDepartment: null }).exec((err, result) => {
                            if (err) res.send("NOT ABLE TO DELETE DEPARTMENTS FROM THE CATEGORIES TABLE'");
                            else {
                                SP.updateOne({ department: dept._id }, { department: null }).exec((err, result) => {
                                    if (err) res.send("NOT ABLE TO DELETE DEPARTMENTS FROM THE SERVICEPROVIDER'S TABLE!");
                                    else res.send("DEPARTMENT IS NO MORE WITH US!");
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



exports.addDeptEmployee = (req, res) => {
    try {
        const email = req.body.email;
        const dept_id = mongoose.Types.ObjectId(req.params.id);
        User.findOne({ email: email }).exec((err, user) => {
            if (err) res.send("NOT ABLE TO FIND THE EMPLOYEE/USER!");
            else if (user == null) res.send("USER/EMPLOYEE DOESN'T EXIST!");
            else {
                const sp_id = mongoose.Types.ObjectId(user._id);
                Department.updateOne({ _id: dept_id }, { $push: { employees: { _id: sp_id, email: email } } }).exec((err, result) => {
                    if (err) res.send("NOT ABLE TO ADD USER/EMPLOYEE IN THE EMPLOYEES ARRAY OF DEPARTMENT!");
                    else {
                        SP.updateOne({ user_id: sp_id }, { department: dept_id }).exec((err, result) => {
                            if (err) res.send("NOT ABLE TO UPDATE THE SERVICEPROVIDER!");
                            else res.send("EMPLOYEE/USER IS SUCCESSFULLY ADDED TO THE DEPARTMENT AND SERVICEPROVIDER IS UPDATED!");
                        });
                    }
                });
            }
        })
    } catch (err) {
        console.log(err);
    }
}

exports.getAvailableDeptUnassigned = (req, res) => {
    try {
        const company_id = mongoose.Types.ObjectId(req.params.id);
        SP.find({ company_id: company_id, department: null }).exec((err, sps) => {
            if (err) res.send("NOT ABLE TO FIND THE SERVICEPROVIDERS!");
            else if (sps == null) res.send("SERVICEPROVIDERS DO NOT EXIST!");
            else {
                // console.log("sps: " + sps);
                const user_ids = [];
                sps.forEach(sp => user_ids.push(sp.user_id));
                User.find({ _id: { "$in": user_ids } }).exec((err, users) => {
                    if (err) res.send("NOT ABLE TO FIND ANY USER!");
                    else if (users == null) res.send("USERS DO NOT EXIST!");
                    else {
                        const names = [];
                        const emails = [];
                        users.forEach(user => {
                            names.push(user.name);
                            emails.push(user.email);
                        });
                        const all_sps = [];
                        var index = 0;
                        sps.forEach(sp => {
                            const obj = {
                                name: names[index],
                                email: emails[index],
                                feedbackGiven: sp.feedbackGiven,
                                ratings: sp.ratings,
                                user_id: sp.user_id,
                                customer_id: sp.company_id,
                                dept: sp.department,
                                avgRating: sp.averageRating,
                                assignedComplaints: sp.assignedComplaints,
                                pfp: sp.pfp || null
                            };
                            all_sps.push(obj);
                            index++;
                        });
                        res.send(all_sps);
                    }
                })
            }
        });
    } catch (err) {
        console.log(err);
    }
}

exports.deleteDeptEmployee = (req, res) => {
    try {
        const dept_id = mongoose.Types.ObjectId(req.params.id);
        const email = req.body.email;
        User.findOne({ email: email }).exec((err, user) => {
            if (err) res.send("NOT ABLE TO FIND THE USER!");
            else {
                Department.updateOne({ _id: dept_id }, { $pull: { employees: { _id: user._id } } }).exec((err, result) => {
                    if (err) res.send("NOT ABLE TO DELETE THE CUSTOMER FROM DEPARTMENT!");
                    else {
                        SP.updateOne({ user_id: user._id }, { $set: { department: null } }).exec((err, result) => {
                            if (err) res.send("EMPLOYEE IS REMOVED FROM THE DEPARTMENT BUT SERVICEPROVIDER DOES NOT UPDATED!");
                            else res.send("EMPLOYEE IS SUCCESSFULLY REMOVED FROM THE DEPARTMENT AND SERVICEPROVIDER IS UPDATED!");
                        });
                    }
                });
            }
        });
    } catch (err) {
        console.log(err);
    }
}

exports.getAllDeptEmployees = (req, res) => {
    try {
        const id = req.params.id;
        Department.find({ _id: id }, 'employees').exec((err, result) => {
            if (err) res.send("NOT ABLE TO GET THE EMPLOYEES!");
            else {
                const employees = result[0].employees;
                var employees_email = [];
                var sp_ids = [];
                var names = [];
                // var sps = [];
                employees.forEach((employee) => { employees_email.push(employee.email); });
                User.find({ email: { "$in": employees_email } }).exec((err, users) => {
                    if (err) res.send("NOT ABLE TO FIND A SINGLE USER!");
                    else if (users == null) res.send("USERS DON'T EXIST IN THIS DEPARTMENT!");
                    else {
                        users.forEach(user => {
                            sp_ids.push(user._id);
                            names.push(user.name);
                        });
                        console.log("sp_ids: " + sp_ids);
                        SP.find({ user_id: { "$in": sp_ids } }).exec((err, result) => {
                            if (err) res.send("NOT ABLE TO FIND THE SERVICEPROVIDERS!");
                            else if (result == null) res.send("SERVICEPROVIDERS DO NOT EXIST!");
                            else {
                                var index = 0;
                                const all_sps = [];
                                result.forEach((res) => {
                                    const obj = {
                                        name: names[index],
                                        email: employees_email[index],
                                        feedbackGiven: res.feedbackGiven,
                                        ratings: res.ratings,
                                        user_id: res.user_id,
                                        customer_id: res.company_id,
                                        dept: res.department,
                                        avgRating: res.averageRating,
                                        assignedComplaints: res.assignedComplaints,
                                        pfp: res.pfp || null
                                    }
                                    index++;
                                    all_sps.push(obj);
                                });
                                res.send(all_sps);
                            }
                        });
                    }
                });
            };
        })
    } catch (err) {
        console.log(err);
    }
}

exports.addCategory = (req, res) => {
    try {
        const company_id = mongoose.Types.ObjectId(req.params.id);
        const title = req.body.title;
        Category.create({
            company_id: company_id,
            title: title,
            assignedDepartment: null
        }, (err, category) => {
            if (err) res.send("UNABLE TO CREATE THE CATEGORY!");
            else res.send("CATEGORY IS SUCCESSFULLY CREATED!");
        });
    } catch (err) {
        console.log(err);
    }
}

exports.deleteCategory = (req, res) => {
    try {
        const id = mongoose.Types.ObjectId(req.params.id);
        const category_id = mongoose.Types.ObjectId(req.body.id);
        Category.findOneAndDelete({ _id: category_id, company_id: id }).exec((err, category) => {
            if (err) res.send("UNABLE TO DELETE THE CATEGORY!");
            else {
                if (category.assignedDepartment) {
                    const dept_id = category.assignedDepartment._id;
                    Department.updateOne({ _id: dept_id }, { $pull: { category: { _id: category._id } } }).exec((err, result) => {
                        if (err) res.send("CATEGORY IS DELETED BUT DEPARTMENT ISN'T UPDATED!");
                        else res.send("CATEGORY IS SUCCESSFULLY DELETED AND DEPARTMENT IS SUCCESSFULLY UPDATED!");
                    });
                } else res.send("CATEGORY IS SUCCESSFULLY DELETED!");
            }
        });
    } catch (err) {
        console.log(err);
    }
}


exports.addCategoryDept = (req, res) => {
    try {
        const dept_id = mongoose.Types.ObjectId(req.params.id);
        const category_id = mongoose.Types.ObjectId(req.body.id);
        Category.findOneAndUpdate({ _id: category_id }, { assignedDepartment: dept_id }).exec((err, result) => {
            if (err) res.send("NOT ABLE TO FIND THE CATEGORY!");
            else {
                Department.findByIdAndUpdate({ _id: dept_id }, { $push: { category: { _id: category_id } } }).exec((err, result) => {
                    if (err) res.send("CATEGORY IS UPDATED BUT NOT ABLE TO UPDATE THE DEPT TABLE!");
                    else res.send("CATEGORY IS SUCCESSFULLY ADDED TO THE DEPARTMENT AND UPDATED AS WELL!");
                });
            }
        })
    } catch (err) {
        console.log(err);
    }
}


exports.getAllCategories = (req, res) => {
    try {
        const company_id = mongoose.Types.ObjectId(req.params.id);
        Category.find({ company_id: company_id }).exec((err, categories) => {
            if (err) res.send("NOT ABLE TO FIND THE CATEGORY!");
            else if (categories == null) res.send("CATEGORIES DON'T EXIST!");
            else res.send(categories);
        });
    } catch (err) {
        console.log(err);
    }
}

exports.getUnassignedCategories = (req, res) => {
    try {
        const company_id = mongoose.Types.ObjectId(req.params.id);
        Category.find({ company_id: company_id, assignedDepartment: null }).exec((err, categories) => {
            if (err) res.send("NOT ABLE TO FIND ANY CATEGORY!");
            else if (categories == null) res.send("CATEGORIES DO NOT EXIST!");
            else res.send(categories);
        });
    } catch (err) {
        console.log(err);
    }
}