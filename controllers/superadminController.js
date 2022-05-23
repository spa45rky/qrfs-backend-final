const Customer = require('../models/customer');
const User = require('../models/user');
const Complaint = require('../models/complaint');
const Complainee = require('../models/complainee');
const Dept = require('../models/department');
const SP = require('../models/serviceProvider');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');


exports.getAllCustomers = async(req, res) => {
    try {
        // getting all the registered customers
        await Customer.find({}, (err, customers) => {
            if (err) res.send("NOT ABLE TO GET CUSTOMERS LIST!");
            else res.send(JSON.stringify(customers));
        });
    } catch (err) {
        console.log(err);
    }
}

exports.addCustomer = (req, res) => {
    try {
        let salt = bcrypt.genSaltSync(10);
        Customer.findOne({ email: req.body.email }).exec((err, customer) => {
            if (err) console.log("NOT ABLE TO FIND THE CUSTOMER! " + err);
            else if (customer) res.send('CUSTOMER ALREADY EXISTS!');
            else {
                Customer.create({
                    title: req.body.title,
                    email: req.body.email,
                    // employees: { $push: { email: req.body.adminEmail } }
                }, (err, customer) => {
                    if (err) res.send("NOT ABLE TO CREATE CUSTOMER!");
                    else {
                        const company_id = mongoose.Types.ObjectId(customer._id);
                        User.findOne({ email: req.body.adminEmail }).exec((err, user) => {
                            if (err) res.send("NOT ABLE TO ADD THE ADMIN IN USER'S TABLE!");
                            else if (user != null) res.send("ADMIN ALREADY EXISTS IN THE USER'S TABLE!");
                            else {
                                Customer.updateOne({ email: req.body.email }, { $push: { employees: { email: req.body.adminEmail } } }).exec((err, customer) => {
                                    if (err) res.send("NOT ABLE TO ADD THE ADMIN IN CUSTOMER'S TABLE");
                                    else {
                                        User.create({
                                            name: 'UNDEFINED',
                                            email: req.body.adminEmail,
                                            password: bcrypt.hashSync('admin', salt),
                                            role: 'ADMIN',
                                            sign_type: 'PLATFORM',
                                            company_id: company_id
                                        }, (err, user) => {
                                            if (err) res.send('CUSTOMER CREATED BUT ADMIN ACCOUNT NOT CREATED!');
                                            else res.send("CUSTOMER AND ADMIN ARE SUCCESSFULLY CREATED!");
                                        });
                                    }
                                });
                            }
                        });
                    }
                });
            }
        });
    } catch (error) {
        console.log(error);
    }
}

exports.editCustomer = (req, res) => {
    try {
        const filter = { _id: req.params.id };
        // const updated_custmer_obj = {
        //     title: req.body.title,
        //     email: req.body.email,
        //     employees: req.body.employees,
        //     addons: req.body.addons,
        //     departments: req.body.departments
        // };
        Customer.findById({ _id: mongoose.Types.ObjectId(req.params.id) }).exec((err, customer) => {
            if (err) res.send("NOT ABLE TO FIND THE CUSTOMER!");
            else if (customer == null) res.send("CUSTOMER DOES NOT EXIST!");
            else {
                const updated_custmer_obj = {
                    title: (req.body.title == null) ? customer.title : req.body.title,
                    email: (req.body.email == null) ? customer.email : req.body.email,
                    employees: (req.body.employees == null) ? customer.employees : req.body.employees,
                    addons: (req.body.addons == null) ? customer.addons : req.body.addons,
                    departments: (req.body.departments == null) ? customer.departments : req.body.departments
                };
                Customer.updateOne(filter, updated_custmer_obj, { upsert: true }).exec((err, customer) => {
                    if (err) res.send("NOT ABLE TO UPDATE THE CUSTOMER!");
                    else res.send("CUSTOMER IS SUCCESSFULLY UPDATED!");
                });
            }
        });
    } catch (error) {
        console.log("NOT ABLE TO UPDATE THE CUSTOMER! " + error);
    }
}

exports.deleteCustomer = (req, res) => {
    try {
        Customer.findByIdAndDelete({ _id: req.params.id }).exec((err, customer) => {
            if (err) res.send("NOT ABLE TO DELETE THE CUSTOMER!");
            else if (customer == null) res.send("CUSTOMER DOES NOT EXIST!");
            else {
                User.deleteMany({ company_id: customer._id }).exec((err, users) => {
                    if (err) res.send("NOT ABLE TO DELETE THE USERS!");
                    else {
                        Complaint.deleteMany({ company_id: customer._id }).exec((err, complaints) => {
                            if (err) res.send("NOT ABLE TO DELETE THE COMPLAINTS!");
                            else {
                                Complainee.deleteMany({ company_id: customer._id }).exec((err, complainees) => {
                                    if (err) res.send("NOT ABLE TO DELETE THE COMPLAINEE!");
                                    else {
                                        SP.deleteMany({ company_id: customer._id }).exec((err, sps) => {
                                            if (err) res.snd("NOT ABLE TO DELETE THE SERVICEPROVIDERS!");
                                            else {
                                                // Dept.deleteMany({ company_id: customer._id }).exec((err, depts) => {
                                                //     if (err) res.send("NOT ABLE TO DELETE THE DEPARTMENTS!");
                                                //     else res.send("EVERYTHING IS DELETED SUCCESSFULLY!");
                                                // });
                                                res.send("EVERYTHING IS DELETED SUCCESSFULLY!");
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    }
                });
            }
        });
    } catch (err) {
        console.log("NOT ABLE TO DELETE THE CUSTOMER! " + err);
    }
}

exports.addAdmin = (req, res) => {
    try {
        let salt = bcrypt.genSaltSync(10);
        const email = req.body.email;
        const company_id = mongoose.Types.ObjectId(req.params.id);
        User.create({
            name: 'UNDEFINED',
            email: email,
            password: bcrypt.hashSync('admin', salt),
            role: 'ADMIN',
            sign_type: 'PLATFORM',
            company_id: company_id
        }, (err, user) => {
            if (err) res.send('NOT ABLE TO ADD AMDIN!');
            else {
                Customer.findOneAndUpdate({ _id: company_id }, { $push: { employees: { email: email, _id: user._id } } }).exec((err, result) => {
                    if (err) res.send('NOT ABLE TO ADD THE ADMIN CUSTOMER\'S TABLE');
                    else res.send("ADMIN IS SUCCESSFULLY CREATED AND CUSTOMER IS SUCCESSFULLY UPDATED!");
                })
            }
        });
    } catch (err) {
        console.log(err);
    }
}

exports.deleteAdmin = (req, res) => {
    try {
        const admin_id = mongoose.Types.ObjectId(req.params.id);
        User.findByIdAndDelete({ _id: admin_id }).exec((err, user) => {
            if (err) res.send("NOT ABLE TO DELETE THE USER!");
            else if (user == null) res.send("ADMIN DOES NOT EXIST!");
            else {
                Customer.updateOne({ _id: user.company_id }, { $pull: { employees: { _id: user._id } } }).exec((err, customer) => {
                    if (err) res.send("NOT ABLE TO REMOVE ADMIN FROM THE CUSTOMER'S TABLE!");
                    else res.send("ADMIN IS SUCCESSFULLY REMOVED FROM THE USER'S AND CUSTOMER'S TABLE!");
                });
            }
        })
    } catch (err) {
        console.log(err);
    }
}