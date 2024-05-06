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
const declareWinner = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logger_1.logger.info(`Data is Winner::::::: ${JSON.stringify(data)}`);
        console.log("Declare Winner Data", data);
        if (data.symbol == "TIE") {
            let tableId = data.tableId;
            yield tableModel_1.Table.findByIdAndUpdate(data.tableId, { gameStatus: "TIE", winnerUserId: data.userId });
            data = {
                eventName: eventName_1.EVENT_NAME.WINNER,
                data: {
                    _id: data.tableId.toString(),
                    message: "TIE",
                    symbol: data.symbol
                }
            };
            setTimeout(() => {
                deleteTable(tableId);
            }, 60000);
            return (0, eventEmmitter_1.sendToRoomEmmiter)(data);
        }
        if (data.symbol == "O" || data.symbol == "X") {
            let tableId = data.tableId;
            yield tableModel_1.Table.findByIdAndUpdate(data.tableId, { gameStatus: "WINNER", winnerUserId: data.userId });
            data = {
                eventName: eventName_1.EVENT_NAME.WINNER,
                data: {
                    _id: data.tableId.toString(),
                    message: "Winner",
                    symbol: data.symbol
                },
            };
            setTimeout(() => {
                deleteTable(tableId);
            }, 60000);
            return (0, eventEmmitter_1.sendToRoomEmmiter)(data);
        }
    }
    catch (error) {
        console.log("Winner Error:", error);
        logger_1.logger.error("Winner Error:", error);
    }
});
exports.declareWinner = declareWinner;
const deleteTable = (tableId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield tableModel_1.Table.findByIdAndDelete(tableId);
    }
    catch (error) {
        console.log("winner Delete Table Error", error);
        logger_1.logger.error("winner Delete Table Error", error);
    }
});
