import jwt from 'jsonwebtoken'


export const sellerLogin = async (req, res) => {
    const { email, password } = req.body;

    try {
        if (password === process.env.SELLER_PASSWORD && email === process.env.SELLER_EMAIL) {
            const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '7d' })

            res.cookie('sellertoken', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000
            })

            return res.status(200).json({ success: true, message: "Successful Login" })
        } else {
            return res.status(400).json({ success: true, message: "Invalid Credentials" })
        }
    } catch (error) {
        console.log(error.message)
        res.status(500).json({success:false,message: error.message})
    }
}

export const sellerisAuth = async(req,res) => {
    try {
        return res.status(200).json({success:true})
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({success:false,message: error.message})
    }
}

export const sellerlogout = async (req,res) => {
    try {
      res.clearCookie('token',{
            httpOnly:true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict'
        }) 
         return res.status(200).json({success:true, message:"Logged out"})
 
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({success:false,message: error.message})
    }
}