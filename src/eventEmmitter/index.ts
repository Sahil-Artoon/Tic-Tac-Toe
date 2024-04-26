import { Socket } from "socket.io";
import { logger } from "../logger";
import { EVENT_NAME } from "../constant/eventName";
import { io } from "..";

const sendToSocketIdEmmiter = (data: any) => {
    try {
        logger.info(`socketId is:::${data.socket.id} and Data.Data is This is: ${JSON.stringify(data.data)}`)
        io.to(data.socket.id).emit(data.eventName, data.data)
    } catch (error) {
        console.log("sendToSocketIdEmmiter ::::", error)
        logger.error(`sendToSocketIdEmmiter Error: ${error}`)
    }
}

const sendToRoomEmmiter = (data: any) => {
    try {
        logger.info(`room is:::${data.data._id} and Data.Data is This is: ${JSON.stringify(data.data)}`)
        io.to(data.data._id).emit(data.eventName, data.data)
    } catch (error) {
        console.log("sendToRoomEmmiter ::::", error)
        logger.error(`sendToRoomEmmiter Error: ${error}`)
    }
}

export {
    sendToSocketIdEmmiter, sendToRoomEmmiter
}