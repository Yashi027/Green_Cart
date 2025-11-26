import express from 'express';
import authSeller from '../middleware/authSeller.js';
import { addProduct, changeStock, productById, productList } from '../controllers/ProductController.js';
import { upload } from '../configs/multer.js';

const productrouter = express.Router()

productrouter.post('/add', upload.array(["images"]), authSeller, addProduct);
productrouter.get('/list', productList)
productrouter.get('/id', productById)
productrouter.post('/stock', authSeller, changeStock)


export default productrouter;