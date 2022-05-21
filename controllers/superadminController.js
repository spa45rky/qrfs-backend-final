const Customer = require('../models/customer');
const User = require('../models/user');
const Complaint = require('../models/complaint');
const Complainee = require('../models/complainee');
const Dept = require('../models/department');
const bcrypt = require('bcryptjs');

exports.addCustomer = (req, res) => {
    try {
        let salt = bcrypt.genSaltSync(10);
        Customer.findOne({ email: req.body.email }).exec((err, customer) => {
            if (err) {
                console.log(err);
            } else if (customer) res.send('CUSTOMER ALREADY EXISTS!');
            else {
                Customer.create({
                    title: req.body.title,
                    email: req.body.email,
                    $push: { employees: [req.body.adminEmail] }
                }, (err, customer) => {
                    if (err) {
                        console.log("\n\n" + err);
                        res.send(err)
                    }
                    User.create({
                        name: 'UNDEFINED',
                        email: req.body.adminEmail,
                        password: bcrypt.hashSync('admin', salt),
                        role: 'ADMIN',
                        sign_type: 'PLATFORM',
                        company_id: customer._id
                    }, (err, user) => {
                        if (err) res.send('CUSTOMER CREATED BUT ADMIN ACCOUNT NOT CREATED!')
                        customer.employees
                        User.findOne({ email: req.body.adminEmail }).exec((err, admin) => {
                            if (err) res.send('NOT ABLE TO ADD ADMIN!');
                            else {
                                User.create({
                                    name: 'UNDEFINED',
                                    email: req.body.adminEmail,
                                    password: bcrypt.hashSync('admin', salt),
                                    role: 'ADMIN',
                                    sign_type: 'PLATFORM',
                                    company_id: customer._id
                                }, (err, user) => {
                                    if (err) res.send("NOT ABLE TO ADD ADMIN IN THE USERS COLLECTION!");
                                    else res.send("ADMIN IS SUCCESSFULLY ADDED!");
                                });
                            }
                        });
                    })
                })
            }
        });
    } catch (error) {
        console.log(error);
    }
}

exports.editCustomer = (req, res) => {

}

exports.deleteCustomer = async(req, res) => {
    try {
        await Customer.findByIdAndDelete({ _id: req.params.id }, (err, customer) => {
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
                                });
                            }
                        });
                        Dept.deleteMany({ company_id: customer._id }).exec((err, depts) => {
                            if (err) res.send("NOT ABLE TO DELETE THE DEPARTMENTS!");
                            else res.send("EVERYTHING IS DELETED SUCCESSFULLY!");
                        });
                    }
                });
            }
        });
    } catch (err) {
        console.log("NOT ABLE TO DELETE THE CUSTOMER! " + err);
    }
}