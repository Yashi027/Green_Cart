import mongoose from 'mongoose'

const connectDb = async () => {
    try {
        mongoose.connection.on(('connected'),() => {
            console.log("DB connected")
        })
        await mongoose.connect(`${process.env.MONGO_URI}/green_cart`)
    } catch (error) {
        console.log(error.message)
    }
}

export default connectDb;