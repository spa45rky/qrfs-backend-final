const express = require('express');
const cors = require('cors')
const auth_routes = require('./routes/auth-routes');
const admin_routes = require('./routes/admin-routes');
const superadmin_routes = require('./routes/superadmin-routes')
const user_routes = require('./routes/user-routes');
const service_provider_routes = require('./routes/service-provider-routes');
const auth = require('./middlewares/auth');
const passport = require('passport');
const http = require('http');
const { Server } = require('socket.io');


const app = express();


app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors())

app.use('/', auth_routes);
app.use('/admin', passport.authenticate('jwt', { session: false }), admin_routes);
app.use('/superadmin', superadmin_routes)
// app.use('/admin', admin_routes);
app.use('/user', user_routes);
app.use('/serviceprovider', service_provider_routes);


// Sockets for real-time updates
const server = http.createServer(app)

// instantializing socket server
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
})

io.on("connection", (socket) => {
    console.log(socket.id);

    socket.on("disconnect", () => {
        console.log("USER DISCONNECTED!", socket.id);
    })
})

server.listen(3009, () => {
    console.log("SERVER RUNNING!")
})

module.exports = app;