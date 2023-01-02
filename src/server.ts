import dotenv from "dotenv";

import "./websocket";

import { serverHttp } from "./http";

dotenv.config();

const PORT = process.env.PORT || 3335;

serverHttp.listen(PORT, () => console.log(`[server]: Server is runing on port ${PORT}`));