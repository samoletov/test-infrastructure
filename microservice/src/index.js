const Koa = require('koa');
require('dotenv').config();
const passport = require('koa-passport');

const app = new Koa();

require('./middleware');
app.use(passport.initialize());

app.use(passport.authenticate('jwt', { session: false, failWithError: true }));

app.use(async ctx => {
  ctx.body = 'Hello World';
});

app.listen(3000, '0.0.0.0');
