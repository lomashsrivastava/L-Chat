import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, MessageSquare, ArrowRight, Activity } from 'lucide-react';
import { useSocket } from '../context/SocketContext';
import { useSearchParams } from 'react-router-dom';

interface LoginProps {
    onJoin: (username: string, room: string) => void;
}

const Login: React.FC<LoginProps> = ({ onJoin }) => {
    const [username, setUsername] = useState('');
    const [room, setRoom] = useState('');
    const { isConnected } = useSocket();
    const [searchParams] = useSearchParams();

    useEffect(() => {
        const roomFromUrl = searchParams.get('room');
        if (roomFromUrl) {
            setRoom(roomFromUrl);
        }
    }, [searchParams]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (username.trim() && room.trim()) {
            onJoin(username, room);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-dark-bg relative overflow-hidden">
            {/* Background Grid */}
            <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(to_right,#333_1px,transparent_1px),linear-gradient(to_bottom,#333_1px,transparent_1px)] bg-[size:50px_50px]"></div>
            </div>

            {/* Main Container */}
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="z-10 w-full max-w-md p-8 glass rounded-xl border border-neon-blue/30 shadow-neon-blue"
            >
                <div className="text-center mb-8">
                    <motion.div
                        animate={{ boxShadow: ['0 0 10px #00f3ff', '0 0 30px #00f3ff', '0 0 10px #00f3ff'] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="w-16 h-16 bg-dark-surface rounded-full flex items-center justify-center mx-auto mb-4 border border-neon-blue"
                    >
                        <MessageSquare className="text-neon-blue w-8 h-8" />
                    </motion.div>
                    <h1 className="text-4xl font-bold font-sans text-white">L-CHAT</h1>
                    <p className="text-gray-400 text-sm mt-2">Simple. Fast. Real-time.</p>

                    <div className="flex items-center justify-center gap-2 mt-4">
                        <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-neon-green shadow-neon-green' : 'bg-red-500'}`}></div>
                        <span className="text-xs text-gray-400 font-mono">{isConnected ? 'Connected' : 'Connecting...'}</span>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="group">
                        <label className="block text-neon-blue text-xs font-bold mb-2 uppercase">Username</label>
                        <div className="relative">
                            <User className="absolute left-3 top-3 text-gray-500 group-focus-within:text-neon-blue transition-colors" size={20} />
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full bg-dark-surface border border-dark-border rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:border-neon-blue focus:shadow-neon-blue transition-all placeholder-gray-600"
                                placeholder="Enter your name"
                                required
                            />
                        </div>
                    </div>

                    <div className="group">
                        <label className="block text-neon-purple text-xs font-bold mb-2 uppercase">Room Name</label>
                        <div className="relative">
                            <Activity className="absolute left-3 top-3 text-gray-500 group-focus-within:text-neon-purple transition-colors" size={20} />
                            <input
                                type="text"
                                value={room}
                                onChange={(e) => setRoom(e.target.value)}
                                className="w-full bg-dark-surface border border-dark-border rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:border-neon-purple focus:shadow-neon-purple transition-all placeholder-gray-600"
                                placeholder="Enter room name (e.g. Friends)"
                                required
                            />
                        </div>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        className="w-full bg-neon-blue text-black font-bold py-3 rounded-lg hover:bg-white transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-neon-blue"
                    >
                        Join Chat <ArrowRight className="w-5 h-5" />
                    </motion.button>
                </form>
            </motion.div>
        </div>
    );
};

export default Login;
