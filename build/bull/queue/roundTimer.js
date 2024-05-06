"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.roundTimer = void 0;
const bull_1 = __importDefault(require("bull"));
const logger_1 = require("../../logger");
const redisConnection_1 = require("../../connection/redisConnection");
const checkTurn_1 = require("../../playing/checkTurn");
const queueConstant_1 = require("../../constant/queueConstant");
const roundTimer = (data) => {
    try {
        const roundTimerQueue = new bull_1.default(queueConstant_1.QUEUE_EVENT.ROUND_TIMER, redisConnection_1.redisOption);
        let options = {
            tableId: data.tableId.toString(),
            delay: data.time,
            attempts: 1
        };
        roundTimerQueue.add(data, options);
        roundTimerQueue.process((data) => {
            logger_1.logger.error("This is RoundTimerQueue");
            data = {
                tableId: data.tableId
            };
            logger_1.logger.info("This is CheckTurn data", data);
            (0, checkTurn_1.checkTurn)(data);
        });
    }
    catch (error) {
        console.log("Queue RoundTimer Error :::", error);
        logger_1.logger.error("Queue RoundTimer Error :::", error);
    }
};
exports.roundTimer = roundTimer;
