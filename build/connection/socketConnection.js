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
exports.socketConnection = void 0;
const eventHamdler_js_1 = require("../eventHandler/eventHamdler.js");
const index_js_1 = require("../index.js");
const logger_js_1 = require("../logger/logger.js");
const socketConnection = () => {
    try {
        index_js_1.io.on('connection', (socket) => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, eventHamdler_js_1.eventHandler)(socket);
        }));
    }
    catch (error) {
        logger_js_1.logger.error("error of socket connection :::", error);
    }
};
exports.socketConnection = socketConnection;
