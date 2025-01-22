import express from 'express';
import authRouter from './routes/authRoutes.js';
import userRouter from './routes/userRoutes.js';
import cors from 'cors';

const app=express();
const PORT=process.env.PORT || 8000;
const cors = require('cors');

const corsOptions = {
  origin: 'http://192.168.0.130:5173', 
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true, 
};

app.use(cors(corsOptions));

app.use(express.json())
app.use(cors())

app.use('/api/auth',authRouter);
app.use('/api/users',userRouter);

app.listen(PORT,()=>{
    console.log(`Successfully running on ${PORT}`)
})
