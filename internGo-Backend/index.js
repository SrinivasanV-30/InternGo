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


const app=express();
const PORT=process.env.PORT || 8080;
const server = http.createServer(app);
webSocket(server);

startCronJobs()



const corsOptions = {
  origin: '*', 
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true, 
};


app.use(express.json());
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

server.listen(PORT,()=>{
    console.log(`Successfully running on ${PORT}`)
})

export {server};