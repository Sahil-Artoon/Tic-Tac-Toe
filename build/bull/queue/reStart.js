"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reStart = void 0;
const bull_1 = __importDefault(require("bull"));
const logger_1 = require("../../logger");
const redisConnection_1 = require("../../connection/redisConnection");
const queueConstant_1 = require("../../constant/queueConstant");
const eventName_1 = require("../../constant/eventName");
const eventEmmitter_1 = require("../../eventEmmitter");
const reStart = (data) => {
    try {
        let reStartQueue = new bull_1.default(queueConstant_1.QUEUE_EVENT.RE_START, redisConnection_1.redisOption);
        let options = {
            jobId: data._id,
            delay: data.timer,
            attempts: 1
        };
        reStartQueue.add(data, options);
        reStartQueue.process((data) => {
            data = {
                eventName: eventName_1.EVENT_NAME.RE_START,
                data: {
                    _id: data.data._id.toString()
                }
            };
            (0, eventEmmitter_1.sendToRoomEmmiter)(data);
        });
    }
    catch (error) {
        console.log("Queue RoundTimer Error :::", error);
        logger_1.logger.error("Queue RoundTimer Error :::", error);
    }
};
exports.reStart = reStart;
