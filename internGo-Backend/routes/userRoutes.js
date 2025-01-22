import express from 'express';
import { getAllIntern, updateUserProfile } from '../controllers/userController.js';
import { authenticateUser, checkPermission } from '../middlewares/authenticationMiddleware.js';
import multer from 'multer';

const userRouter = express.Router();

userRouter.get('/',authenticateUser,checkPermission('users.manage'),getAllIntern);
userRouter.get('/:id',authenticateUser,checkPermission(''))
userRouter.patch('/update/:id',authenticateUser,checkPermission('users.manage'),updateUserProfile);

export default userRouter;

