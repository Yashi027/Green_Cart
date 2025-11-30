import User from "../models/User.js";



export const updateCart = async (req, res) => {
    try {
        const { cartItems, userId } = req.body;

        if (!userId) return res.status(400).json({ success: false, message: "User ID missing" });

        await User.findByIdAndUpdate(userId, { cartItems }, { new: true });

        res.status(200).json({ success: true, message: "Cart Updated" });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ success: false, message: error.message });
    }
};
