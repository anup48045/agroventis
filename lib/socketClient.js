import { io } from "socket.io-client";

let socket;

export const getSocket = () => {
  if (typeof window === "undefined") return null;

  if (!socket) {
    socket = io(process.env.NEXT_PUBLIC_SOCKET_URL, {
      transports: ["websocket"],
      secure: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
    });

    socket.on("connect", () => {
      console.log("Connected:", socket.id);
    });

    socket.on("disconnect", () => {
      console.log("Disconnected");
    });
    
    socket.on("connect_error", (err) => {
      console.error("🚨 Socket error:", err.message);
    });
  }

  return socket;
};