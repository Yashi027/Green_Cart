import express from 'express';
import authUser from '../middleware/authUser.js';
import { getAllOrders, getUserOrders, placeOrderCOD } from '../controllers/OrderController.js';

const orderrouter = express.Router();

orderrouter.post('/cod',authUser,placeOrderCOD);
orderrouter.get('/user',authUser,getUserOrders);
orderrouter.get('/seller',authUser,getAllOrders);

export default orderrouter;