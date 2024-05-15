import { logger } from "../logger";
import { io } from "..";

const sendToSocketIdEmmiter = (data: any) => {
    try {
        logger.info(`Event Name is:::${data.eventName} and Data is This is: ${JSON.stringify(data.data)}`)
        io.to(data.socket.id).emit(data.eventName, data.data)
    } catch (error) {
        logger.error(`sendToSocketIdEmmiter Error: ${error}`)
    }
}

const sendToRoomEmmiter = (data: any) => {
    try {
        logger.info(`EventName is This:::${data.eventName} and Data is This is: ${JSON.stringify(data.data)}`)
        io.to(data.data._id).emit(data.eventName, data.data)
    } catch (error) {
        logger.error(`sendToRoomEmmiter Error: ${error}`)
    }
}

export {
    sendToSocketIdEmmiter, sendToRoomEmmiter
}