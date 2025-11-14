import User from "../models/User.js"

export const register = async () => {
    try {
        const {name,email,password} = req.body()

        if(!name || !email || !password){
            return res.json({success:false, message:"Missing Details"})
        }
        const existingUser = await User.findOne({email})
        if(existingUser)
            return res.json({success:false, message:"User already exists"})
    } catch (error) {
        console.log(error)
    }
}