import { useEffect, useRef, useCallback } from 'react';

export type WebSocketMessage = {
  type: 'chat' | 'event' | 'evidence' | 'evidence_cleared' | 'squad';
  data: any;
};

export type WebSocketHandler = (message: WebSocketMessage) => void;

let wsInstance: WebSocket | null = null;
let reconnectTimeout: NodeJS.Timeout | null = null;
const handlers = new Set<WebSocketHandler>();

function getWebSocketUrl(): string {
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  return `${protocol}//${window.location.host}/ws`;
}

function connect() {
  if (wsInstance && wsInstance.readyState === WebSocket.OPEN) {
    return;
  }

  try {
    wsInstance = new WebSocket(getWebSocketUrl());

    wsInstance.onopen = () => {
      console.log('[WebSocket] Connected');
      if (reconnectTimeout) {
        clearTimeout(reconnectTimeout);
        reconnectTimeout = null;
      }
    };

    wsInstance.onmessage = (event) => {
      try {
        const message: WebSocketMessage = JSON.parse(event.data);
        handlers.forEach((handler) => handler(message));
      } catch (error) {
        console.error('[WebSocket] Failed to parse message:', error);
      }
    };

    wsInstance.onclose = () => {
      console.log('[WebSocket] Disconnected, reconnecting in 3s...');
      wsInstance = null;
      reconnectTimeout = setTimeout(connect, 3000);
    };

    wsInstance.onerror = (error) => {
      console.error('[WebSocket] Error:', error);
    };
  } catch (error) {
    console.error('[WebSocket] Failed to connect:', error);
    reconnectTimeout = setTimeout(connect, 3000);
  }
}

export function useWebSocket(handler: WebSocketHandler) {
  const handlerRef = useRef(handler);
  handlerRef.current = handler;

  useEffect(() => {
    const wrappedHandler: WebSocketHandler = (message) => {
      handlerRef.current(message);
    };

    handlers.add(wrappedHandler);
    connect();

    return () => {
      handlers.delete(wrappedHandler);
    };
  }, []);
}

export function sendWebSocketMessage(message: WebSocketMessage) {
  if (wsInstance && wsInstance.readyState === WebSocket.OPEN) {
    wsInstance.send(JSON.stringify(message));
  }
}
