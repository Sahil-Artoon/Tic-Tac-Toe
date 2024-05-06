"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.REDIS = void 0;
const REDIS = {
    OPTION: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
    }
};
exports.REDIS = REDIS;
