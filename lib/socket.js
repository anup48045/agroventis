import { Server } from "socket.io";

let io;

export function initSocket(server) {
  if (!io) {
    io = new Server(server, {
      cors: {
        origin: "*",
      },
    });

    io.on("connection", (socket) => {
      console.log("User connected:", socket.id);

      // Join user room
      socket.on("join", (userId) => {
        socket.join(userId);
      });

      // Join connection room (chat room)
      socket.on("join_connection", (connectionId) => {
        socket.join(connectionId);
      });

      // Handle sending message
      socket.on("send_message", (data) => {
        const { connectionId } = data;

        // Emit to all users in that connection
        io.to(connectionId).emit("receive_message", data);
      });

      socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
      });
    });
  }

  return io;
}