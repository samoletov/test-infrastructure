const passport = require('koa-passport');
const ExtractJwt = require('passport-jwt').ExtractJwt;
const Strategy = require('passport-jwt').Strategy;

passport.use(
  'jwt',
  new Strategy(
    {
      secretOrKey: process.env.JWT_SECRET,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      passReqToCallback: true
    },
    (ctx, payload, done) => {
      if (payload.username) {
        return done(null, payload.username);
      }
      return done(null, false);
    }
  )
);
