/**
 * Component that handles token generation and related stuffs (login, logout, etc.)
 */

import { Request, Response, Application, NextFunction, Router } from 'express';
import * as jwt from 'jsonwebtoken';
import authService from '../auth/authService';
import config from '../../common/config';

const router = Router();

/**
 * Client request a token to operate on protected apis.
 * Changes this with your login logic.
 */
router.get('/api/v1/token', (req: Request, res: Response, next: NextFunction) => {
  const token = jwt.sign({ someData: 'foobar' }, config.getJwtSecret()); // , { expiresIn: '30s' }
  res.json({ token: token });
});

/**
 * An example of a protected api to test the token generator api.
 * Delete this for your project
 */
router.get('/api/v1/protected', authService.getBasicAuthMdl(), (req: Request, res: Response, next: NextFunction) => {
  // The token data is in req.user -> console.log(req.user);
  res.json({ status: 'listorti' });
});

export default router;