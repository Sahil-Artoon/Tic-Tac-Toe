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
exports.disconnect = void 0;
const logger_1 = require("../logger");
const userModel_1 = require("../model/userModel");
const tableModel_1 = require("../model/tableModel");
const disconnect = (socket) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const getCurrentUser = yield userModel_1.User.findOne({ socketId: socket.id });
        if (getCurrentUser) {
            const updateUserSocketId = yield userModel_1.User.findOneAndUpdate({ socketId: socket.id }, { socketId: '' });
            logger_1.logger.info("Update SocketId successfully At Disconnect Time !!!");
        }
        const findInTable = yield tableModel_1.Table.findOne({ "playerInfo.socketId": socket.id });
        if (findInTable) {
            if (findInTable.gameStatus != 'WINNER' && findInTable.gameStatus != 'TIE') {
                const updateTable = yield tableModel_1.Table.findByIdAndUpdate({ _id: findInTable._id }, {
                    $pull: { playerInfo: { socketId: socket.id } },
                    $inc: { activePlayer: -1 }
                });
                logger_1.logger.info("Update Table successfully At Disconnect Time");
            }
        }
        const checkTable = yield tableModel_1.Table.find({ activePlayer: 0 });
        if (checkTable) {
            checkTable.map((item) => __awaiter(void 0, void 0, void 0, function* () {
                yield tableModel_1.Table.findByIdAndDelete({ _id: item._id });
            }));
            logger_1.logger.info("Delete Table successfully when active user is zero in table");
        }
    }
    catch (error) {
        logger_1.logger.error(`Socket Disconnect Error ${error}`);
    }
});
exports.disconnect = disconnect;
