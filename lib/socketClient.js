import { io } from "socket.io-client";

let socket;

export const getSocket = () => {
  if (typeof window === "undefined") return null;

  if (!socket) {
    // Use hardcoded URL for development, fallback to env for production
    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000";
    
    console.log("🔌 Connecting to socket:", socketUrl);
    
    socket = io(socketUrl, {
      transports: ["websocket", "polling"], // Add polling as fallback
      secure: socketUrl.startsWith("https://"), // Auto-detect secure connection
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
      timeout: 20000, // Add timeout
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