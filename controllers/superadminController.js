const Customer = require('../models/customer');
const User = require('../models/user');
const bcrypt = require('bcryptjs');

exports.addCustomer = async(req, res) => {
    try {
        let salt = bcrypt.genSaltSync(10);
        await Customer.findOne({ email: req.body.email }, async(err, customer) => {
            if (err) console.log(err);
            else if (customer) res.send('CUSTOMER ALREADY EXISTS!');
            else {
                await Customer.create({
                    title: req.body.title,
                    email: req.body.email,
                }, async(err, customer) => {
                    if (err) {
                        console.log("\n\n" + err);
                        res.send("UNABLE TO ADD CUSTOMER!");
                    }
                    await User.create({
                        name: 'UNDEFINED',
                        email: req.body.adminEmail,
                        password: bcrypt.hashSync('admin', salt),
                        role: 'ADMIN',
                        sign_type: 'PLATFORM',
                        company_id: customer._id
                    }, (err, user) => {
                        if (err) res.send('CUSTOMER CREATED BUT ADMIN ACCOUNT NOT CREATED!')
                        res.json(customer)
                    })
                })
            }
        })
    } catch (error) {
        res.send(error)
    }
}