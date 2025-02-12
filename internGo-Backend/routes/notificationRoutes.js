import express from 'express';
import { clearAllNotification, createAnnoncement, deleteNotification, getAnnouncement, getNotificationsByUserId, markAllAsRead, markAsRead } from '../controllers/notificationController.js';
import { authenticateUser, checkPermission, checkUser } from '../middlewares/authenticationMiddleware.js';

const notificationRouter=express.Router();


notificationRouter.get('/:id',authenticateUser,checkUser,getNotificationsByUserId);
notificationRouter.patch('/markAsRead',authenticateUser,markAsRead);
notificationRouter.patch('/:id/markAllAsRead',authenticateUser,checkUser,markAllAsRead);
notificationRouter.delete('/:id/delete',authenticateUser,checkUser,clearAllNotification);
notificationRouter.delete('/delete',authenticateUser,deleteNotification);
notificationRouter.post('/createAnnouncement',authenticateUser,checkPermission(['users.manage']),createAnnoncement);
notificationRouter.get('/get/announcements',authenticateUser,getAnnouncement);
export default notificationRouter   