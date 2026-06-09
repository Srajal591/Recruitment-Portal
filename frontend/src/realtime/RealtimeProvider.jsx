import { useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  createRealtimeSockets,
  getRealtimeSocketUrls,
  getRealtimeToken,
} from "./socketClient";

const INVALIDATION_DELAY_MS = 500;
const TOKEN_CHECK_INTERVAL_MS = 1000;

const invalidateForRealtimeEvent = (queryClient, eventName, payload = {}) => {
  const applicationId =
    payload.applicationId || payload.application?._id || payload.application?._id;
  const ticketId = payload.ticketId || payload.ticket?._id;

  const invalidate = (queryKey) =>
    queryClient.invalidateQueries({ queryKey, refetchType: "active" });

  switch (eventName) {
    case "notification:new":
      invalidate(["candidate-notifications-count"]);
      invalidate(["candidate-notifications"]);
      invalidate(["admin-notifications-count"]);
      invalidate(["admin-notifications"]);
      break;
    case "application:submitted":
    case "application:status:changed":
    case "document:verified":
    case "document:rejected":
      invalidate(["candidate-dashboard"]);
      invalidate(["candidate-applications"]);
      if (applicationId) {
        invalidate(["candidate-application-status", applicationId]);
      }
      invalidate(["admin-applications"]);
      break;
    case "payment:success":
    case "payment:failed":
      invalidate(["candidate-dashboard"]);
      invalidate(["candidate-payments"]);
      invalidate(["admin-payment-stats"]);
      break;
    case "job:published":
    case "job:closed":
      invalidate(["public-jobs"]);
      invalidate(["candidate-jobs"]);
      invalidate(["candidate-dashboard"]);
      invalidate(["admin-jobs"]);
      break;
    case "support:ticket:created":
    case "support:ticket:reply":
    case "support:ticket:resolved":
      invalidate(["candidate-tickets"]);
      invalidate(["admin-support-tickets"]);
      invalidate(["admin-support-tickets-kanban"]);
      invalidate(["admin-support-stats"]);
      if (ticketId) {
        invalidate(["candidate-ticket", ticketId]);
        invalidate(["admin-support-ticket", ticketId]);
      }
      break;
    case "dashboard:stats:update":
    case "dashboard:funnel:update":
    case "admin:live:count":
      invalidate(["candidate-dashboard"]);
      invalidate(["admin-dashboard"]);
      invalidate(["admin-analytics"]);
      break;
    case "application:autosaved":
    default:
      break;
  }
};

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
  const pendingEventsRef = useRef([]);

  useEffect(() => {
    if (getRealtimeSocketUrls().length === 0) return undefined;

    const scheduleTargetedRefresh = (event) => {
      pendingEventsRef.current.push(event);

      if (invalidateTimerRef.current) {
        window.clearTimeout(invalidateTimerRef.current);
      }

      invalidateTimerRef.current = window.setTimeout(() => {
        const pendingEvents = pendingEventsRef.current;
        pendingEventsRef.current = [];
        pendingEvents.forEach((pendingEvent) => {
          invalidateForRealtimeEvent(
            queryClient,
            pendingEvent?.eventName,
            pendingEvent?.payload,
          );
        });
        invalidateTimerRef.current = null;
      }, INVALIDATION_DELAY_MS);
    };

    const cleanupSockets = createRealtimeSockets({
      onEvent: scheduleTargetedRefresh,
      onStatusChange: () => {},
    });

    return () => {
      if (invalidateTimerRef.current) {
        window.clearTimeout(invalidateTimerRef.current);
        invalidateTimerRef.current = null;
      }
      pendingEventsRef.current = [];
      cleanupSockets();
    };
  }, [queryClient, tokenVersion]);

  return children;
};

export default RealtimeProvider;
