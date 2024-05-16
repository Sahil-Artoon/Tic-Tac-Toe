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
exports.checkTurn = void 0;
const eventEmmitter_1 = require("../eventEmmitter");
const eventName_1 = require("../constant/eventName");
const tableModel_1 = require("../model/tableModel");
const logger_1 = require("../logger");
const turnTimer_1 = require("../bull/queue/turnTimer");
const timerConstant_1 = require("../constant/timerConstant");
const checkTurn = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logger_1.logger.info(`CHECK_TURN DATA :::: ${JSON.stringify(data.tableId)}`);
        // RandomeTurn
        const randomNumber = Math.floor(Math.random() * 100) + 1;
        let ramdomNumberForGiveUserTurn;
        if (randomNumber % 2 == 1) {
            ramdomNumberForGiveUserTurn = 1;
        }
        else {
            ramdomNumberForGiveUserTurn = 0;
        }
        let dataOfTable = yield tableModel_1.Table.findById(data.tableId);
        yield tableModel_1.Table.findByIdAndUpdate(dataOfTable === null || dataOfTable === void 0 ? void 0 : dataOfTable._id, {
            currentTurnSeatIndex: ramdomNumberForGiveUserTurn,
            currentTurnUserId: dataOfTable === null || dataOfTable === void 0 ? void 0 : dataOfTable.playerInfo[ramdomNumberForGiveUserTurn].userId,
            gameStatus: "CHECK_TURN"
        });
        data = {
            eventName: eventName_1.EVENT_NAME.CHECK_TURN,
            data: {
                _id: dataOfTable === null || dataOfTable === void 0 ? void 0 : dataOfTable._id.toString(),
                symbol: dataOfTable === null || dataOfTable === void 0 ? void 0 : dataOfTable.playerInfo[ramdomNumberForGiveUserTurn].symbol,
                userID: dataOfTable === null || dataOfTable === void 0 ? void 0 : dataOfTable.playerInfo[ramdomNumberForGiveUserTurn].userId,
                time: timerConstant_1.TIMER.TURN_TIMER,
                message: "ok"
            }
        };
        (0, eventEmmitter_1.sendToRoomEmmiter)(data);
        data = {
            tableId: dataOfTable === null || dataOfTable === void 0 ? void 0 : dataOfTable._id.toString(),
            time: timerConstant_1.TIMER.TURN_TIMER + 2
        };
        (0, turnTimer_1.turnTimer)(data);
    }
    catch (error) {
        logger_1.logger.error("CHECK_TURN ERROR :::: ", error);
    }
});
exports.checkTurn = checkTurn;
