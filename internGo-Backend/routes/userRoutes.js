import express from 'express';
import { getAllIntern, getUser, updateUserProfile } from '../controllers/userController.js';
import { authenticateUser, checkPermission, checkUser } from '../middlewares/authenticationMiddleware.js';
import multer from 'multer';

const userRouter = express.Router();

userRouter.get('/',authenticateUser,checkPermission(['users.manage']),getAllIntern);
userRouter.get('/:id',authenticateUser,checkUser,checkPermission(['users.view']),getUser);
userRouter.patch('/update/:id',authenticateUser,checkUser,checkPermission(['users.manage','profile.update']),updateUserProfile);

export default userRouter;

