import express from "express";
import http from "http";
import cors from "cors";

import { Server } from "socket.io";

const app = express();

const serverHttp = http.createServer(app);
const io = new Server(serverHttp);

// Cross Origin Resource Sharing
app.use(cors({ origin: 'http://localhost:3000' }));

export { serverHttp, io };