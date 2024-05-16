import { Socket } from "socket.io"
import { logger } from "../logger"
import { Table } from "../model/tableModel"
import { User } from "../model/userModel"
import { EVENT_NAME } from "../constant/eventName"
import { sendToRoomEmmiter, sendToSocketIdEmmiter } from "../eventEmmitter"
import { set } from "mongoose"
import { changeTurn } from "./changeTurn"
import { checkTurn } from "./checkTurn"
import { roundTimer } from "../bull/queue/roundTimer"
import { validateJoinTable } from "../validation/joinTableValidation"
import { leaveButton } from "../bull/queue/leaveButton"

const joinGame = async (data: any, socket: Socket) => {
    try {
        logger.info(`JOIN_TABLE EVENT DATA IS :::: ${JSON.stringify(data)}`)
        let { userId } = data
        const checkData = await validateJoinTable(data)
        if (checkData.error) {
            data = {
                eventName: EVENT_NAME.POP_UP,
                data: {
                    message: checkData.error?.details[0].message
                },
                socket
            }
            return sendToSocketIdEmmiter(data);
        }

        let findUser = await User.findById(userId)
        if (!findUser) {
            data = {
                eventName: EVENT_NAME.POP_UP,
                data: {
                    message: "Can't found User by Id"
                },
                socket
            }
            return sendToSocketIdEmmiter(data);
        }

        let checkTable = await Table.findOne({ activePlayer: { $lte: 1 } })
        if (checkTable) {
            if (findUser.tableId == checkTable._id.toString()) {
                data = {
                    eventName: EVENT_NAME.POP_UP,
                    data: {
                        message: "User Already in Table !!!",
                        return: true
                    },
                    socket
                }
                return sendToSocketIdEmmiter(data);
            }
            let symbol;
            if (checkTable.playerInfo[0].symbol == "X") {
                symbol = "O"
            } else {
                symbol = "X"
            }
            let updateTable = await Table.findByIdAndUpdate({ _id: checkTable._id }, {
                $push: {
                    playerInfo: {
                        userId: findUser._id,
                        userName: findUser.userName,
                        isActive: true,
                        symbol: symbol,
                        turnMiss: 0
                    }
                },
                activePlayer: 2,
                gameStatus: "WATING"
            }, { new: true })
            await User.findByIdAndUpdate(findUser._id, { $set: { tableId: checkTable._id.toString() } });
            if (updateTable) {
                const newTable = await Table.findById(updateTable._id)
                if (newTable) {
                    data = {
                        eventName: EVENT_NAME.JOIN_TABLE,
                        data: {
                            data: newTable,
                            message: "ok",
                            status: "waiting"
                        },
                        socket
                    }
                    sendToSocketIdEmmiter(data)
                }
                await Table.updateOne({ _id: updateTable._id }, { gameStatus: "ROUND_TIMER_START" })
                const currentTable = await Table.findById(updateTable._id)
                if (currentTable) {
                    socket.join(currentTable._id.toString())
                    data = {
                        eventName: EVENT_NAME.ROUND_TIMER,
                        data: {
                            _id: currentTable._id.toString(),
                            data: currentTable,
                            message: "ok",
                            roundTimer: 10
                        },
                        socket
                    }
                    sendToRoomEmmiter(data)
                    data = {
                        tableId: updateTable._id,
                        time: 6000
                    }
                    leaveButton(data)
                    data = {
                        tableId: updateTable._id,
                        time: 10000
                    }
                    await roundTimer(data)
                }
            }
        } else {
            let generateTable = await Table.create({
                playerInfo: [{
                    userId: findUser._id,
                    userName: findUser.userName,
                    isActive: true,
                    symbol: "X",
                    turnMiss: 0
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
                currentTurnSeatIndex: null,
                currentTurnUserId: null
            })
            await User.findByIdAndUpdate(generateTable.playerInfo[0].userId, { $set: { tableId: generateTable._id.toString() } });
            if (generateTable) {
                data = {
                    eventName: EVENT_NAME.JOIN_TABLE,
                    data: {
                        data: generateTable,
                        message: "ok",
                        status: "Waiting"
                    },
                    socket
                }
                socket.join(generateTable._id.toString())
                return sendToSocketIdEmmiter(data)
            }
        }
    } catch (error) {
        logger.error(`JOIN_TABLE ERROR :::: ${error}`)
    }
}

export { joinGame }