const mongoose = require('mongoose');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

exports.register = function(req, res) {

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