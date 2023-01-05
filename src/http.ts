import express from "express";
import http from "http";

import { Server } from "socket.io";

import { config } from "./config";

const app = express();
const ORIGIN = config.socket.io.origin;

const serverHttp = http.createServer(app);
const io = new Server(serverHttp, { cors: { origin: ORIGIN } });

export { serverHttp, io };