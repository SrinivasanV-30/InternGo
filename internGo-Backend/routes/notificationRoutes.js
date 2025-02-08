import express from 'express';
import { clearAllNotification, deleteNotification, getNotificationsByUserId, markAllAsRead, markAsRead } from '../controllers/notificationController.js';
import { authenticateUser, checkUser } from '../middlewares/authenticationMiddleware.js';

const notificationRouter=express.Router();


notificationRouter.get('/:id',authenticateUser,checkUser,getNotificationsByUserId);
notificationRouter.patch('/markAsRead',authenticateUser,markAsRead);
notificationRouter.patch('/:id/markAllAsRead',authenticateUser,checkUser,markAllAsRead);
notificationRouter.delete('/:id/delete',authenticateUser,checkUser,clearAllNotification);
notificationRouter.delete('/delete',authenticateUser,deleteNotification);

export default notificationRouter   