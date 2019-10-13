import * as bodyParser from 'body-parser';
import * as express from 'express';
import { createConnection } from 'typeorm';

import auth from './auth';

require('dotenv').config();

createConnection()
  .then(async () => {
    const app = express();

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(auth.initialize());

    app.all('*', (req, res, next) => {
      if (req.path === '/auth/login') return next();

      return auth.authenticate((err, user, info) => {
        if (err) { return next(err); }
        if (!user) {
          if (info.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Your token has expired. Please generate a new one' });
          } else {
            return res.status(401).json({ message: info.message });
          }
        }
        app.set('user', user);
        return next();
      })(req, res, next);
    });
    require('./routes')(app);

    const port = process.env.PORT || 3001;

    app.listen(port, () => {
      // tslint:disable-next-line: no-console
      console.log(`Express server listening on port ${port}.\nEnvironment: ${process.env.NODE_ENV}`);
    });
  })
  .catch((error) => {
    // tslint:disable-next-line: no-console
    console.log(error);
  });
