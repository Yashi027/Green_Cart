import jwt from 'jsonwebtoken';

const authSeller = async (req,res,next) => {
    const {sellertoken} = req.cookies;
    if(!sellertoken)
        return res.status(400).json({success:false,message:"Not authorised"});

    try {
        const tokenDecode = jwt.verify(sellertoken,process.env.JWT_SECRET)
        if(tokenDecode.email){
            req.userId = tokenDecode.id;
        }else{
            return res.status(400).json({success:false,message:"Not authorised"});
        }
        next();
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({success:false,message: `${error.message},SellerAuthenticationError`});
    }
}

export default authSeller;