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
const changeTurn = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logger_1.logger.info(`CHANGE_TURN DATA :::: ${JSON.stringify(data)}`);
        let findTable = yield tableModel_1.Table.findById(data.tableId);
        if (findTable) {
            if (findTable.currentTurnSeatIndex == "0") {
                let updateTable = yield tableModel_1.Table.findByIdAndUpdate(findTable._id, {
                    currentTurnSeatIndex: "1",
                    currentTurnUserId: findTable.playerInfo[1].userId
                }, { new: true });
                data = {
                    eventName: eventName_1.EVENT_NAME.CHANGE_TURN,
                    data: {
                        _id: updateTable === null || updateTable === void 0 ? void 0 : updateTable._id.toString(),
                        data: updateTable === null || updateTable === void 0 ? void 0 : updateTable.playerInfo[1],
                        userId: updateTable === null || updateTable === void 0 ? void 0 : updateTable.playerInfo[1].userId,
                        symbol: updateTable === null || updateTable === void 0 ? void 0 : updateTable.playerInfo[1].symbol
                    }
                };
                return (0, eventEmmitter_1.sendToRoomEmmiter)(data);
            }
            if (findTable.currentTurnSeatIndex == "1") {
                let updateTable = yield tableModel_1.Table.findByIdAndUpdate(findTable._id, {
                    currentTurnSeatIndex: "0",
                    currentTurnUserId: findTable.playerInfo[0].userId
                }, { new: true });
                data = {
                    eventName: eventName_1.EVENT_NAME.CHANGE_TURN,
                    data: {
                        _id: updateTable === null || updateTable === void 0 ? void 0 : updateTable._id.toString(),
                        data: updateTable === null || updateTable === void 0 ? void 0 : updateTable.playerInfo[0],
                        userId: updateTable === null || updateTable === void 0 ? void 0 : updateTable.playerInfo[0].userId,
                        symbol: updateTable === null || updateTable === void 0 ? void 0 : updateTable.playerInfo[0].symbol
                    }
                };
                return (0, eventEmmitter_1.sendToRoomEmmiter)(data);
            }
        }
    }
    catch (error) {
        logger_1.logger.error(`CHANGE_TURN ERROR :::: ${error}`);
    }
});
exports.changeTurn = changeTurn;
