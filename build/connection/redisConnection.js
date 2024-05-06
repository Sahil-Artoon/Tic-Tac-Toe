"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.redisOption = exports.connectRedis = exports.redis = void 0;
const redis_1 = require("redis");
const logger_1 = require("../logger");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
let redisOption = {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
};
exports.redisOption = redisOption;
const redis = (0, redis_1.createClient)(redisOption);
exports.redis = redis;
const connectRedis = () => {
    try {
        redis.connect();
        redis.on("connect", () => {
            logger_1.logger.info("Redis Connected...");
        });
        redis.on('error', (error) => {
            logger_1.logger.error('Redis connection error:', error);
        });
    }
    catch (error) {
        logger_1.logger.error('Redis connection error:', error);
    }
};
exports.connectRedis = connectRedis;
