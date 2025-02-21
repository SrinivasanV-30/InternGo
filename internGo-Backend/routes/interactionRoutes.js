import express from 'express';
import { authenticateUser, checkPermission, checkUser } from '../middlewares/authenticationMiddleware.js';
import { getInteractionByDateAndFiltering, getInteractionsByUser, scheduleInteraction, toggleScheduleStatus, updateInteraction } from '../controllers/interactionController.js';
import { interactionValidation } from '../middlewares/validationMiddleware.js';

const interactionRouter=express.Router();

interactionRouter.post('/schedule',authenticateUser,checkPermission(["interactions.schedule"]),interactionValidation,scheduleInteraction);
interactionRouter.post('/',authenticateUser,checkPermission(["interactions.schedule"]),getInteractionByDateAndFiltering);
interactionRouter.post('/:id',authenticateUser,checkPermission(['interactions.view']),checkUser,getInteractionsByUser);
interactionRouter.patch('/:id/update',authenticateUser,checkPermission(['interactions.schedule']),updateInteraction);
interactionRouter.get('/:id/toggleSchedule',authenticateUser,checkPermission(['interactions.schedule']),toggleScheduleStatus);

export default interactionRouter;