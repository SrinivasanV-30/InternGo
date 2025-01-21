import express from 'express';
import authRouter from './routes/authRoutes.js';
import userRouter from './routes/userRoutes.js';
import cors from 'cors';

const app=express();
const PORT=process.env.PORT || 8000;

app.use(express.json())
app.use(cors())

app.use('/api/auth',authRouter);
app.use('/api/users',userRouter);

app.listen(PORT,()=>{
    console.log(`Successfully running on ${PORT}`)
})