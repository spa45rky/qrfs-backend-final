const mongoose = require('mongoose');
const { requiresAuth } = require('express-openid-connect');

exports.login = function(req, res) {
    res.send(req.oidc.isAuthenticated() ? "Logged in" : "Logged out");
}

exports.profile = (requiresAuth(), (req, res) => {
    res.send(req.oidc.isAuthenticated() ? JSON.stringify(req.oidc.user) : "Logged out!");
});