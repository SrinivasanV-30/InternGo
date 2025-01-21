import express from 'express';
import { getAllIntern } from '../controllers/userController.js';
import { authenticateUser, checkPermission } from '../middlewares/authenticationMiddleware.js';

const userRouter = express.Router();

userRouter.get('/',authenticateUser,checkPermission('users.manage'),getAllIntern);

export default userRouter;

