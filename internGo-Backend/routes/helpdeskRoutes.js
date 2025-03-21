import express from 'express';
import { addHelpDesk, getHelpDeskDetails, modifyHelpDesk, removeHelpDesk } from '../controllers/helpdeskController.js';
import { authenticateUser, checkPermission} from '../middlewares/authenticationMiddleware.js';
import { helpDeskValidation } from '../middlewares/validationMiddleware.js';

const helpDeskRouter = express.Router();

helpDeskRouter.post('/', authenticateUser,checkPermission(['helpdesk.create','helpdesk.update']),helpDeskValidation, addHelpDesk);
helpDeskRouter.get('/:id', authenticateUser, checkPermission(['helpdesk.create','helpdesk.update','helpdesk.manage']), getHelpDeskDetails);
helpDeskRouter.patch('/:id', authenticateUser, checkPermission(['helpdesk.update',"helpdesk.manage"]), modifyHelpDesk);
helpDeskRouter.delete('/:id', authenticateUser,checkPermission(['helpdesk.manage']), removeHelpDesk);

export default helpDeskRouter;
