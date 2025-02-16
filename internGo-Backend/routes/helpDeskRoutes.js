import express from 'express';
import { addHelpDesk, getHelpDeskDetails, modifyHelpDesk, removeHelpDesk } from '../controllers/helpDeskController.js';
import { authenticateUser, checkPermission, checkUser } from '../middlewares/authenticationMiddleware.js';
import { helpDeskValidation } from '../middlewares/validationMiddleware.js';

const helpDeskRouter = express.Router();

helpDeskRouter.post('/', authenticateUser,checkPermission(['helpdesk.create','helpdesk.update']),helpDeskValidation, addHelpDesk);
helpDeskRouter.get('/:id', authenticateUser, checkPermission(['helpdesk.create','helpdesk.update','helpdesk.manage']), getHelpDeskDetails);
helpDeskRouter.patch('/:id', authenticateUser, checkPermission(['helpdesk.update']), modifyHelpDesk);
helpDeskRouter.delete('/:id', authenticateUser,checkPermission(['helpdesk.manage']), removeHelpDesk);

export default helpDeskRouter;
