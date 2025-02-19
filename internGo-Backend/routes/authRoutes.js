import express from 'express';
import { oauthController, signInController, createUserController, verifyToken, forgotPassword, resetPassword, sendOTP, verifyOTP } from '../controllers/authController.js';
import { emailValidation, signInValidation, signUpValidation, userCreateValidation } from '../middlewares/validationMiddleware.js';
import { authenticateUser, checkPermission } from '../middlewares/authenticationMiddleware.js';

const authRouter = express.Router();

// authRouter.post('/signup',signUpValidation,emailValidation,signUpController);
authRouter.post('/signin',signInValidation,emailValidation,signInController);
authRouter.post('/createUser',authenticateUser,checkPermission(['users.manage']),userCreateValidation,createUserController);
authRouter.post('/oauth',oauthController);
authRouter.post('/verify',verifyToken);
authRouter.post('/send-otp',signUpValidation,emailValidation,sendOTP);
authRouter.post('/verify-otp',verifyOTP);
authRouter.post('/forgot-password',forgotPassword);
authRouter.post('/reset-password',authenticateUser,resetPassword);

export default authRouter;