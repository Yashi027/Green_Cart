import express from 'express';
import authUser from '../middleware/authUser.js';
import { updateCart } from '../controllers/CartController.js';


const cartrouter = express.Router();

cartrouter.post('/update',authUser,updateCart);

export default cartrouter;