import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

interface SocketContextType {
    socket: Socket | null;
    isConnected: boolean;
}

const SocketContext = createContext<SocketContextType>({ socket: null, isConnected: false });

export const useSocket = () => useContext(SocketContext);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        // Connect to the backend
        const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';
        const s = io(SOCKET_URL, {
            transports: ['websocket'],
            upgrade: false
        });

        setSocket(s);

        s.on('connect', () => {
            console.log('Socket Connected');
            setIsConnected(true);
        });

        s.on('disconnect', () => {
            console.log('Socket Disconnected');
            setIsConnected(false);
        });

        return () => {
            s.disconnect();
        };
    }, []);

    return (
        <SocketContext.Provider value={{ socket, isConnected }}>
            {children}
        </SocketContext.Provider>
    );
};
