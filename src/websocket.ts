import { io } from "./http";

import { IUserModel, User } from "./models/User";
import { Message } from "./models/Message";

import { config } from "./config";

import Logging from "./lib/logging";

const EVENTS = config.socket.events;

io.on(EVENTS.connection, (socket) => {
    Logging.info(`[IO]: Connection => User ${socket.id} has connected to the server!`);

    socket.on(EVENTS.user, async (data: IUserModel) => {
        await User.findOne({ name: data.name })
            .then(async (user) => {
                // If there is already a user I just change his socket id.
                if (user)
                    user.socketId = socket.id;
                else
                    await User.create({ uuid: data.uuid, name: data.name, socketId: socket.id })
                        .then(() => Logging.success("User successfully registered!"))
                        .catch(err => Logging.error(err));
            })
            .catch(err => Logging.error(err));

        // Searches to find out if the user logged into the external database is the same as the user logged into the socket. If so, I return this user.
        await User.findOne({ uuid: data.uuid })
            .then(async (user) => {
                if (user)
                    socket.emit(EVENTS.user, user.id);
            })
            .catch(err => Logging.error(err));
    });

    // Send user message
    socket.on(EVENTS.message, async (data: any) => {
        await User.findOne({ name: data.name })
            .then(async (user) => {
                if (user)
                    await Message.create({ uid: data.uid, text: data.text, user: user.id })
                        .then((newMessage) => io.emit(EVENTS.message, newMessage))
                        .catch(err => Logging.error(err));
            })
            .catch(err => Logging.error(err));
    });

    // Get all messages
    Message.find()
        .populate("user", "_id name")
        .then((messages) => io.emit(EVENTS.allMessages, messages))
        .catch(err => Logging.error(err));

    // Disconnect event
    socket.on(EVENTS.disconnect, async () => {
        Logging.info(`[SOCKET]: Disconnect => User ${socket.id} has disconnected from the server!`);
    })
});