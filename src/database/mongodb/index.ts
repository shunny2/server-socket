import mongoose, { connect } from "mongoose";

import { config } from "../../config";

import Logging from "../../lib/logging";

const MONGO_URI = config.mongo.uri;

mongoose.set("strictQuery", true);

const main = async () => {
    await connect(`${MONGO_URI}`);
    Logging.info("[DATABASE]: You are connected to MongoDB!");
}

main().catch(err => Logging.error(err));

export const database = { mongoose };