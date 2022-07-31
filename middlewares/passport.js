var JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;

var opts = {}

const passport = require('passport');

opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();

opts.secretOrKey = process.env.JWTSECRET;

passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
    console.log(jwt_payload);
    // User.findOne({id: jwt_payload.sub}, function(err, user) {
    //     if (err) {
    //         return done(err, false);
    //     }
    //     if (user) {
    //         return done(null, user);
    //     } else {
    //         return done(null, false);
    //         // or you could create a new account
    //     }
    // });
}));