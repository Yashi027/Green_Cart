import jwt from "jsonwebtoken";

const authUser = async (req,res,next) => {
    const {token} = req.cookies;
    if(!token)
        return res.status(400).json({success:false,message:"Not authorised"});

    try {
        const tokenDecode = jwt.verify(token,process.env.JWT_SECRET)
        if(tokenDecode.id){
            req.userId = tokenDecode.id;
        }else{
            return res.status(400).json({success:false,message:"Not authorised"});
        }
        next();
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({success:false,message: `${error.message},AuthenticationError`});
    }
}

export default authUser;