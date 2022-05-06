const express = require('express');
const auth_routes = require('./routes/auth-routes');
const admin_routes = require('./routes/admin-routes');
const user_routes = require('./routes/user-routes');
const auth = require('./middlewares/auth');
const passport = require('passport');

const app = express();



app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/', auth_routes);
app.use('/admin', passport.authenticate('jwt', { session: false }), admin_routes);
app.use('/user', user_routes);

module.exports = app;