import { useState, useEffect, useRef, useCallback } from "react";

interface User {
  name: string;
  color: string;
}

interface Segment {
  text: string;
  name: string;
  color: string;
}

interface UseSharedTerminalReturn {
  segments: Segment[];
  you: User | null;
  users: User[];
  isConnected: boolean;
  appendText: (text: string) => void;
  backspace: () => void;
  clearContent: () => void;
}

export function useSharedTerminal(enabled: boolean): UseSharedTerminalReturn {
  const [segments, setSegments] = useState<Segment[]>([]);
  const [you, setYou] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!enabled) {
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
        setIsConnected(false);
        setYou(null);
        setUsers([]);
        setSegments([]);
      }
      return;
    }

    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const ws = new WebSocket(`${protocol}//${window.location.host}/ws/shared-terminal`);
    wsRef.current = ws;

    ws.onopen = () => {
      setIsConnected(true);
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        if (data.type === "init") {
          setSegments(data.segments);
          setYou(data.you);
          setUsers(data.users);
        }

        if (data.type === "segments") {
          setSegments(data.segments);
        }

        if (data.type === "clear") {
          setSegments([]);
        }

        if (data.type === "users") {
          setUsers(data.users);
        }
      } catch {
        // Ignore malformed messages
      }
    };

    ws.onclose = () => {
      setIsConnected(false);
    };

    ws.onerror = () => {
      setIsConnected(false);
    };

    return () => {
      ws.close();
      wsRef.current = null;
    };
  }, [enabled]);

  const appendText = useCallback((text: string) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: "append", text }));
    }
  }, []);

  const backspace = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: "backspace" }));
    }
  }, []);

  const clearContent = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: "clear" }));
    }
  }, []);

  return { segments, you, users, isConnected, appendText, backspace, clearContent };
}
