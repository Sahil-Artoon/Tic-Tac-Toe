import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
        unique: true
    },
    socketId:{
        type: String
    }
},{timestamps:true})

const User = mongoose.model('User', userSchema)

export { User };