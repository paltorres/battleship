/**
 *
 */
import express from 'express';
import { Application } from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import http from 'http';
import os from 'os';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import toJson from '@meanie/mongoose-to-json';

import addUser from './add-user';
import swaggerify from './swagger';
import log from './logger';

const app = express();

export default class ExpressServer {
  constructor() {
    const root = path.normalize(__dirname + '/../..');
    mongoose.plugin(toJson);
    mongoose.connect('mongodb://localhost/battleship', { useNewUrlParser: true, useCreateIndex: true });

    app.set('appPath', root + 'client');
    app.use(bodyParser.json({ limit: process.env.REQUEST_LIMIT || '100kb' }));
    app.use(bodyParser.urlencoded({ extended: true, limit: process.env.REQUEST_LIMIT || '100kb' }));
    app.use(cookieParser(process.env.SESSION_SECRET));
    app.use(express.static(`${root}/public`));
    // add the user to the request
    app.use(addUser);
  }

  router(routes: (app: Application) => void): ExpressServer {
    swaggerify(app, routes);
    return this;
  }

  listen(p: string | number = process.env.PORT): Application {
    const welcome = port => () => log.info(`up and running in ${process.env.NODE_ENV || 'development'} @: ${os.hostname() } on port: ${port}}`);
    http.createServer(app).listen(p, welcome(p));
    return app;
  }
}
