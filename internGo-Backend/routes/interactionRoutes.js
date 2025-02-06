import express from 'express';
import { authenticateUser, checkPermission, checkUser } from '../middlewares/authenticationMiddleware.js';
import { getInteractionByDateAndFiltering, getInteractionByUserId, scheduleInteraction } from '../controllers/interactionController.js';
import { interactionValidation } from '../middlewares/validationMiddleware.js';

const interactionRouter=express.Router();

interactionRouter.post('/schedule',authenticateUser,checkPermission(["interactions.schedule"]),interactionValidation,scheduleInteraction);
interactionRouter.post('/',authenticateUser,checkPermission(["interactions.schedule"]),getInteractionByDateAndFiltering);
interactionRouter.get('/:id',authenticateUser,checkPermission(['interactions.view']),checkUser,getInteractionByUserId)

export default interactionRouter;