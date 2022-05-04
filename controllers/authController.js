const mongoose = require('mongoose');
const { requiresAuth } = require('express-openid-connect');

exports.register = function(req, res) {

}

exports.login = function(req, res) {
    // res.send(req.oidc.isAuthenticated() ? "Logged in" : "Logged out");
    res.send("Hello Raafay!");
}

exports.logout = function(req, res) {

}

exports.profile = (requiresAuth(), (req, res) => {
    res.send(req.oidc.isAuthenticated() ? JSON.stringify(req.oidc.user) : "Logged out!");
});