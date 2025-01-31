import express from 'express';
import { authenticateUser, checkPermission } from '../middlewares/authenticationMiddleware.js';
import { createObjective, createPlan, getAllPlans, updateObjective, updatePlan, getPlan, createMilestone, updateMilestone, deleteObjective, deleteMilestone, deletePlan, addUsers, removeUsers } from '../controllers/planController.js';
import { objectiveUpdateValidation,objectiveCreateValidation, planCreateValidation, planUpdateValidation, usersPlanValidation } from '../middlewares/validationMiddleware.js';

const planRouter=express.Router();

planRouter.get('/',authenticateUser,checkPermission(["plans.view"]),getAllPlans);
planRouter.get('/:id',authenticateUser,checkPermission(["plans.view"]),getPlan);
planRouter.post('/create',authenticateUser,checkPermission(["plans.create"]),planCreateValidation,createPlan);
planRouter.patch('/:id/update',authenticateUser,checkPermission(["plans.update"]),planUpdateValidation,updatePlan);
planRouter.delete('/delete/:id',authenticateUser,checkPermission(["plans.delete"]),deletePlan);
planRouter.post('/:id/create/objective',authenticateUser,checkPermission(["plans.create"]),objectiveCreateValidation,createObjective);
planRouter.patch('/:id/update/objective',authenticateUser,checkPermission(["plans.update"]),objectiveUpdateValidation,updateObjective);
planRouter.delete('/delete/objective/:id',authenticateUser,checkPermission(["plans.delete"]),deleteObjective);
planRouter.post('/:id/create/milestone',authenticateUser,checkPermission(["plans.create"]),createMilestone);
planRouter.patch('/:id/update/milestone',authenticateUser,checkPermission(["plans.update"]),updateMilestone);
planRouter.delete('/delete/milestone/:id',authenticateUser,checkPermission(["plans.delete"]),deleteMilestone);
planRouter.patch('/:id/addUsers',authenticateUser,checkPermission(["plans.update"]),usersPlanValidation,addUsers);
planRouter.patch('/:id/removeUsers',authenticateUser,checkPermission(["plans.update"]),usersPlanValidation,removeUsers);

export default planRouter;

