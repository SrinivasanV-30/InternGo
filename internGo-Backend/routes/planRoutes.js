import express from 'express';
import { authenticateUser, checkPermission } from '../middlewares/authenticationMiddleware.js';
import { createObjective, createPlan, getAllPlans, updateObjective, updatePlan, getPlan } from '../controllers/planController.js';
import { objectiveUpdateValidation,objectiveCreateValidation, planCreateValidation, planUpdateValidation } from '../middlewares/validationMiddleware.js';

const planRouter=express.Router();

planRouter.get('/',authenticateUser,checkPermission(["plans.view"]),getAllPlans);
planRouter.get('/:id',authenticateUser,checkPermission(["plans.view"]),getPlan);
planRouter.post('/create',authenticateUser,checkPermission(["plans.create"]),planCreateValidation,createPlan);
planRouter.patch('/update/:id',authenticateUser,checkPermission(["plans.update"]),planUpdateValidation,updatePlan);
planRouter.post('/create/objective/:id',authenticateUser,checkPermission(["plans.create"]),objectiveCreateValidation,createObjective);
planRouter.patch('/update/objective/:id',authenticateUser,checkPermission(["plans.update"]),objectiveUpdateValidation,updateObjective);



export default planRouter;

