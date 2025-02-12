import { Server } from "socket.io";

let io;
let lookUps = new Map()

const webSocket = (server) => {
    io = new Server(server, { cors: { origin: "*" } });

    io.on("connection", (socket) => {
        console.log("User connected:", socket.id);

        socket.on("join", (data) => {
            if (data?.userId) {
                let userSockets = lookUps.get(data.userId);
                if (!userSockets) {
                    userSockets = [];
                }
                if(!userSockets.includes(socket.id)){
                    userSockets.push(socket.id);
                }
                lookUps.set(data.userId, userSockets);
                // console.log(lookUps)
                socket.join(data.userId);
                console.log(`User ${data.userId} joined room`);
            }
        });

        socket.on("disconnect", () => {
            console.log("User disconnected:", socket.id);
            const userId = socket.userId;

            if (userId && lookUps.has(userId)) {
                let sockets = lookUps.get(userId);
                sockets = sockets.filter(socketId => socketId !== socket.id);

                if (sockets.length > 0) {
                    lookUps.set(userId, sockets);
                } else {
                    lookUps.delete(userId);
                }

                socket.leave(userId);
                console.log(`User ${userId} left room`);
            }

        });
    });
}

export { io, lookUps, webSocket };