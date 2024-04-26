"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = void 0;
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
const socket_io_1 = require("socket.io");
const logger_1 = require("./logger/logger");
const server = require("http").createServer();
const io = new socket_io_1.Server(server);
exports.io = io;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
app.use(express_1.default.json());
app.use(express_1.default.static(path_1.default.join(__dirname, '../public')));
app.get('/', (req, res) => {
    res.sendFile(path_1.default.join(__dirname, '../public/index.html'));
});
const port = process.env.PORT || 7000;
server.listen(port, () => {
    logger_1.logger.info(`server listening on port http://localhost:${port}/`);
});
