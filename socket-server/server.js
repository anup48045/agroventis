import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);

app.get("/", (req, res) => {
  res.send("Socket server is running");
});

const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:3000",
      process.env.CLIENT_URL || "https://agroventis.vercel.app"
    ],
    methods: ["GET", "POST"]
  },
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join_connection", (connectionId) => {
    socket.join(connectionId);
    console.log(`User ${socket.id} joined ${connectionId}`);
  });

  socket.on("send_message", (data) => {
    if (!data?.connectionId) return;

    console.log("Message:", data);
    io.to(data.connectionId).emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Socket server running on port ${PORT}`);
});