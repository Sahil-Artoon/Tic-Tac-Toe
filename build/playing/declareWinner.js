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
exports.declareWinner = void 0;
const logger_1 = require("../logger");
const eventName_1 = require("../constant/eventName");
const eventEmmitter_1 = require("../eventEmmitter");
const tableModel_1 = require("../model/tableModel");
const reStart_1 = require("../bull/queue/reStart");
const declareWinner = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logger_1.logger.info(`DECLARE_WINNWE DATA :::: ${JSON.stringify(data)}`);
        if (data.symbol == "TIE") {
            let tableId = data.tableId;
            yield tableModel_1.Table.findByIdAndUpdate(data.tableId, { gameStatus: "TIE", winnerUserId: data.userId });
            data = {
                eventName: eventName_1.EVENT_NAME.WINNER,
                data: {
                    _id: data.tableId.toString(),
                    message: "TIE",
                    symbol: data.symbol,
                    timer: 5000
                }
            };
            setTimeout(() => {
                deleteTable(tableId);
            }, (60000 * 2));
            (0, eventEmmitter_1.sendToRoomEmmiter)(data);
            return yield (0, reStart_1.reStart)(data.data);
        }
        if (data.symbol == "O" || data.symbol == "X") {
            let tableId = data.tableId;
            yield tableModel_1.Table.findByIdAndUpdate(data.tableId, { gameStatus: "WINNING", winnerUserId: data.userId });
            data = {
                eventName: eventName_1.EVENT_NAME.WINNER,
                data: {
                    _id: data.tableId.toString(),
                    message: "Winner",
                    symbol: data.symbol,
                    userId: data.userId,
                    isLeave: data.isLeave,
                    timer: 5000
                },
            };
            setTimeout(() => {
                deleteTable(tableId);
            }, (60000 * 2));
            (0, eventEmmitter_1.sendToRoomEmmiter)(data);
            return yield (0, reStart_1.reStart)(data.data);
        }
    }
    catch (error) {
        logger_1.logger.error("DECLARE_WINNWE ERROR ::::", error);
    }
});
exports.declareWinner = declareWinner;
const deleteTable = (tableId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield tableModel_1.Table.findByIdAndDelete(tableId);
    }
    catch (error) {
        logger_1.logger.error("WINNER_TABLE_DELETE_ERROR", error);
    }
});
