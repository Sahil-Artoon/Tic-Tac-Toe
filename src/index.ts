import express from 'express'
import path from 'path'
import http from 'http';
import { Server } from "socket.io";
import { logger } from './logger';
import dotenv from 'dotenv';
import { socketConnection } from './connection/socketConnection';
import { connectDb } from './connection/dbConnection';
import {  connectRedis } from './connection/redisConnection';
dotenv.config({ path: './.env' });

const app = express()
const server = http.createServer(app);
const io = new Server(server);
socketConnection();
connectDb();
connectRedis()

app.use(express.json())
app.use(express.static(path.join(__dirname, '../public')))

app.get('/', async (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'))

})
const port = process.env.PORT
server.listen(port, async () => {
  logger.info(`server listening on port http://localhost:${port}   `)
})

export { io }

try {
  process
    .on("unhandledRejection", (response, p) => {
      console.error("unhandledRejection", response);
      console.error("unhandledRejection", p);
      logger.error("unhandledRejection", response);
      logger.error("unhandledRejection", p);
    })
    .on("uncaughtException", (err) => {
      console.error("uncaughtException", err);
      logger.error("uncaughtException", err);
    });
} catch (error) {
  console.error(error);
  logger.error("uncaughtException", error);
}