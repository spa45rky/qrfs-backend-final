const express = require('express');
const { auth, requiresAuth } = require('express-openid-connect');
const router = require('./router');

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use('/', router);

app.use(
    auth({
        authRequired: false, // otherwise every single route requires the authentication
        auth0Logout: true,
        issuerBaseURL: process.env.ISSUER_BASE_URL,
        baseURL: process.env.BASE_URL,
        clientID: process.env.CLIENT_ID,
        secret: process.env.SECRET,
        idpLogout: true,
    })
);

app.get('/', (req, res) => {
    res.send(req.oidc.isAuthenticated() ? "Logged in" : "Logged out");
});

app.get('/profile', requiresAuth(), (req, res) => {
    res.send(JSON.stringify(req.oidc.user));
});

module.exports = app;