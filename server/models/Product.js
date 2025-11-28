import mongoose from 'mongoose';


const productSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    description:{
        type: [],
        required: true
    },
    price:{
        type: Number,
        required:true
    },
    offerPrice:{
        type: Number,
        required:true
    },
    image:{
        type: [],
        required: true
    },
    category:{
        type: [],
        required: true
    },
    inStock:{
        type: Boolean,
        default: true
    }
},{timestamps:true})

const Product = mongoose.model('Product',productSchema)

export default Product