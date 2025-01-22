import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import authRouter from './routes/authRoutes.js';
import userRouter from './routes/userRoutes.js';
import logger from './utils/logger.js';


const app=express();
const PORT=process.env.PORT || 8000;

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

app.listen(PORT,()=>{
    console.log(`Successfully running on ${PORT}`)
})
