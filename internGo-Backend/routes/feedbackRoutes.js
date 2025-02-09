import express from 'express';
import { authenticateUser, checkPermission } from '../middlewares/authenticationMiddleware.js';
import { addFeedback, getFeedbacksByInteraction, getFeedbacksByIntern, modifyFeedback, removeFeedback } from '../controllers/feedbackController.js';

const feedbackRouter = express.Router();

feedbackRouter.post('/create', authenticateUser, checkPermission(['feedback.create']), addFeedback);
feedbackRouter.get('/interaction/:interactionId', authenticateUser, checkPermission(['feedback.view']), getFeedbacksByInteraction);
feedbackRouter.get('/intern/:internId', authenticateUser, checkPermission(['feedback.view']), getFeedbacksByIntern);
feedbackRouter.put('/:id/update', authenticateUser, checkPermission(['feedback.create']), modifyFeedback);
// feedbackRouter.delete('/:id/delete', authenticateUser, checkPermission(['feedback.delete']), removeFeedback);

export default feedbackRouter;
