import mongoose from "mongoose";

const tableSchema = new mongoose.Schema({
    playerInfo: [{
        userId: {
            type: String,
            required: true
        },
        userName: {
            type: String,
            required: true
        },
        socketId: {
            type: String,
            required: true
        },
        isActive: {
            type: Boolean,
            default: false
        },
        symbol: {
            type: String,
            required: true
        }
    }],
    playingData: [{
        userId: {
            type: String
        },
        symbol: {
            type: String
        }
    }],
    maxPlayer: {
        type: Number,
        default: 2
    },
    activePlayer: {
        type: Number,
        default: 0
    },
    gameStatus: {
        type: String
    }
}, { timestamps: true })

const Table = mongoose.model('Table', tableSchema)

export { Table }