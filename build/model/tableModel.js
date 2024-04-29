"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Table = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const tableSchema = new mongoose_1.default.Schema({
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
    },
    currentTurnSeatIndex: {
        type: String
    },
    currentTurnUserId: {
        type: String
    }
}, { timestamps: true });
const Table = mongoose_1.default.model('Table', tableSchema);
exports.Table = Table;
