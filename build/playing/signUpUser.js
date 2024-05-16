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
exports.signUp = void 0;
const logger_1 = require("../logger");
const eventEmmitter_1 = require("../eventEmmitter");
const userModel_1 = require("../model/userModel");
const eventName_1 = require("../constant/eventName");
const signUpValidation_1 = require("../validation/signUpValidation");
const signUp = (data, socket) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    logger_1.logger.info(`SIGN_UP EVENT DATA :::: ${JSON.stringify(data)}`);
    try {
        let checkData = yield (0, signUpValidation_1.signUpValidation)(data);
        if (checkData.error) {
            data = {
                eventName: eventName_1.EVENT_NAME.POP_UP,
                data: {
                    message: (_a = checkData.error) === null || _a === void 0 ? void 0 : _a.details[0].message
                },
                socket
            };
            return (0, eventEmmitter_1.sendToSocketIdEmmiter)(data);
        }
        let { userName } = data;
        let checkUserIsExistOrNot = yield userModel_1.User.findOne({ userName });
        if (!checkUserIsExistOrNot) {
            let newUser = yield userModel_1.User.create({
                userName,
                socketId: socket.id,
                tableId: ""
            });
            data = {
                eventName: eventName_1.EVENT_NAME.SIGN_UP,
                socket,
                data: {
                    message: "ok",
                    data: newUser
                }
            };
            return (0, eventEmmitter_1.sendToSocketIdEmmiter)(data);
        }
        else {
            let updateUser = yield userModel_1.User.findByIdAndUpdate(checkUserIsExistOrNot._id, { socketId: socket.id });
            data = {
                eventName: eventName_1.EVENT_NAME.SIGN_UP,
                socket,
                data: {
                    message: "ok",
                    data: updateUser
                }
            };
            return (0, eventEmmitter_1.sendToSocketIdEmmiter)(data);
        }
    }
    catch (error) {
        logger_1.logger.error(`SIGN_UP ERROR :::: ${error}`);
    }
});
exports.signUp = signUp;
