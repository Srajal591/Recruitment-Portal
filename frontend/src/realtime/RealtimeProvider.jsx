import { useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  createRealtimeSockets,
  getRealtimeSocketUrls,
  getRealtimeToken,
} from "./socketClient";

const INVALIDATION_DELAY_MS = 150;
const TOKEN_CHECK_INTERVAL_MS = 1000;

const useRealtimeTokenVersion = () => {
  const [token, setToken] = useState(() => getRealtimeToken());

  useEffect(() => {
    const syncToken = () => {
      const latestToken = getRealtimeToken();
      setToken((currentToken) =>
        currentToken === latestToken ? currentToken : latestToken,
      );
    };

    const intervalId = window.setInterval(
      syncToken,
      TOKEN_CHECK_INTERVAL_MS,
    );

    window.addEventListener("storage", syncToken);
    window.addEventListener("focus", syncToken);

    return () => {
      window.clearInterval(intervalId);
      window.removeEventListener("storage", syncToken);
      window.removeEventListener("focus", syncToken);
    };
  }, []);

  return token || "anonymous";
};

const RealtimeProvider = ({ children }) => {
  const queryClient = useQueryClient();
  const tokenVersion = useRealtimeTokenVersion();
  const invalidateTimerRef = useRef(null);

  useEffect(() => {
    if (getRealtimeSocketUrls().length === 0) return undefined;

    const scheduleFullRefresh = () => {
      if (invalidateTimerRef.current) {
        window.clearTimeout(invalidateTimerRef.current);
      }

      invalidateTimerRef.current = window.setTimeout(() => {
        queryClient.invalidateQueries({ refetchType: "active" });
        invalidateTimerRef.current = null;
      }, INVALIDATION_DELAY_MS);
    };

    const cleanupSockets = createRealtimeSockets({
      onEvent: scheduleFullRefresh,
      onStatusChange: () => {},
    });

    return () => {
      if (invalidateTimerRef.current) {
        window.clearTimeout(invalidateTimerRef.current);
        invalidateTimerRef.current = null;
      }
      cleanupSockets();
    };
  }, [queryClient, tokenVersion]);

  return children;
};

export default RealtimeProvider;
