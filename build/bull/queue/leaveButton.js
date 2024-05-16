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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.leaveButton = void 0;
const bull_1 = __importDefault(require("bull"));
const redisConnection_1 = require("../../connection/redisConnection");
const queueConstant_1 = require("../../constant/queueConstant");
const logger_1 = require("../../logger");
const eventEmmitter_1 = require("../../eventEmmitter");
const tableModel_1 = require("../../model/tableModel");
const leaveButton = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tableId = data.tableId;
        let roundTimerQueue = new bull_1.default(queueConstant_1.QUEUE_EVENT.LEAVE_BUTTON, redisConnection_1.redisOption);
        let options = {
            jobId: tableId.toString(),
            delay: data.time,
            attempts: 1
        };
        roundTimerQueue.add(data, options);
        roundTimerQueue.process((data) => __awaiter(void 0, void 0, void 0, function* () {
            let updateTable = yield tableModel_1.Table.findByIdAndUpdate(data.data.tableId, { $set: { gameStatus: "LOCK" } });
            let dataofLeavetable = {
                eventName: "LEAVE_BUTTON",
                data: {
                    _id: data.data.tableId.toString(),
                    message: "ok",
                    updateTable
                }
            };
            (0, eventEmmitter_1.sendToRoomEmmiter)(dataofLeavetable);
        }));
    }
    catch (error) {
        logger_1.logger.error("LEAVE_BUTTTON QUEUE ERROR :::", error);
    }
});
exports.leaveButton = leaveButton;
