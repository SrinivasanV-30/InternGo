import express from 'express';
import { signUpController, oauthController, signInController } from '../controllers/authController.js';
import { emailValidation, signInValidation, signUpValidation } from '../middlewares/validationMiddleware.js';

const authRouter = express.Router();

authRouter.post('/signup',signUpValidation,emailValidation,signUpController);
authRouter.post('/signin',signInValidation,emailValidation,signInController);
authRouter.post('/oauth',oauthController);

export default authRouter;