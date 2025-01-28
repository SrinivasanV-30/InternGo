import express from 'express';
import { createUserAsset, getInterns, getUser, getUserAssets, updateUserAsset, updateUserProfile } from '../controllers/userController.js';
import { authenticateUser, checkPermission, checkUser } from '../middlewares/authenticationMiddleware.js';
import { assetUpdateValidation, assetValidation, profileUpdateValidation } from '../middlewares/validationMiddleware.js';
import { updateUserPermission } from '../controllers/authController.js';

const userRouter = express.Router();

// userRouter.get('/',authenticateUser,checkPermission(['users.manage']),getAllIntern);
userRouter.get('/:id',authenticateUser,checkUser,checkPermission(['users.view','profile.update']),getUser);
userRouter.patch('/update/:id',authenticateUser,checkUser,checkPermission(['users.manage','profile.update']),profileUpdateValidation,updateUserProfile);
userRouter.post('/create/assets',authenticateUser,checkPermission(['users.manage']),assetValidation,createUserAsset);
userRouter.get('/:id/assets',authenticateUser,checkUser,checkPermission(['users.manage','profile.update']),getUserAssets);
userRouter.patch('/rolePermUpdate',authenticateUser,checkPermission(['users.manage']),updateUserPermission);
userRouter.post('/',authenticateUser,checkPermission(['users.manage']),getInterns);
// userRouter.post('/search',authenticateUser,checkPermission(['users.manage']),searchInterns);
userRouter.patch('/update/asset/:id',authenticateUser,checkPermission(['users.manage']),assetUpdateValidation,updateUserAsset);


export default userRouter;

