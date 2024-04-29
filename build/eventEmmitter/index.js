"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendToRoomEmmiter = exports.sendToSocketIdEmmiter = void 0;
const logger_1 = require("../logger");
const __1 = require("..");
const sendToSocketIdEmmiter = (data) => {
    try {
        logger_1.logger.info(`socketId is:::${data.socket.id} and Data.Data is This is: ${JSON.stringify(data.data)}`);
        __1.io.to(data.socket.id).emit(data.eventName, data.data);
    }
    catch (error) {
        console.log("sendToSocketIdEmmiter ::::", error);
        logger_1.logger.error(`sendToSocketIdEmmiter Error: ${error}`);
    }
};
exports.sendToSocketIdEmmiter = sendToSocketIdEmmiter;
const sendToRoomEmmiter = (data) => {
    try {
        logger_1.logger.info(`room is:::${data.data._id} and Data.Data is This is: ${JSON.stringify(data.data)}`);
        __1.io.to(data.data._id).emit(data.eventName, data.data);
    }
    catch (error) {
        console.log("sendToRoomEmmiter ::::", error);
        logger_1.logger.error(`sendToRoomEmmiter Error: ${error}`);
    }
};
exports.sendToRoomEmmiter = sendToRoomEmmiter;
