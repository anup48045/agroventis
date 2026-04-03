import { Server } from "socket.io";
import http from "http";

const server = http.createServer();

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000"], // add your Vercel URL later
  },
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join_connection", (connectionId) => {
    socket.join(connectionId);
    console.log(`User ${socket.id} joined ${connectionId}`);
  });

  socket.on("send_message", (data) => {
    try {
      console.log("Message:", data);
      io.to(data.connectionId).emit("receive_message", data);
    } catch (err) {
      console.error("Error sending message:", err);
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Socket server running on port ${PORT}`);
});