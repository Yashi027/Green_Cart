import express from 'express';
import { addAddress, getAddress } from '../controllers/AddressController.js';
import authUser from '../middleware/authUser.js';

const addressrouter = express.Router();

addressrouter.post('/add',authUser ,addAddress)
addressrouter.get('/get',authUser, getAddress)

export default addressrouter;