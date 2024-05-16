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
exports.cancleTurnTimerJob = void 0;
const bull_1 = __importDefault(require("bull"));
const queueConstant_1 = require("../../constant/queueConstant");
const redisConnection_1 = require("../../connection/redisConnection");
const logger_1 = require("../../logger");
const cancleTurnTimerJob = (jobId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const queue = new bull_1.default(queueConstant_1.QUEUE_EVENT.TURN_TIMER, redisConnection_1.redisOption);
        const job = yield queue.getJob(jobId);
        if (job) {
            yield (job === null || job === void 0 ? void 0 : job.remove());
            return true;
        }
        return false;
    }
    catch (error) {
        logger_1.logger.error("ROUND_TIMER CANCLE QUEUE ERROR :::: ", error);
    }
});
exports.cancleTurnTimerJob = cancleTurnTimerJob;
