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
exports.joinGame = void 0;
const logger_1 = require("../logger");
const tableModel_1 = require("../model/tableModel");
const userModel_1 = require("../model/userModel");
const eventName_1 = require("../constant/eventName");
const eventEmmitter_1 = require("../eventEmmitter");
const roundTimer_1 = require("../bull/queue/roundTimer");
const joinGame = (data, socket) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logger_1.logger.info(`socket id Is::: ${socket.id} and data is::: ${JSON.stringify(data)}`);
        let { userId } = data;
        if (!userId)
            return logger_1.logger.error(`can't Get UserId In Join Table`);
        let findUser = yield userModel_1.User.findById(userId);
        if (!findUser)
            return logger_1.logger.error(`can't Find User By UserId`);
        // logger.info(`FindUser ::::::${findUser}`)
        let checkTable = yield tableModel_1.Table.findOne({ activePlayer: { $lte: 1 } });
        if (checkTable) {
            let updateTable = yield tableModel_1.Table.findByIdAndUpdate({ _id: checkTable._id }, {
                $push: {
                    playerInfo: {
                        userId: findUser._id,
                        userName: findUser.userName,
                        isActive: true,
                        symbol: "O"
                    }
                },
                activePlayer: 2,
                gameStatus: "WATING"
            }, { new: true });
            if (updateTable) {
                const newTable = yield tableModel_1.Table.findById(updateTable._id);
                if (newTable) {
                    data = {
                        eventName: eventName_1.EVENT_NAME.JOIN_TABLE,
                        data: {
                            data: newTable,
                            message: "ok",
                            status: "waiting"
                        },
                        socket
                    };
                    (0, eventEmmitter_1.sendToSocketIdEmmiter)(data);
                }
                yield tableModel_1.Table.updateOne({ _id: updateTable._id }, { gameStatus: "ROUND_TIMER_START" });
                const currentTable = yield tableModel_1.Table.findById(updateTable._id);
                if (currentTable) {
                    socket.join(currentTable._id.toString());
                    data = {
                        eventName: eventName_1.EVENT_NAME.ROUND_TIMER,
                        data: {
                            _id: currentTable._id.toString(),
                            data: currentTable,
                            message: "ok",
                            roundTimer: 10
                        },
                        socket
                    };
                    (0, eventEmmitter_1.sendToRoomEmmiter)(data);
                    data = {
                        tableId: updateTable._id,
                        time: 10000
                    };
                    yield (0, roundTimer_1.roundTimer)(data);
                    // await setTimeout(() => {
                    //     checkTurn({
                    //         tableId: updateTable._id
                    //     })
                    // }, 11000);
                }
            }
        }
        else {
            let generateTable = yield tableModel_1.Table.create({
                playerInfo: [{
                        userId: findUser._id,
                        userName: findUser.userName,
                        isActive: true,
                        symbol: "X"
                    }],
                playingData: [
                    { userId: "", symbol: "" },
                    { userId: "", symbol: "" },
                    { userId: "", symbol: "" },
                    { userId: "", symbol: "" },
                    { userId: "", symbol: "" },
                    { userId: "", symbol: "" },
                    { userId: "", symbol: "" },
                    { userId: "", symbol: "" },
                    { userId: "", symbol: "" },
                ],
                activePlayer: 1,
                gameStatus: "WATING",
                currentTurnSeatIndex: "",
                currentTurnUserId: ""
            });
            if (generateTable) {
                data = {
                    eventName: eventName_1.EVENT_NAME.JOIN_TABLE,
                    data: {
                        data: generateTable,
                        message: "ok",
                        status: "Waiting"
                    },
                    socket
                };
                socket.join(generateTable._id.toString());
                return (0, eventEmmitter_1.sendToSocketIdEmmiter)(data);
            }
        }
    }
    catch (error) {
        console.log(error);
        logger_1.logger.error(`Join Game Error: ${error}`);
    }
});
exports.joinGame = joinGame;
