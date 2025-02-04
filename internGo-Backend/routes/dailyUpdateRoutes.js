import express from 'express';
import { authenticateUser, checkPermission, checkUser } from '../middlewares/authenticationMiddleware.js';
import { getDailyUpdateByDateAndFiltering, getSingleDayUpdates, upsertDailyUpdatesTasks } from '../controllers/dailyUpdateController.js';

import { dailyUpdateTaskValidation } from '../middlewares/validationMiddleware.js';

const dailyUpdateRouter=express.Router();

dailyUpdateRouter.post('/',authenticateUser,checkPermission(['tasks.view']),getDailyUpdateByDateAndFiltering);
dailyUpdateRouter.post('/:id/create',authenticateUser,checkPermission(['tasks.update']),checkUser,dailyUpdateTaskValidation,upsertDailyUpdatesTasks);
dailyUpdateRouter.get('/:id',authenticateUser,checkPermission(['tasks.update','tasks.view']),checkUser,getSingleDayUpdates);

export default dailyUpdateRouter;