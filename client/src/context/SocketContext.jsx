import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext(null);

export function SocketProvider({ children }) {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    let SOCKET_URL = import.meta.env.VITE_SOCKET_URL || window.location.origin;

    // Prevent Mixed Content browser errors: if frontend is on HTTPS, do not attempt insecure ws/http connection
    if (window.location.protocol === 'https:' && SOCKET_URL.startsWith('http://')) {
      console.warn('[Socket] Insecure ws connection skipped on HTTPS page to prevent browser mixed content block. Configure HTTPS on VPS domain for real-time WebSockets.');
      return;
    }

    const socketInstance = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 10,
    });

    socketInstance.on('connect', () => {
      setIsConnected(true);
      console.log('[Socket] Connected to server');
    });

    socketInstance.on('disconnect', () => {
      setIsConnected(false);
      console.log('[Socket] Disconnected from server');
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  return useContext(SocketContext);
}
