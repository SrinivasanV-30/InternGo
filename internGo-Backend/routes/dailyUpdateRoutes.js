import express from 'express';
import { authenticateUser } from '../middlewares/authenticationMiddleware.js';
import { getDailyUpdateByDate } from '../controllers/dailyUpdateController.js';

const dailyUpdateRouter=express.Router();

dailyUpdateRouter.post('',authenticateUser,getDailyUpdateByDate)

export default dailyUpdateRouter;