/**
 * Component that handles token generation and related stuffs (login, logout, etc.)
 */

import { Request, Response, Application, NextFunction, Router } from 'express';
import * as jwt from 'jsonwebtoken';
import authService from '../auth/authService';
import config from '../../common/config';
import { User } from './user';
import { Project } from './project';
import sequelize from '../../common/connection';
import { Op } from 'sequelize';

const router = Router();

/**
 * Client request a token to operate on protected apis.
 * Changes this with your login logic.
 */
router.get('/api/users/v1', async (req: Request, res: Response, next: NextFunction) => {
    const users = await User.findAll();
    res.json({ users });
});
router.get('/secret/syncforce', async (req: Request, res: Response, next: NextFunction) => {
    await sequelize.sync({ force: true });
    await User.create({ email: 'xxx' });
    const user = await User.findOne({
        where: {
            email: {
                [Op.or]: ['xxx', 'yyy']
            }
        }
    });
    console.log(!!user);
    await user.destroy();
    res.json({ status: 'ok' });
});
export default router;