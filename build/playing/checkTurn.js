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
const checkTurn = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logger_1.logger.info(`CheckTurn Data :::${JSON.stringify(data.tableId)}`);
        // RandomeTurn
        const randomNumber = Math.random();
        const ramdomNumberForGiveUserTurn = Math.round(randomNumber);
        console.log(`Random number is::::${ramdomNumberForGiveUserTurn}`);
        let dataOfTable = yield tableModel_1.Table.findById(data.tableId);
        if (dataOfTable) {
            yield tableModel_1.Table.findByIdAndUpdate(dataOfTable._id, {
                currentTurnSeatIndex: ramdomNumberForGiveUserTurn,
                currentTurnUserId: dataOfTable.playerInfo[ramdomNumberForGiveUserTurn].userId,
                gameStatus: "CHECK_TURN"
            });
            console.log("Check Turn Room id::::", dataOfTable._id);
            data = {
                eventName: eventName_1.EVENT_NAME.CHECK_TURN,
                data: {
                    _id: dataOfTable._id.toString(),
                    symbol: dataOfTable.playerInfo[ramdomNumberForGiveUserTurn].symbol,
                    userID: dataOfTable.playerInfo[ramdomNumberForGiveUserTurn].userId,
                    message: "ok"
                }
            };
            (0, eventEmmitter_1.sendToRoomEmmiter)(data);
        }
    }
    catch (error) {
        console.log("checkTurn Error: ", error);
        logger_1.logger.error("checkTurn Error: ", error);
    }
});
exports.checkTurn = checkTurn;
