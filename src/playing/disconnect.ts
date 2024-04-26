import { Socket } from "socket.io"
import { logger } from "../logger"
import { User } from "../model/userModel"
import { Table } from "../model/tableModel"

const disconnect = async (socket: Socket) => {
    try {
        const getCurrentUser = await User.findOne({ socketId: socket.id })
        if (getCurrentUser) {
            const updateUserSocketId = await User.findOneAndUpdate(
                { socketId: socket.id },
                { socketId: '' }
            )
            logger.info("Update SocketId successfully At Disconnect Time !!!")
        }
        const findInTable = await Table.findOne({ "playerInfo.socketId": socket.id })
        if (findInTable) {
            if (findInTable.gameStatus != 'Winner' && findInTable.gameStatus != 'Tie') {
                const updateTable = await Table.findByIdAndUpdate({ _id: findInTable._id }, {
                    $pull: { playerInfo: { socketId: socket.id } },
                    $inc: { activePlayer: -1 }
                })
                logger.info("Update Table successfully At Disconnect Time");
            }
        }
        const checkTable = await Table.find({ activePlayer: 0 })
        if (checkTable) {
            checkTable.map(async (item) => {
                await Table.findByIdAndDelete({ _id: item._id })
            })
            logger.info("Delete Table successfully when active user is zero in table");
        }
    } catch (error) {
        logger.error(`Socket Disconnect Error ${error}`)
    }
}

export { disconnect }