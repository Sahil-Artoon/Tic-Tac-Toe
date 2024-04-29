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
exports.eventHandler = void 0;
const logger_1 = require("../logger");
const eventName_1 = require("../constant/eventName");
const signUpUser_1 = require("../playing/signUpUser");
const joinGame_1 = require("../playing/joinGame");
const playGame_1 = require("../playing/playGame");
const winner_1 = require("../playing/winner");
const checkTurn_1 = require("../playing/checkTurn");
const changeTurn_1 = require("../playing/changeTurn");
const eventHandler = (socket) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        socket.onAny((eventName, data) => {
            logger_1.logger.info(`Event Name is : ${eventName} : Request Data : ${JSON.stringify(data)}`);
            switch (eventName) {
                case eventName_1.EVENT_NAME.SIGN_UP:
                    (0, signUpUser_1.signUp)(data, socket);
                    break;
                case eventName_1.EVENT_NAME.JOIN_TABLE:
                    (0, joinGame_1.joinGame)(data, socket);
                    break;
                case eventName_1.EVENT_NAME.PLAY_GAME:
                    (0, playGame_1.playGame)(data, socket);
                    break;
                case eventName_1.EVENT_NAME.CHANGE_TURN:
                    (0, changeTurn_1.changeTurn)(data, socket);
                    break;
                case eventName_1.EVENT_NAME.CHECK_TURN:
                    (0, checkTurn_1.checkTurn)(data, socket);
                    break;
                case eventName_1.EVENT_NAME.WINNER:
                    (0, winner_1.winner)(data, socket);
                    break;
            }
        });
    }
    catch (error) {
        logger_1.logger.error("eventHandler ::::::::::", error);
    }
});
exports.eventHandler = eventHandler;
