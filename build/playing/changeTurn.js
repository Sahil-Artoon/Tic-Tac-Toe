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
exports.changeTurn = void 0;
const logger_1 = require("../logger");
const tableModel_1 = require("../model/tableModel");
const eventName_1 = require("../constant/eventName");
const eventEmmitter_1 = require("../eventEmmitter");
const turnTimer_1 = require("../bull/queue/turnTimer");
const cancleTurnTimerQueue_1 = require("../bull/cancleQueue/cancleTurnTimerQueue");
const timerConstant_1 = require("../constant/timerConstant");
const declareWinner_1 = require("./declareWinner");
const changeTurn = (data) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        logger_1.logger.info(`CHANGE_TURN DATA :::: ${JSON.stringify(data)}`);
        let findTable = yield tableModel_1.Table.findById(data.tableId);
        if (findTable) {
            if (findTable.currentTurnSeatIndex == 0) {
                if (data.play == false) {
                    let checkData = yield tableModel_1.Table.findByIdAndUpdate(findTable._id, { $inc: { [`playerInfo.${0}.turnMiss`]: 1 } }, { new: true });
                    if (((_a = checkData === null || checkData === void 0 ? void 0 : checkData.playerInfo[0]) === null || _a === void 0 ? void 0 : _a.turnMiss) == 3) {
                        data = {
                            tableId: checkData === null || checkData === void 0 ? void 0 : checkData._id.toString(),
                            userId: checkData === null || checkData === void 0 ? void 0 : checkData.playerInfo[1].userId,
                            symbol: checkData === null || checkData === void 0 ? void 0 : checkData.playerInfo[1].symbol,
                            isLeave: false
                        };
                        return (0, declareWinner_1.declareWinner)(data);
                    }
                }
                let updateTable = yield tableModel_1.Table.findByIdAndUpdate(findTable._id, {
                    currentTurnSeatIndex: "1",
                    currentTurnUserId: findTable.playerInfo[1].userId,
                    gameStatus: "PLAYING",
                }, { new: true });
                data = {
                    eventName: eventName_1.EVENT_NAME.CHANGE_TURN,
                    data: {
                        _id: updateTable === null || updateTable === void 0 ? void 0 : updateTable._id.toString(),
                        data: updateTable === null || updateTable === void 0 ? void 0 : updateTable.playerInfo[1],
                        userId: updateTable === null || updateTable === void 0 ? void 0 : updateTable.playerInfo[1].userId,
                        symbol: updateTable === null || updateTable === void 0 ? void 0 : updateTable.playerInfo[1].symbol,
                        time: timerConstant_1.TIMER.TURN_TIMER
                    }
                };
                (0, eventEmmitter_1.sendToRoomEmmiter)(data);
                let result = yield (0, cancleTurnTimerQueue_1.cancleTurnTimerJob)(updateTable === null || updateTable === void 0 ? void 0 : updateTable._id.toString());
                if (result == true) {
                    data = {
                        tableId: updateTable === null || updateTable === void 0 ? void 0 : updateTable._id.toString(),
                        time: timerConstant_1.TIMER.TURN_TIMER + 2
                    };
                    yield (0, turnTimer_1.turnTimer)(data);
                }
                else {
                    data = {
                        tableId: updateTable === null || updateTable === void 0 ? void 0 : updateTable._id.toString(),
                        time: timerConstant_1.TIMER.TURN_TIMER + 2
                    };
                    yield (0, turnTimer_1.turnTimer)(data);
                }
            }
            if (findTable.currentTurnSeatIndex == 1) {
                if (data.play == false) {
                    let checkData = yield tableModel_1.Table.findByIdAndUpdate(findTable._id, { $inc: { [`playerInfo.${1}.turnMiss`]: 1 } }, { new: true });
                    if (((_b = checkData === null || checkData === void 0 ? void 0 : checkData.playerInfo[1]) === null || _b === void 0 ? void 0 : _b.turnMiss) == 3) {
                        data = {
                            tableId: checkData === null || checkData === void 0 ? void 0 : checkData._id.toString(),
                            userId: checkData === null || checkData === void 0 ? void 0 : checkData.playerInfo[0].userId,
                            symbol: checkData === null || checkData === void 0 ? void 0 : checkData.playerInfo[0].symbol,
                            isLeave: false
                        };
                        return (0, declareWinner_1.declareWinner)(data);
                    }
                }
                let updateTable = yield tableModel_1.Table.findByIdAndUpdate(findTable._id, {
                    currentTurnSeatIndex: "0",
                    currentTurnUserId: findTable.playerInfo[0].userId,
                    gameStatus: "PLAYING",
                }, { new: true });
                data = {
                    eventName: eventName_1.EVENT_NAME.CHANGE_TURN,
                    data: {
                        _id: updateTable === null || updateTable === void 0 ? void 0 : updateTable._id.toString(),
                        data: updateTable === null || updateTable === void 0 ? void 0 : updateTable.playerInfo[0],
                        userId: updateTable === null || updateTable === void 0 ? void 0 : updateTable.playerInfo[0].userId,
                        symbol: updateTable === null || updateTable === void 0 ? void 0 : updateTable.playerInfo[0].symbol,
                        time: timerConstant_1.TIMER.TURN_TIMER
                    }
                };
                (0, eventEmmitter_1.sendToRoomEmmiter)(data);
                let result = yield (0, cancleTurnTimerQueue_1.cancleTurnTimerJob)(updateTable === null || updateTable === void 0 ? void 0 : updateTable._id.toString());
                if (result == true) {
                    data = {
                        tableId: updateTable === null || updateTable === void 0 ? void 0 : updateTable._id.toString(),
                        time: timerConstant_1.TIMER.TURN_TIMER + 2
                    };
                    yield (0, turnTimer_1.turnTimer)(data);
                }
                else {
                    data = {
                        tableId: updateTable === null || updateTable === void 0 ? void 0 : updateTable._id.toString(),
                        time: timerConstant_1.TIMER.TURN_TIMER + 2
                    };
                    yield (0, turnTimer_1.turnTimer)(data);
                }
            }
        }
    }
    catch (error) {
        logger_1.logger.error(`CHANGE_TURN ERROR :::: ${error}`);
    }
});
exports.changeTurn = changeTurn;
