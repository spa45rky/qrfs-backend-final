const express = require('express');
const bodyParser = require('body-parser');
const auth_routes = require('./routes/auth-routes');
const admin_routes = require('./routes/admin-routes');
const auth = require('./middlewares/auth');
const passport = require('passport');

const app = express();



app.use(express.urlencoded({ extended: true }));
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.use('/', auth_routes);
app.use('/admin', passport.authenticate('jwt', {session: false}), admin_routes);

module.exports = app;