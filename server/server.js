import cookieParser from 'cookie-parser';
import express from 'express';
import cors from 'cors'
import connectDb from './configs/db.js';
import 'dotenv/config'
import userRouter from './routes/userRoute.js';
import sellerrouter from './routes/sellerRoute.js';
import connectcloudinary from './configs/cloudinary.js';
import productrouter from './routes/productRoute.js';
import cartrouter from './routes/cartRoute.js';
import addressrouter from './routes/addressRoute.js';

const app=express();
const port = process.env.PORT || 4000;

await connectDb()
await connectcloudinary()

const allowedOrigins=['http://localhost:5173']

app.use(express.json());
app.use(cookieParser());
app.use(cors({origin: allowedOrigins, credentials:true}));

app.get(('/'),(req,res) => {
    res.send("API is working");
})

app.use('/api/user',userRouter)
app.use('/api/seller',sellerrouter)
app.use('/api/product',productrouter)
app.use('/api/cart',cartrouter)
app.use('/api/address',addressrouter)

app.listen(port , () => {
    console.log(`Server is running on http://localhost:${port}`)
})