import express from 'express';
import { authenticateUser, checkPermission } from '../middlewares/authenticationMiddleware.js';
import { createObjective, createPlan, getAllPlans, updateObjective, updatePlan, getPlan, createMilestone, updateMilestone, deleteObjective, deleteMilestone, deletePlan, addUsers, removeUsers, getPlanUsers, createMultipleObjectives, updateMultipleObjectives } from '../controllers/planController.js';
import { objectiveUpdateValidation,objectivesUpdateValidation,objectiveCreateValidation,objectivesCreateValidation, planCreateValidation, planUpdateValidation, usersPlanValidation, milestoneCreateValidation, milestoneUpdateValidation } from '../middlewares/validationMiddleware.js';

const planRouter=express.Router();

planRouter.get('/',authenticateUser,checkPermission(["plans.view"]),getAllPlans);
planRouter.get('/:id',authenticateUser,checkPermission(["plans.view"]),getPlan);
planRouter.post('/create',authenticateUser,checkPermission(["plans.create"]),planCreateValidation,createPlan);
planRouter.patch('/:id/update',authenticateUser,checkPermission(["plans.update"]),planUpdateValidation,updatePlan);
planRouter.delete('/delete/:id',authenticateUser,checkPermission(["plans.delete"]),deletePlan);
planRouter.post('/:id/create/objective',authenticateUser,checkPermission(["plans.create"]),objectiveCreateValidation,createObjective);
planRouter.post('/:id/create/objectives',authenticateUser,checkPermission(["plans.create"]),objectivesCreateValidation,createMultipleObjectives);
planRouter.patch('/:id/update/objective',authenticateUser,checkPermission(["plans.update"]),objectiveUpdateValidation,updateObjective);
planRouter.patch('/:id/update/objectives',authenticateUser,checkPermission(["plans.update"]),objectivesUpdateValidation,updateMultipleObjectives);
planRouter.delete('/delete/objective/:id',authenticateUser,checkPermission(["plans.delete"]),deleteObjective);
planRouter.post('/:id/create/milestone',authenticateUser,checkPermission(["plans.create"]),milestoneCreateValidation,createMilestone);
planRouter.patch('/:id/update/milestone',authenticateUser,checkPermission(["plans.update"]),milestoneUpdateValidation,updateMilestone);
planRouter.delete('/delete/milestone/:id',authenticateUser,checkPermission(["plans.delete"]),deleteMilestone);
planRouter.patch('/:id/addUsers',authenticateUser,checkPermission(["plans.update"]),usersPlanValidation,addUsers);
planRouter.patch('/:id/removeUsers',authenticateUser,checkPermission(["plans.update"]),usersPlanValidation,removeUsers);
planRouter.post('/:id/users',authenticateUser,checkPermission(["plans.view"]),getPlanUsers);

export default planRouter;

