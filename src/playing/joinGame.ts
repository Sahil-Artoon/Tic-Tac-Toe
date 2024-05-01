import { Socket } from "socket.io"
import { logger } from "../logger"
import { Table } from "../model/tableModel"
import { User } from "../model/userModel"
import { EVENT_NAME } from "../constant/eventName"
import { sendToRoomEmmiter, sendToSocketIdEmmiter } from "../eventEmmitter"
import { set } from "mongoose"
import { changeTurn } from "./changeTurn"
import { checkTurn } from "./checkTurn"

const joinGame = async (data: any, socket: Socket) => {
    try {
        logger.info(`socket id Is::: ${socket.id} and data is::: ${JSON.stringify(data)}`)
        let { userId } = data
        if (!userId) return logger.error(`can't Get UserId In Join Table`)
        let findUser = await User.findById(userId)
        if (!findUser) return logger.error(`can't Find User By UserId`);
        // logger.info(`FindUser ::::::${findUser}`)

        let checkTable = await Table.findOne({ activePlayer: { $lte: 1 } })
        if (checkTable) {
            let updateTable = await Table.findByIdAndUpdate({ _id: checkTable._id }, {
                $push: {
                    playerInfo: {
                        userId: findUser._id,
                        userName: findUser.userName,
                        socketId: findUser.socketId,
                        isActive: true,
                        symbol: "O"
                    }
                },
                activePlayer: 2,
                gameStatus: "WATING"
            }, { new: true })

            if (updateTable) {
                const newTable = await Table.findById(updateTable._id)
                if (newTable) {
                    data = {
                        eventName: EVENT_NAME.JOIN_TABLE,
                        data: {
                            data: newTable.playerInfo[1],
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

                    await setTimeout(() => {
                        checkTurn({
                            tableId: updateTable._id
                        })
                    }, 11000);
                }
            }
        } else {
            let generateTable = await Table.create({
                playerInfo: [{
                    userId: findUser._id,
                    userName: findUser.userName,
                    socketId: findUser.socketId,
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
            })
            if (generateTable) {
                data = {
                    eventName: EVENT_NAME.JOIN_TABLE,
                    data: {
                        data: generateTable.playerInfo[0],
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
        console.log(error)
        logger.error(`Join Game Error: ${error}`)
    }
}

export { joinGame }