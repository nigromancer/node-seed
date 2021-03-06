import * as express from 'express';
import { Request, Response, Application, NextFunction } from 'express';
import { errorHandlerMdl } from './common/errorHandlerMdl';
import apisRoutesLoader from './common/apisRoutesLoader';
import authService from './components/auth/authService';
import { LockFile } from './common/utils/lockfile';
import { logger } from './common/logger';
import socket from './components/chatt/socket';
import { Server } from 'http';

const bodyParser = require('body-parser');
const helmet = require('helmet');

export default class App {
  private app: Application;

  constructor() {
    this.app = express();
  }

  async init(server?: Server) {
    // An array of promises to do the async work
    const promises: Promise<any>[] = [];
    // Remove this line and his import if you won't use sockets
    socket.init(server);
    // Uncomment this lines to enable CORS
    // this.app.use(function (req, res, next) {
    //     res.header('Access-Control-Allow-Origin', '*'); // specific domains are recomended
    //     res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, authorization');
    //     res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    //     next();
    // });
    this.app.use(helmet({
      // until we use https
      hsts: false
    }));

    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: false }));

    authService.init(this.app);

    // Routes inside this caller
    apisRoutesLoader(this.app);

    // Remove all the lockfiles to ensure a clean app's startup
    promises.push(LockFile.deleteAllLockfiles()
      .catch(error => {
        logger.error(`error deleting a lockfile ${error}`);
      }));

    this.app.use(errorHandlerMdl);
    return Promise.all(promises);
  }

  getExpressApp(): Application {
    return this.app;
  }
}