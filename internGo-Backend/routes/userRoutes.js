import express from 'express';
import { getAllIntern, getUser, updateUserProfile } from '../controllers/userController.js';
import { authenticateUser, checkPermission } from '../middlewares/authenticationMiddleware.js';
import multer from 'multer';

const userRouter = express.Router();

userRouter.get('/',authenticateUser,checkPermission(['users.manage']),getAllIntern);
userRouter.get('/:id',authenticateUser,checkPermission(['users.view']),getUser);
userRouter.patch('/update/:id',authenticateUser,checkPermission(['users.manage','profile.update']),updateUserProfile);

export default userRouter;

