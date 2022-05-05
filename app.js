const express = require('express');
const bodyParser = require('body-parser');
const auth_routes = require('./routes/auth-routes');
const admin_routes = require('./routes/admin-routes');
const app = express();


app.use(express.urlencoded({ extended: true }));
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.use('/', auth_routes);
app.use('/admin', admin_routes);

module.exports = app;