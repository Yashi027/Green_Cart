import Product from "../models/Product.js";
import Order from "../models/Order.js";

export const placeOrderCOD = async (req,res) => {
    try {
        const {userId, items, address} = req.body;
        if(!address || items.length==0){
            return res.status(300).json({success:false, message:"Invalid Data"}) 
        }
        let amount = await items.reduce(async (acc,item) => {
            const product = await Product.findById(item.product);
            return (await acc)+ product.offerPrice * item.quantity;
        },0)

        amount += Math.floor(amount*0.02);

        await Order.create({
            userId,
            items,
            amount,
            address,
            paymentType:"COD"
        });

        return res.status(200).json({success:true, message:"Order Placed Successfully"})
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({success:false,message: error.message})
    }
}


export const getUserOrders = async (req, res) => {
    try {
        const {userId} = req.body;
        const orders = await Order.find({
            userId,
            $or:[{paymentType:"COD"},{isPaid:true}]
        }).populate("items.product address").sort({createdAt:-1});

        res.status(200).json({success: true, orders});
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({success:false,message: error.message})
    }
}

export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find({
            $or:[{paymentType:"COD"},{isPaid:true}]
        }).populate("items.product address");

        res.status(200).json({success: true, orders});
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({success:false,message: error.message})
    }
}