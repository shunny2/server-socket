import dotenv from "dotenv";

dotenv.config();

const MONGO_USERNAME = process.env.MONGO_USERNAME || "";
const MONGO_PASSWORD = process.env.MONGO_PASSWORD || "";
const MONGO_DATABASE = process.env.MONGO_DATABASE || "";
const MONGO_URI = `mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_DATABASE}.iku7e6u.mongodb.net/test`;

const PORT = process.env.PORT || 3335;

const IO_CORS_ORIGIN = "http://localhost:3000";

const EVENTS = {
    connection: "connection",
    disconnect: "disconnect",
    user: "user",
    message: "chat.message",
    allMessages: "chat.all.messages"
};

export const config = {
    mongo: {
        uri: MONGO_URI
    },
    server: {
        port: PORT
    },
    socket: {
        io: {
            origin: IO_CORS_ORIGIN
        },
        events: EVENTS
    }
}