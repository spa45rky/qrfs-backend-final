const mongoose = require('mongoose');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    try {
        // console.log(req.body);
        const email = req.body.email;
        await User.findOne({ email: email }, async (err, user) => {
            if (err) console.log(err);
            else if (user) res.send("USER ALREADY EXISTS!");
            else {
                 await User.create({
                    name: req.body.firstName + ' ' + req.body.lastName,
                    email: req.body.email,
                    password: req.body.password,
                    role: "COMPLAINEE",
                    sign_type: req.body.sign_type
                }, (err, user) => {
                    if (err) {
                        console.log("\n\n" + err);
                        res.send("NOT ABLE TO ADD THE USER!");
                    }
                    let successObject = {
                        token: jwt.sign({ _id: user._id }, process.env.JWTSECRET, { expiresIn: '3m' }),
                        user
                    }
                    res.json(successObject)
                    console.log(user)
                });
            }
        }).clone();
    } catch (err) {
        console.log(err);
    }
}

exports.login = async(req, res) => {
    try {
        User.findOne({ email: req.body.email }, (err, user) => {
            if (user) {
                let successObject = {
                    token: jwt.sign({ _id: user._id }, process.env.JWTSECRET, { expiresIn: '3m' }),
                    user
                }
                res.json(successObject)
                console.log(user)
            } else {
                res.send(err)
            }
        })
    } catch (err) {
        res.send(err)
    }
}

exports.logout = function(req, res) {

}

// exports.profile = (requiresAuth(), (req, res) => {
//     res.send(req.oidc.isAuthenticated() ? JSON.stringify(req.oidc.user) : "Logged out!");
// });