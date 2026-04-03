/*import { Server } from "socket.io";
import http from "http";

const server = http.createServer(); 
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});*/


import { Server } from "socket.io";
import http from "http";

const server = http.createServer();

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join_connection", (connectionId) => {
    socket.join(connectionId);
    console.log(`Joined room: ${connectionId}`);
  });

  socket.on("send_message", (data) => {
    console.log("Message received:", data);
    io.to(data.connectionId).emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// 🔥 IMPORTANT CHANGE
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

/* default function handler(req, res) {
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
}*/