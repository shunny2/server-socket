import { io } from "./http";

import { IUserModel, User } from "./models/User";
import { Message } from "./models/Message";

import Logging from "./lib/logging";

const EVENTS = {
    connection: "connection",
};

io.on(EVENTS.connection, socket => {
    Logging.info(`[IO]: Connection => Server has a new connection.`);
    Logging.info(`[IO]: Connection => User ${socket.id} has connected to the server!`);

    socket.on("user", async (data: IUserModel) => {
        console.log("[SOCKET]: User =>", data);

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
                    socket.emit("user", user.id);
            })
            .catch(err => Logging.error(err));
    });

    socket.on("chat.message", async (data: any) => {
        console.log("[SOCKET]: Chat.message =>", data);

        await User.findOne({ name: data.name })
            .then(async (user) => {
                if (user)
                    await Message.create({ uid: data.uid, text: data.text, user: user.id })
                        .then((newMessage) => io.emit("chat.message", newMessage))
                        .catch(err => Logging.error(err));
            })
            .catch(err => Logging.error(err));
    });

    // Send all messages
    Message.find()
        .then((messages) => io.emit("chat.all.messages", messages))
        .catch(err => Logging.error(err));

    socket.on("disconnect", () => {
        Logging.info("[SOCKET]: Disconnect => A connection was disconnected");
        Logging.info(`[SOCKET]: Disconnect => User ${socket.id} has disconnected from the server!`);
    })
});