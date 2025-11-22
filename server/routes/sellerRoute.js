import express from 'express';
import authSeller from '../middleware/authSeller.js';
import { sellerLogin, sellerlogout, sellerisAuth } from '../controllers/SellerController.js';


const sellerrouter  = express.Router();
sellerrouter.post('/login',sellerLogin);
sellerrouter.get('/logout',authSeller , sellerlogout)
sellerrouter.get('/is-auth',authSeller, sellerisAuth)


export default sellerrouter;