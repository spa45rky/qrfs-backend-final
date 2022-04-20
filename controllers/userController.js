const express = require('express');
const mongoose = require('mongoose');
const { auth, requiresAuth } = require('express-openid-connect');

exports.login = function(req, res) {
    res.send(req.oidc.isAuthenticated() ? "Logged in" : "Logged out");
}

exports.profile = (requiresAuth(), (req, res) => {
    res.send(JSON.stringify(req.oidc.user));
});