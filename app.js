const express = require('express');
const { auth } = require('express-openid-connect');
const user_routes = require('./routes/user-route');

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());


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

app.use('/', user_routes);


module.exports = app;