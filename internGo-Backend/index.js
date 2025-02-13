import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import authRouter from './routes/authRoutes.js';
import userRouter from './routes/userRoutes.js';
import planRouter from './routes/planRoutes.js';
import logger from './utils/logger.js';
import dailyUpdateRouter from './routes/dailyUpdateRoutes.js';
import interactionRouter from './routes/interactionRoutes.js';
import http from "http";
import { webSocket } from './services/webSocketService.js';

import { startCronJobs } from './cron.js';
import notificationRouter from './routes/notificationRoutes.js';
import feedbackRouter from './routes/feedbackRoutes.js';
import { zoneCalculation } from './utils/zoneCalculation.js';
import { sendToAdmins } from './services/notificationService.js';
import { generateFeedbackReport } from './controllers/feedbackController.js';
import { sendRemaindersForInteraction, sendSchedulingRemindersToAdmins } from './cron_jobs/interactionRemainders.js';


const app=express();
const PORT=process.env.PORT || 8080;
const server = http.createServer(app);
webSocket(server);

// zoneCalculation("f2f48358-64c5-4020-b8d9-aeddfeba6405")
startCronJobs()
sendSchedulingRemindersToAdmins();
// generateFeedbackReport("f2f48358-64c5-4020-b8d9-aeddfeba6405")
const corsOptions = {
  origin: '*', 
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true, 
};


app.use(express.json({ limit: '1mb' }));

app.use(morgan('combined',{
    stream:{
        write:(message)=>logger.info(message.trim())
    }
}))
app.use(cors(corsOptions));


app.use('/api/auth',authRouter);
app.use('/api/users',userRouter);
app.use('/api/plans',planRouter);
app.use('/api/dailyUpdates',dailyUpdateRouter);
app.use('/api/interactions',interactionRouter);
app.use('/api/notifications',notificationRouter);
app.use('/api/feedbacks',feedbackRouter)

server.listen(PORT,()=>{
    console.log(`Successfully running on ${PORT}`)
})

export {server};