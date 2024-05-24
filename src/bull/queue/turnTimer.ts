import Queue from "bull"
import { QUEUE_EVENT } from "../../constant/queueConstant";
import { redisOption } from "../../connection/redisConnection";
import { Table } from "../../model/tableModel";
import { sendToRoomEmmiter } from "../../eventEmmitter";
import { logger } from "../../logger";
import { changeTurn } from "../../playing/changeTurn";
import { log } from "winston";

const turnTimer = async (data: any, socket: any) => {
    try {
        console.log("THis is TuenTimer Data ::::::::::::", data)
        const tableId: any = data.tableId
        let roundTimerQueue = new Queue(QUEUE_EVENT.TURN_TIMER, redisOption);
        let options = {
            jobId: data.tableId,
            delay: data.time,
            attempts: 1
        }
        roundTimerQueue.add(data, options)
        roundTimerQueue.process(async (data: any) => {
            console.log("::::: This is inSide TurnTimer Process ::::")
            changeTurn({ tableId: data.data.tableId, play: false }, socket)
        })
    } catch (error) {
        logger.error("ROUND_TIMER QUEUE ERROR :::", error)
    }
}

export { turnTimer }