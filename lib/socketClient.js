import { io } from "socket.io-client";

let socket;

export const getSocket = () => {
  if (typeof window === "undefined") return null; 

  if (!socket) {
    socket = io("https://agroventis.vercel.app/", {
      transports: ["websocket"],
    });
  }

  return socket;
};