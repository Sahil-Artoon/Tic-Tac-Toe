import { Socket } from "socket.io"
import { logger } from "../logger"
import { User } from "../model/userModel"
import { Table } from "../model/tableModel"

const disconnect = async (socket: any) => {
    try {
        const getCurrentUser = await User.findOne({ socketId: socket.id })
        if (getCurrentUser) {
            await User.findOneAndUpdate(
                { socketId: socket.id },
                { socketId: '', tableId: '' }
            )
        }
        const checkTable = await Table.find({ activePlayer: 0 })
        if (checkTable) {
            checkTable.map(async (item) => {
                await Table.findByIdAndDelete({ _id: item._id })
            })
        }
    } catch (error) {
        logger.error(`CATCH_ERROR  disconnect :: ${error}`);
    }
}

export { disconnect }