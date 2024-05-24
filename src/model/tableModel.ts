import mongoose from "mongoose";

const tableSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: true
    },
    playerInfo: [{
        userId: {
            type: String,
            required: true
        },
        userName: {
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
        },
        turnMiss: {
            type: Number,
            default: 0
        }
    }],
    playingData: [{
        userId: {
            type: String
        },
        symbol: {
            type: String
        },
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
    },
    currentTurnSeatIndex: {
        type: Number
    },
    currentTurnUserId: {
        type: String
    },
    winnerUserId: {
        type: String
    }
}, { timestamps: true })

const Table = mongoose.model('Table', tableSchema)

export { Table }