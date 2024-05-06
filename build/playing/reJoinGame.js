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
exports.reJoinGame = void 0;
const logger_1 = require("../logger");
const tableModel_1 = require("../model/tableModel");
const userModel_1 = require("../model/userModel");
const eventEmmitter_1 = require("../eventEmmitter");
const eventName_1 = require("../constant/eventName");
const reJoinGame = (data, socket) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logger_1.logger.info(`eventName is::::: Rejoin_game and data is::: ${JSON.stringify(data)}`);
        // console.log("Rejoin Event::::::", data)
        let findTable = yield tableModel_1.Table.findById(data.tableId);
        if (findTable) {
            // console.log("This is Rejoin Table ::::", findTable)
            if (findTable.playerInfo.length == 1) {
                console.log("This is One Player", findTable.playerInfo);
                if (findTable.playerInfo[0].userId == data.userData.userId) {
                    yield userModel_1.User.findByIdAndUpdate(findTable.playerInfo[0].userId, { socketId: socket.id });
                    yield tableModel_1.Table.findByIdAndUpdate(findTable._id, { $set: { 'playerInfo[0].socketId': socket.id } });
                }
                socket.join(findTable._id.toString());
                if (findTable.gameStatus == "WATING") {
                    data = {
                        eventName: eventName_1.EVENT_NAME.REJOIN_GAME,
                        data: {
                            gameStatus: findTable.gameStatus,
                            data
                        },
                        socket
                    };
                    return (0, eventEmmitter_1.sendToSocketIdEmmiter)(data);
                }
            }
            if (findTable.playerInfo.length == 2) {
                if (findTable.playerInfo[0].userId == data.userData.userId) {
                    yield userModel_1.User.findByIdAndUpdate(findTable.playerInfo[0].userId, { socketId: socket.id });
                }
                if (findTable.playerInfo[1].userId == data.userData.userId) {
                    yield userModel_1.User.findByIdAndUpdate(findTable.playerInfo[1].userId, { socketId: socket.id });
                }
                socket.join(findTable._id.toString());
                if (findTable.gameStatus == "WATING") {
                    data = {
                        eventName: eventName_1.EVENT_NAME.REJOIN_GAME,
                        data: {
                            gameStatus: findTable.gameStatus,
                            data
                        },
                        socket
                    };
                    return (0, eventEmmitter_1.sendToSocketIdEmmiter)(data);
                }
                if (findTable.gameStatus == "ROUND_TIMER_START") {
                    data = {
                        eventName: eventName_1.EVENT_NAME.REJOIN_GAME,
                        data: {
                            gameStatus: findTable.gameStatus,
                            data
                        },
                        socket
                    };
                    return (0, eventEmmitter_1.sendToSocketIdEmmiter)(data);
                }
                if (findTable.gameStatus == "CHECK_TURN") {
                    data = {
                        eventName: eventName_1.EVENT_NAME.REJOIN_GAME,
                        data: {
                            gameStatus: findTable.gameStatus,
                            data,
                            tableData: findTable
                        },
                        socket
                    };
                    return (0, eventEmmitter_1.sendToSocketIdEmmiter)(data);
                }
                if (findTable.gameStatus == "PLAYING") {
                    data = {
                        eventName: eventName_1.EVENT_NAME.REJOIN_GAME,
                        data: {
                            gameStatus: findTable.gameStatus,
                            data,
                            tableData: findTable
                        },
                        socket
                    };
                    return (0, eventEmmitter_1.sendToSocketIdEmmiter)(data);
                }
                if (findTable.gameStatus == "WINNER" || findTable.gameStatus == "TIE") {
                    data = {
                        eventName: eventName_1.EVENT_NAME.REJOIN_GAME,
                        data: {
                            gameStatus: findTable.gameStatus,
                            data,
                            tableData: findTable
                        },
                        socket
                    };
                    return (0, eventEmmitter_1.sendToSocketIdEmmiter)(data);
                }
            }
        }
    }
    catch (error) {
        console.log("Rejoin Game Error::::", error);
        logger_1.logger.error("Rejoin Game Error::::", error);
    }
});
exports.reJoinGame = reJoinGame;
