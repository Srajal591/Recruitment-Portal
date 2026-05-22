import { io } from "socket.io-client";
import {
  REALTIME_SOCKET_URLS,
  SERVICE_SOCKET_URLS,
  STORAGE_KEYS,
} from "../api/config";

const SOCKET_EVENTS = [
  "dashboard:stats:update",
  "dashboard:funnel:update",
  "application:submitted",
  "application:status:changed",
  "application:autosaved",
  "admin:application:new",
  "document:verified",
  "document:rejected",
  "payment:success",
  "payment:failed",
  "job:published",
  "job:closed",
  "support:ticket:created",
  "support:ticket:reply",
  "support:ticket:resolved",
  "notification:new",
  "admin:live:count",
];

const uniqueUrls = (urls) => [...new Set(urls.filter(Boolean))];

export const getRealtimeToken = () =>
  localStorage.getItem(STORAGE_KEYS.accessToken);

export const getRealtimeSocketUrls = () => {
  if (REALTIME_SOCKET_URLS.length > 0) {
    return REALTIME_SOCKET_URLS;
  }

  return uniqueUrls(Object.values(SERVICE_SOCKET_URLS));
};

export const createRealtimeSockets = ({ onEvent, onStatusChange }) => {
  const token = getRealtimeToken();

  const sockets = getRealtimeSocketUrls().map((url) => {
    const socket = io(url, {
      auth: token ? { token } : {},
      withCredentials: true,
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 500,
      reconnectionDelayMax: 5000,
      timeout: 10000,
    });

    socket.on("connect", () => {
      onStatusChange?.({ url, connected: true, socketId: socket.id });
    });

    socket.on("disconnect", (reason) => {
      onStatusChange?.({ url, connected: false, reason });
    });

    socket.on("connect_error", (error) => {
      onStatusChange?.({ url, connected: false, reason: error.message });
    });

    SOCKET_EVENTS.forEach((eventName) => {
      socket.on(eventName, (payload) => {
        onEvent?.({ eventName, payload, source: url });
      });
    });

    return socket;
  });

  return () => {
    sockets.forEach((socket) => {
      SOCKET_EVENTS.forEach((eventName) => socket.off(eventName));
      socket.disconnect();
    });
  };
};
