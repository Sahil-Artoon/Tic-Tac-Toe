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
exports.getJob = void 0;
const bull_1 = __importDefault(require("bull"));
const queueConstant_1 = require("../../constant/queueConstant");
const redisConnection_1 = require("../../connection/redisConnection");
const queue = new bull_1.default(queueConstant_1.QUEUE_EVENT.ROUND_TIMER, redisConnection_1.redisOption);
const getJob = (jobId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const job = yield queue.getJob(jobId);
        if (job) {
            const currentTime = Date.now();
            const enqueueTime = job.timestamp;
            const timestramptime = currentTime - enqueueTime;
            let timePassed = Math.floor(timestramptime / 1000);
            let penddingTime = job.data.time - (timePassed * 1000);
            return penddingTime;
        }
    }
    catch (error) {
        console.error('Error getting job:', error);
    }
});
exports.getJob = getJob;
