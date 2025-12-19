import Product from "../models/Product.js";
import Order from "../models/Order.js";
import User from "../models/User.js"
import stripe from "stripe";

export const placeOrderCOD = async (req,res) => {
    try {
        const userId = req.userId;
        const { items, address} = req.body;
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


export const placeOrderStripe = async (req,res) => {
    try {
        const userId = req.userId;
        const { items, address} = req.body;
        const {origin} = req.headers;
        if(!address || items.length==0){
            return res.status(300).json({success:false, message:"Invalid Data"}) 
        }
        let productData = [];

        let amount = await items.reduce(async (acc,item) => {
            const product = await Product.findById(item.product);
            productData.push({
                name:product.name,
                price: product.offerPrice,
                quantity: item.quantity
            });
            return (await acc)+ product.offerPrice * item.quantity;
        },0)

        amount += Math.floor(amount*0.02);

        const order = await Order.create({
            userId,
            items,
            amount,
            address,
            paymentType:"Online"
        });

        const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY)

        const line_items = productData.map((item)=>{
            return{
                price_data:{
                    currency:"usd",
                    product_data:{
                        name:item.name,
                    },
                    unit_amount: Math.floor(item.price + item.price*0.02)*100
                },
                quantity: item.quantity,
            }
        })

        const session = await stripeInstance.checkout.sessions.create({
            line_items,
            mode:"payment",
            success_url:`${origin}/loader?next=my-orders`,
            cancel_url:`${origin}/cart`,
            metadata:{
                orderId: order._id.toString(),
                userId
            }
        })

        return res.status(200).json({success:true, url: session.url})
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({success:false,message: error.message})
    }
}

export const stripeWebhooks = async (req, res) => {
  const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);
  const sig = req.headers["stripe-signature"];

  let event;
  try {
    event = stripeInstance.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
    console.log("✅ Webhook received:", event.type);
  } catch (err) {
    console.log("❌ Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
        const session = event.data.object;
        const { orderId, userId } = session.metadata || {};
        console.log("Processing orderId:", orderId);

        if (orderId && userId) {
          await Order.findByIdAndUpdate(orderId, {
            isPaid: true,
            paymentType: "Online",
          });
          await User.findByIdAndUpdate(userId, { cartItems: {} });
          console.log("✅ Order marked PAID:", orderId);
        }
        break;

      case "payment_intent.payment_failed":
        const intent = event.data.object;
        const failedOrderId = intent.metadata?.orderId;
        if (failedOrderId) {
          await Order.findByIdAndDelete(failedOrderId);
          console.log("❌ Order deleted due to payment failure:", failedOrderId);
        }
        break;

      default:
        console.log(`Unhandled event: ${event.type}`);
    }

    res.json({ received: true });
  } catch (err) {
    console.error("Webhook error:", err);
    res.status(500).send("Webhook handler failed");
  }
};



export const getUserOrders = async (req, res) => {
    try {
        const userId = req.userId;
        const orders = await Order.find({
            userId,
            $or:[{paymentType:"COD"},{isPaid:true}]
        }).populate("items.product").sort({createdAt:-1});

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