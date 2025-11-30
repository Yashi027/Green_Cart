import jwt from "jsonwebtoken";

const authUser = async (req,res,next) => {
    
    const {token} = req.cookies;

    if(!token)
        return res.status(401).json({success:false,message:"Not authorised"});

    try {
        const tokenDecode = jwt.verify(token,process.env.JWT_SECRET)
        if(tokenDecode.id){
            req.userId = tokenDecode.id;
        }else{
            return res.status(401).json({success:false,message:"Not authorised(Invalid token)"});
        }
        next();
    } catch (error) {
        console.log(error.message)
        return res.status(401).json({success:false,message: `${error.message},AuthenticationError`});
    }
}

export default authUser;