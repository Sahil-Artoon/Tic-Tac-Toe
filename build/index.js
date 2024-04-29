"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = void 0;
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const logger_1 = require("./logger");
const dotenv_1 = __importDefault(require("dotenv"));
const socketConnection_1 = require("./connection/socketConnection");
const dbConnection_1 = require("./connection/dbConnection");
dotenv_1.default.config({ path: './.env' });
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server);
exports.io = io;
(0, socketConnection_1.socketConnection)();
(0, dbConnection_1.connectDb)();
app.use(express_1.default.json());
app.use(express_1.default.static(path_1.default.join(__dirname, '../public')));
app.get('/', (req, res) => {
    res.sendFile(path_1.default.join(__dirname, '../public/index.html'));
});
const port = process.env.PORT;
server.listen(port, () => {
    logger_1.logger.info(`server listening on port http://localhost:${port}   `);
});
try {
    process
        .on("unhandledRejection", (response, p) => {
        console.error("unhandledRejection", response);
        console.error("unhandledRejection", p);
        logger_1.logger.error("unhandledRejection", response);
        logger_1.logger.error("unhandledRejection", p);
    })
        .on("uncaughtException", (err) => {
        console.error("uncaughtException", err);
        logger_1.logger.error("uncaughtException", err);
    });
}
catch (error) {
    console.error(error);
    logger_1.logger.error("uncaughtException", error);
}
