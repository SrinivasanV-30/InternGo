import express from 'express';
import { clearAllNotification, createAnnoncement, deleteFCM, deleteNotification, getAnnouncement, getNotificationsByUserId, markAllAsRead, markAsRead, userFCMUpsert } from '../controllers/notificationController.js';
import { authenticateUser, checkPermission, checkUser } from '../middlewares/authenticationMiddleware.js';

const notificationRouter=express.Router();


notificationRouter.get('/:id',authenticateUser,checkUser,getNotificationsByUserId);
notificationRouter.patch('/markAsRead',authenticateUser,markAsRead);
notificationRouter.patch('/:id/markAllAsRead',authenticateUser,checkUser,markAllAsRead);
notificationRouter.delete('/:id/delete',authenticateUser,checkUser,clearAllNotification);
notificationRouter.delete('/delete',authenticateUser,deleteNotification);
notificationRouter.post('/createAnnouncement',authenticateUser,checkPermission(['users.manage']),createAnnoncement);
notificationRouter.get('/get/announcements',authenticateUser,getAnnouncement);
notificationRouter.post('/registerFCM',userFCMUpsert);
notificationRouter.post('/deleteFCM',deleteFCM);
export default notificationRouter   