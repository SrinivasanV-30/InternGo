import { Server } from "socket.io";

let io;
let lookUps={}

const webSocket=(server)=>{
    io = new Server(server, { cors: { origin: "*" } });

    io.on("connection", (socket) => {
        console.log("User connected:", socket.id);

        socket.on("join", (data) => {
            if(data?.userId){
                socket.userId=data.userId;
                lookUps[data.userId]=socket.id;
                socket.join(data.userId);
                console.log(`User ${data.userId} joined room`);
            }
        });

        socket.on("disconnect", () => {
            console.log("User disconnected:", socket.id);
            const userId = socket.userId;
            delete lookUps[userId];
            if (userId) {
                socket.leave(userId);
                console.log(`User ${userId} left room`);
            }
        });
    });
}

export {io,lookUps,webSocket};