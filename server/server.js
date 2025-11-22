import cookieParser from 'cookie-parser';
import express from 'express';
import cors from 'cors'
import connectDb from './configs/db.js';
import 'dotenv/config'
import userRouter from './routes/userRoute.js';
import sellerrouter from './routes/sellerRoute.js';

const app=express();
const port = process.env.PORT || 4000;

await connectDb()

const allowedOrigins=['http://localhost:5173']

app.use(express.json());
app.use(cookieParser());
app.use(cors({origin: allowedOrigins, credentials:true}));

app.get(('/'),(req,res) => {
    res.send("API is working");
})

app.use('/api/user',userRouter)
app.use('/api/seller',sellerrouter)

app.listen(port , () => {
    console.log(`Server is running on http://localhost:${port}`)
})