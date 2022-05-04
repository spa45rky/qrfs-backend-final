const express = require('express');
const auth_routes = require('./routes/auth-routes');
const app = express();


app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use('/', auth_routes);


module.exports = app;