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
exports.leaveGame = void 0;
const logger_1 = require("../logger");
const tableModel_1 = require("../model/tableModel");
const leaveGameValidation_1 = require("../validation/leaveGameValidation");
const eventName_1 = require("../constant/eventName");
const eventEmmitter_1 = require("../eventEmmitter");
const userModel_1 = require("../model/userModel");
const declareWinner_1 = require("./declareWinner");
const cancleRoundTimerQueue_1 = require("../bull/cancleQueue/cancleRoundTimerQueue");
const leaveGame = (data, socket) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logger_1.logger.info(`LEAVE_GAME DATA :::: ${JSON.stringify(data)}`);
        let checkData = yield (0, leaveGameValidation_1.validationLeaveGame)(data.userData);
        if (checkData.error) {
            data = {
                eventName: eventName_1.EVENT_NAME.POP_UP,
                data: {
                    message: "Please send Valid data"
                },
                socket
            };
            return (0, eventEmmitter_1.sendToSocketIdEmmiter)(data);
        }
        let findTable = yield tableModel_1.Table.findById(data.userData.tableId);
        if (findTable) {
            if (findTable.gameStatus == "WATING") {
                yield tableModel_1.Table.findByIdAndDelete(findTable._id);
                yield userModel_1.User.findByIdAndUpdate(data.userData.userData.userId, { $set: { tableId: "" } });
                data = {
                    eventName: eventName_1.EVENT_NAME.LEAVE_GAME,
                    data: {
                        gameStatus: "WATING",
                        message: "ok"
                    },
                    socket
                };
                return (0, eventEmmitter_1.sendToSocketIdEmmiter)(data);
            }
            if (findTable.gameStatus == "ROUND_TIMER_START") {
                if (findTable.playerInfo[0].userId == data.userData.userData.userId) {
                    let check = yield (0, cancleRoundTimerQueue_1.getCancleJob)(findTable._id.toString());
                    if (check == true) {
                        yield tableModel_1.Table.findByIdAndUpdate(findTable._id, { $pull: { playerInfo: findTable.playerInfo[0] } });
                        let newTable = yield tableModel_1.Table.findByIdAndUpdate(findTable._id, { $set: { activePlayer: findTable.activePlayer - 1, gameStatus: "WATING" } }, { new: true });
                        yield userModel_1.User.findByIdAndUpdate(data.userData.userData.userId, { $set: { tableId: "" } });
                        data = {
                            eventName: eventName_1.EVENT_NAME.LEAVE_GAME,
                            data: {
                                _id: newTable === null || newTable === void 0 ? void 0 : newTable._id.toString(),
                                gameStatus: "ROUND_TIMER",
                                tableData: newTable,
                                message: "ok",
                                userId: data.userData.userData.userId
                            },
                            socket
                        };
                        return (0, eventEmmitter_1.sendToRoomEmmiter)(data);
                    }
                }
                if (findTable.playerInfo[1].userId == data.userData.userData.userId) {
                    let check = yield (0, cancleRoundTimerQueue_1.getCancleJob)(findTable._id.toString());
                    if (check == true) {
                        yield tableModel_1.Table.findByIdAndUpdate(findTable._id, { $pull: { playerInfo: findTable.playerInfo[1] } });
                        let newTable = yield tableModel_1.Table.findByIdAndUpdate(findTable._id, { $set: { activePlayer: findTable.activePlayer - 1, gameStatus: "WATING" } }, { new: true });
                        yield userModel_1.User.findByIdAndUpdate(data.userData.userData.userId, { $set: { tableId: "" } });
                        data = {
                            eventName: eventName_1.EVENT_NAME.LEAVE_GAME,
                            data: {
                                _id: newTable === null || newTable === void 0 ? void 0 : newTable._id.toString(),
                                gameStatus: "ROUND_TIMER",
                                tableData: newTable,
                                message: "ok",
                                userId: data.userData.userData.userId
                            },
                            socket
                        };
                        return (0, eventEmmitter_1.sendToRoomEmmiter)(data);
                    }
                }
            }
            if (findTable.gameStatus == "CHECK_TURN") {
                if (findTable.playerInfo[0].userId == data.userData.userData.userId) {
                    data = {
                        userId: findTable.playerInfo[1].userId,
                        symbol: data.userData.userData.symbol,
                        tableId: data.userData.tableId,
                        isLeave: true
                    };
                    return (0, declareWinner_1.declareWinner)(data);
                }
                if (findTable.playerInfo[1].userId == data.userData.userData.userId) {
                    data = {
                        userId: findTable.playerInfo[0].userId,
                        symbol: data.userData.userData.symbol,
                        tableId: data.userData.tableId,
                        isLeave: true
                    };
                    return (0, declareWinner_1.declareWinner)(data);
                }
            }
            if (findTable.gameStatus == "PLAYING") {
                if (findTable.playerInfo[0].userId == data.userData.userData.userId) {
                    data = {
                        userId: findTable.playerInfo[1].userId,
                        symbol: data.userData.userData.symbol,
                        tableId: data.userData.tableId,
                        isLeave: true
                    };
                    return (0, declareWinner_1.declareWinner)(data);
                }
                if (findTable.playerInfo[1].userId == data.userData.userData.userId) {
                    data = {
                        userId: findTable.playerInfo[0].userId,
                        symbol: data.userData.userData.symbol,
                        tableId: data.userData.tableId,
                        isLeave: true
                    };
                    return (0, declareWinner_1.declareWinner)(data);
                }
            }
        }
    }
    catch (error) {
        console.log(error);
    }
});
exports.leaveGame = leaveGame;
