import { Server } from "socket.io";

export default function handler(req, res) {
  if (!res.socket.server.io) {
    console.log("Initializing Socket.io...");

    const io = new Server(res.socket.server);

    res.socket.server.io = io;

    io.on("connection", (socket) => {
      console.log("Socket connected:", socket.id);

      socket.on("join", (userId) => {
        socket.join(userId);
      });

      socket.on("join_connection", (connectionId) => {
        socket.join(connectionId);
      });

      socket.on("send_message", (data) => {
        io.to(data.connectionId).emit("receive_message", data);
      });

      socket.on("disconnect", () => {
        console.log("Socket disconnected:", socket.id);
      });
    });
  }

  res.end();
}