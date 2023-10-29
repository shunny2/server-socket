import { serverHttp } from "./http";
import { config } from "./config";

import mongoose, { connect } from "mongoose";

import "./websocket";

import Logging from "./lib/logging";

const PORT = config.server.port;
const MONGO_URI = config.mongo.uri;

mongoose.set("strictQuery", true);

const main = async () => {
    await connect(`${MONGO_URI}`);
    Logging.info("[DATABASE]: You are connected to MongoDB!");
}

main().catch(err => Logging.error(err));

serverHttp.listen(PORT, () => Logging.info(`[SERVER]: Server is runing on port ${PORT}`));