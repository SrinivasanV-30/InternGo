import express from 'express';
import { authenticateUser, checkPermission, checkUser } from '../middlewares/authenticationMiddleware.js';
import { addFeedback, generateFeedbackReport, getFeedbacksByInteraction, getFeedbacksByIntern, modifyFeedback, removeFeedback } from '../controllers/feedbackController.js';
import { feedbackValidation } from '../middlewares/validationMiddleware.js';

const feedbackRouter = express.Router();

feedbackRouter.post('/create', authenticateUser, checkPermission(['feedback.create']),feedbackValidation, addFeedback);
feedbackRouter.get('/interaction/:interactionId', authenticateUser, checkPermission(['feedback.view','feedback.create']), getFeedbacksByInteraction);
feedbackRouter.get('/intern/:internId', authenticateUser, checkPermission(['feedback.view','feedback.create']), getFeedbacksByIntern);
feedbackRouter.put('/:id/update', authenticateUser, checkPermission(['feedback.create']), modifyFeedback);
// feedbackRouter.delete('/:id/delete', authenticateUser, checkPermission(['feedback.delete']), removeFeedback);
feedbackRouter.get('/:id/download',generateFeedbackReport);
export default feedbackRouter;
