import express from 'express';
import { signUpController, oauthController, signInController, createUserController } from '../controllers/authController.js';
import { emailValidation, signInValidation, signUpValidation, userCreateValidation } from '../middlewares/validationMiddleware.js';
import { authenticateUser, checkPermission } from '../middlewares/authenticationMiddleware.js';

const authRouter = express.Router();

authRouter.post('/signup',signUpValidation,emailValidation,signUpController);
authRouter.post('/signin',signInValidation,emailValidation,signInController);
authRouter.post('/createUser',authenticateUser,checkPermission(['users.manage']),userCreateValidation,createUserController);
authRouter.post('/oauth',oauthController);

export default authRouter;