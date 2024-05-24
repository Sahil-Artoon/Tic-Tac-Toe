import { required } from "joi";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: true
    },
    userName: {
        type: String,
        required: true
    },
    socketId: {
        type: String
    },
    tableId: {
        type: String
    },
    isBot: {
        type: Boolean,
    }
}, { timestamps: true })

const User = mongoose.model('User', userSchema)

export { User };