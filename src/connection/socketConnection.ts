import { eventHandler } from '../eventHandler';
import { io } from '../index'
import { Socket } from "socket.io";
import { logger } from '../logger';
import { disconnect } from '../playing/disconnect';

const socketConnection = () => {
    try {
        io.on('connection', async (socket: Socket) => {
            logger.info(`SocketId is:::: ${socket.id}`);
            await eventHandler(socket)

            socket.on("disconnect", () => {
                disconnect(socket);
            });
        })
    } catch (error) {
        logger.error(`CATCH_ERROR socketConnection :: ${error}`);
    }
}

export { socketConnection }