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
const playGame = (data, socket) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logger_1.logger.info(`Data is This :::${JSON.stringify(data)} and Socket is ::::: ${socket.id}`);
        if (data.sign == "X") {
            // This is for Play
            let gameStatusUpdate = yield tableModel_1.Table.findByIdAndUpdate(data.tableId, { gameStatus: "PLAYING" });
            let parts = data.data.split("-");
            let numberOfBox = parts[1];
            let updateTable = yield tableModel_1.Table.findByIdAndUpdate(data.tableId, { [`playingData.${numberOfBox - 1}`]: { userId: data.userId, symbol: data.sign } });
            const findTableForCheckWinner = yield tableModel_1.Table.findById(data.tableId);
            if (findTableForCheckWinner) {
                if (findTableForCheckWinner.playingData[0].symbol == "X" && findTableForCheckWinner.playingData[1].symbol == "X" && findTableForCheckWinner.playingData[2].symbol == "X" || //1
                    findTableForCheckWinner.playingData[3].symbol == "X" && findTableForCheckWinner.playingData[4].symbol == "X" && findTableForCheckWinner.playingData[5].symbol == "X" || //2
                    findTableForCheckWinner.playingData[6].symbol == "X" && findTableForCheckWinner.playingData[7].symbol == "X" && findTableForCheckWinner.playingData[8].symbol == "X" || //3
                    findTableForCheckWinner.playingData[0].symbol == "X" && findTableForCheckWinner.playingData[3].symbol == "X" && findTableForCheckWinner.playingData[6].symbol == "X" || //4
                    findTableForCheckWinner.playingData[1].symbol == "X" && findTableForCheckWinner.playingData[4].symbol == "X" && findTableForCheckWinner.playingData[7].symbol == "X" || //5
                    findTableForCheckWinner.playingData[2].symbol == "X" && findTableForCheckWinner.playingData[5].symbol == "X" && findTableForCheckWinner.playingData[8].symbol == "X" || //6
                    findTableForCheckWinner.playingData[0].symbol == "X" && findTableForCheckWinner.playingData[4].symbol == "X" && findTableForCheckWinner.playingData[8].symbol == "X" || //7
                    findTableForCheckWinner.playingData[2].symbol == "X" && findTableForCheckWinner.playingData[4].symbol == "X" && findTableForCheckWinner.playingData[6].symbol == "X" //8
                ) {
                    data = {
                        eventName: eventName_1.EVENT_NAME.PLAY_GAME,
                        data: {
                            _id: data.tableId,
                            symbol: "X",
                            message: "ok",
                            winner: true,
                            cellId: data.data
                        },
                        socket
                    };
                    return (0, eventEmmitter_1.sendToRoomEmmiter)(data);
                }
                else if (findTableForCheckWinner.playingData[0].symbol != "" && findTableForCheckWinner.playingData[1].symbol != "" && findTableForCheckWinner.playingData[2].symbol != "" && //1
                    findTableForCheckWinner.playingData[3].symbol != "" && findTableForCheckWinner.playingData[4].symbol != "" && findTableForCheckWinner.playingData[5].symbol != "" && //2
                    findTableForCheckWinner.playingData[6].symbol != "" && findTableForCheckWinner.playingData[7].symbol != "" && findTableForCheckWinner.playingData[8].symbol != "" && //3
                    findTableForCheckWinner.playingData[0].symbol != "" && findTableForCheckWinner.playingData[3].symbol != "" && findTableForCheckWinner.playingData[6].symbol != "" && //4
                    findTableForCheckWinner.playingData[1].symbol != "" && findTableForCheckWinner.playingData[4].symbol != "" && findTableForCheckWinner.playingData[7].symbol != "" && //5
                    findTableForCheckWinner.playingData[2].symbol != "" && findTableForCheckWinner.playingData[5].symbol != "" && findTableForCheckWinner.playingData[8].symbol != "" && //6
                    findTableForCheckWinner.playingData[0].symbol != "" && findTableForCheckWinner.playingData[4].symbol != "" && findTableForCheckWinner.playingData[8].symbol != "" && //7
                    findTableForCheckWinner.playingData[2].symbol != "" && findTableForCheckWinner.playingData[4].symbol != "" && findTableForCheckWinner.playingData[6].symbol != "" //8
                ) {
                    data = {
                        eventName: eventName_1.EVENT_NAME.PLAY_GAME,
                        data: {
                            _id: data.tableId,
                            symbol: "X",
                            message: "ok",
                            winner: "TIE",
                            cellId: data.data
                        },
                        socket
                    };
                    return (0, eventEmmitter_1.sendToRoomEmmiter)(data);
                }
            }
            data = {
                eventName: eventName_1.EVENT_NAME.PLAY_GAME,
                data: {
                    _id: data.tableId,
                    symbol: "X",
                    message: "ok",
                    winner: false,
                    cellId: data.data
                },
                socket
            };
            return (0, eventEmmitter_1.sendToRoomEmmiter)(data);
        }
        if (data.sign == "O") {
            // This is for Play
            let gameStatusUpdate = yield tableModel_1.Table.findByIdAndUpdate(data.tableId, { gameStatus: "PLAYING" });
            let parts = data.data.split("-");
            let numberOfBox = parts[1];
            let updateTable = yield tableModel_1.Table.findByIdAndUpdate(data.tableId, { [`playingData.${numberOfBox - 1}`]: { userId: data.userId, symbol: data.sign } });
            const findTableForCheckWinner = yield tableModel_1.Table.findById(data.tableId);
            if (findTableForCheckWinner) {
                if (findTableForCheckWinner.playingData[0].symbol == "O" && findTableForCheckWinner.playingData[1].symbol == "O" && findTableForCheckWinner.playingData[2].symbol == "O" || //1
                    findTableForCheckWinner.playingData[3].symbol == "O" && findTableForCheckWinner.playingData[4].symbol == "O" && findTableForCheckWinner.playingData[5].symbol == "O" || //2
                    findTableForCheckWinner.playingData[6].symbol == "O" && findTableForCheckWinner.playingData[7].symbol == "O" && findTableForCheckWinner.playingData[8].symbol == "O" || //3
                    findTableForCheckWinner.playingData[0].symbol == "O" && findTableForCheckWinner.playingData[3].symbol == "O" && findTableForCheckWinner.playingData[6].symbol == "O" || //4
                    findTableForCheckWinner.playingData[1].symbol == "O" && findTableForCheckWinner.playingData[4].symbol == "O" && findTableForCheckWinner.playingData[7].symbol == "O" || //5
                    findTableForCheckWinner.playingData[2].symbol == "O" && findTableForCheckWinner.playingData[5].symbol == "O" && findTableForCheckWinner.playingData[8].symbol == "O" || //6
                    findTableForCheckWinner.playingData[0].symbol == "O" && findTableForCheckWinner.playingData[4].symbol == "O" && findTableForCheckWinner.playingData[8].symbol == "O" || //7
                    findTableForCheckWinner.playingData[2].symbol == "O" && findTableForCheckWinner.playingData[4].symbol == "O" && findTableForCheckWinner.playingData[6].symbol == "O" //8
                ) {
                    data = {
                        eventName: eventName_1.EVENT_NAME.PLAY_GAME,
                        data: {
                            _id: data.tableId,
                            symbol: "O",
                            winner: true,
                            message: "ok",
                            cellId: data.data
                        },
                        socket
                    };
                    return (0, eventEmmitter_1.sendToRoomEmmiter)(data);
                }
                else if (findTableForCheckWinner.playingData[0].symbol != "" && findTableForCheckWinner.playingData[1].symbol != "" && findTableForCheckWinner.playingData[2].symbol != "" && //1
                    findTableForCheckWinner.playingData[3].symbol != "" && findTableForCheckWinner.playingData[4].symbol != "" && findTableForCheckWinner.playingData[5].symbol != "" && //2
                    findTableForCheckWinner.playingData[6].symbol != "" && findTableForCheckWinner.playingData[7].symbol != "" && findTableForCheckWinner.playingData[8].symbol != "" && //3
                    findTableForCheckWinner.playingData[0].symbol != "" && findTableForCheckWinner.playingData[3].symbol != "" && findTableForCheckWinner.playingData[6].symbol != "" && //4
                    findTableForCheckWinner.playingData[1].symbol != "" && findTableForCheckWinner.playingData[4].symbol != "" && findTableForCheckWinner.playingData[7].symbol != "" && //5
                    findTableForCheckWinner.playingData[2].symbol != "" && findTableForCheckWinner.playingData[5].symbol != "" && findTableForCheckWinner.playingData[8].symbol != "" && //6
                    findTableForCheckWinner.playingData[0].symbol != "" && findTableForCheckWinner.playingData[4].symbol != "" && findTableForCheckWinner.playingData[8].symbol != "" && //7
                    findTableForCheckWinner.playingData[2].symbol != "" && findTableForCheckWinner.playingData[4].symbol != "" && findTableForCheckWinner.playingData[6].symbol != "" //8
                ) {
                    data = {
                        eventName: eventName_1.EVENT_NAME.PLAY_GAME,
                        data: {
                            _id: data.tableId,
                            symbol: "O",
                            message: "ok",
                            winner: "TIE",
                            cellId: data.data
                        },
                        socket
                    };
                    return (0, eventEmmitter_1.sendToRoomEmmiter)(data);
                }
            }
            data = {
                eventName: eventName_1.EVENT_NAME.PLAY_GAME,
                data: {
                    _id: data.tableId,
                    symbol: "O",
                    message: "ok",
                    winner: false,
                    cellId: data.data
                },
                socket
            };
            return (0, eventEmmitter_1.sendToRoomEmmiter)(data);
        }
    }
    catch (error) {
        console.log("PlayGame Error: ", error);
        logger_1.logger.error("PlayGame Error: ", error);
    }
});
exports.playGame = playGame;
