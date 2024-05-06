"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.playGame = void 0;
const logger_1 = require("../logger");
const eventName_1 = require("../constant/eventName");
const tableModel_1 = require("../model/tableModel");
const eventEmmitter_1 = require("../eventEmmitter");
const checkWinner_1 = require("./checkWinner");
const declareWinner_1 = require("./declareWinner");
const changeTurn_1 = require("./changeTurn");
const playGame = (data, socket) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logger_1.logger.info(`THis is Play Data:::::::${JSON.stringify(data)} and Socket is ::::: ${socket.id}`);
        if (data.sign == "X") {
            // This is for Play
            yield tableModel_1.Table.findByIdAndUpdate(data.tableId, { gameStatus: "PLAYING" });
            let parts = data.data.split("-");
            let numberOfBox = parts[1];
            yield tableModel_1.Table.findByIdAndUpdate(data.tableId, { [`playingData.${numberOfBox - 1}`]: { userId: data.userId, symbol: data.sign } });
            const findTableForCheckWinner = yield tableModel_1.Table.findById(data.tableId);
            if (findTableForCheckWinner) {
                let checkWinnerorNot = yield (0, checkWinner_1.checkWinner)(findTableForCheckWinner);
                if (checkWinnerorNot == "X") {
                    data = {
                        eventName: eventName_1.EVENT_NAME.PLAY_GAME,
                        data: {
                            _id: data.tableId,
                            userId: data.userId,
                            symbol: "X",
                            message: "ok",
                            winner: true,
                            cellId: data.data
                        },
                        socket
                    };
                    (0, eventEmmitter_1.sendToRoomEmmiter)(data);
                    data = {
                        tableId: findTableForCheckWinner._id,
                        userId: data.data.userId,
                        symbol: "X",
                    };
                    return yield (0, declareWinner_1.declareWinner)(data);
                }
                else if (checkWinnerorNot == "TIE") {
                    data = {
                        eventName: eventName_1.EVENT_NAME.PLAY_GAME,
                        data: {
                            _id: data.tableId,
                            userId: data.userId,
                            symbol: "X",
                            message: "ok",
                            winner: "TIE",
                            cellId: data.data
                        },
                        socket
                    };
                    (0, eventEmmitter_1.sendToRoomEmmiter)(data);
                    data = {
                        tableId: findTableForCheckWinner._id,
                        userId: data.data.userId,
                        symbol: "TIE",
                    };
                    return yield (0, declareWinner_1.declareWinner)(data);
                }
                data = {
                    eventName: eventName_1.EVENT_NAME.PLAY_GAME,
                    data: {
                        _id: data.tableId,
                        userId: data.userId,
                        symbol: "X",
                        message: "ok",
                        winner: false,
                        cellId: data.data
                    },
                    socket
                };
                (0, eventEmmitter_1.sendToRoomEmmiter)(data);
                return yield (0, changeTurn_1.changeTurn)({ tableId: findTableForCheckWinner._id });
            }
        }
        if (data.sign == "O") {
            // This is for Play
            yield tableModel_1.Table.findByIdAndUpdate(data.tableId, { gameStatus: "PLAYING" });
            let parts = data.data.split("-");
            let numberOfBox = parts[1];
            yield tableModel_1.Table.findByIdAndUpdate(data.tableId, { [`playingData.${numberOfBox - 1}`]: { userId: data.userId, symbol: data.sign } });
            const findTableForCheckWinner = yield tableModel_1.Table.findById(data.tableId);
            if (findTableForCheckWinner) {
                let checkWinnerorNot = yield (0, checkWinner_1.checkWinner)(findTableForCheckWinner);
                if (checkWinnerorNot == "O") {
                    data = {
                        eventName: eventName_1.EVENT_NAME.PLAY_GAME,
                        data: {
                            _id: data.tableId,
                            symbol: "O",
                            userId: data.userId,
                            winner: true,
                            message: "ok",
                            cellId: data.data
                        },
                        socket
                    };
                    (0, eventEmmitter_1.sendToRoomEmmiter)(data);
                    data = {
                        tableId: findTableForCheckWinner._id,
                        userId: data.data.userId,
                        symbol: "O",
                    };
                    return yield (0, declareWinner_1.declareWinner)(data);
                }
                else if (checkWinnerorNot == "TIE") {
                    data = {
                        eventName: eventName_1.EVENT_NAME.PLAY_GAME,
                        data: {
                            _id: data.tableId,
                            userId: data.userId,
                            symbol: "O",
                            message: "ok",
                            winner: "TIE",
                            cellId: data.data
                        },
                        socket
                    };
                    (0, eventEmmitter_1.sendToRoomEmmiter)(data);
                    data = {
                        tableId: findTableForCheckWinner._id,
                        userId: data.data.userId,
                        symbol: "TIE",
                    };
                    return yield (0, declareWinner_1.declareWinner)(data);
                }
                data = {
                    eventName: eventName_1.EVENT_NAME.PLAY_GAME,
                    data: {
                        _id: data.tableId,
                        userId: data.userId,
                        symbol: "O",
                        message: "ok",
                        winner: false,
                        cellId: data.data
                    },
                    socket
                };
                (0, eventEmmitter_1.sendToRoomEmmiter)(data);
                return yield (0, changeTurn_1.changeTurn)({ tableId: findTableForCheckWinner._id });
            }
        }
    }
    catch (error) {
        console.log("PlayGame Error: ", error);
        logger_1.logger.error("PlayGame Error: ", error);
    }
});
exports.playGame = playGame;
