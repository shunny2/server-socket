import { io } from "./http";

interface User {
    socketId: string;
    name: string;
}

interface Message {
    uid: string;
    text: string;
    createdAt: Date;
    name: string;
}

const users: User[] = [];
const messages: Message[] = [];

io.on("connection", socket => {
    console.log("[IO]: Connection => Server has a new connection");

    socket.on("user", data => {
        console.log("[SOCKET]: User =>", data);

        const user = users.find(user => user.name === data.name);

        // If there is already a user I just change his socket id.
        if (user)
            user.socketId = socket.id;
        else
            users.push({
                name: data.name,
                socketId: socket.id
            })
    });

    socket.on("chat.message", data => {
        console.log("[SOCKET]: Chat.message =>", data);

        const message: Message = {
            uid: data.uid,
            name: data.name,
            text: data.text,
            createdAt: new Date()
        }

        messages.push(message);

        console.log(messages);

        io.emit("chat.message", message);
    });

    socket.on("disconnect", () => {
        console.log("[SOCKET]: Disconnect => A connection was disconnected");
    })
});