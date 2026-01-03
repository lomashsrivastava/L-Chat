import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Lock, Phone, ArrowRight, MessageSquare } from 'lucide-react';
import { useSocket } from '../context/SocketContext';

interface AuthProps {
    onLogin: (username: string) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        username: '',
        phone: '',
        password: ''
    });
    const [error, setError] = useState('');
    const { socket } = useSocket();

    // Listen for auth responses
    React.useEffect(() => {
        if (!socket) return;

        socket.on('auth_success', (data) => {
            onLogin(data.username);
        });

        socket.on('auth_error', (data) => {
            setError(data.message);
        });

        return () => {
            socket.off('auth_success');
            socket.off('auth_error');
        }
    }, [socket, onLogin]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!socket) return;

        if (isLogin) {
            socket.emit('login', { username: formData.username, password: formData.password });
        } else {
            socket.emit('register', formData);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-dark-bg relative overflow-hidden">
            {/* Background Grid */}
            <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(to_right,#333_1px,transparent_1px),linear-gradient(to_bottom,#333_1px,transparent_1px)] bg-[size:50px_50px]"></div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md p-8 glass rounded-2xl border border-neon-blue/30 shadow-2xl relative z-10"
            >
                <div className="text-center mb-8">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        className="w-20 h-20 mx-auto mb-4 rounded-full border-4 border-dashed border-neon-blue flex items-center justify-center"
                    >
                        <MessageSquare className="text-white w-10 h-10" />
                    </motion.div>
                    <h1 className="text-3xl font-bold text-white mb-2">L-CHAT <span className="text-neon-blue text-sm align-top">PRO</span></h1>
                    <p className="text-gray-400">Next Gen Communication</p>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded text-red-200 text-sm text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-400 text-xs mb-1 ml-1">USERNAME</label>
                        <div className="relative">
                            <User className="absolute left-3 top-3 text-gray-500 w-5 h-5" />
                            <input
                                type="text"
                                required
                                className="w-full bg-dark-surface border border-dark-border rounded-lg py-3 pl-10 pr-4 text-white focus:border-neon-blue outline-none transition-colors"
                                placeholder="Enter username"
                                value={formData.username}
                                onChange={e => setFormData({ ...formData, username: e.target.value })}
                            />
                        </div>
                    </div>

                    {!isLogin && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}>
                            <label className="block text-gray-400 text-xs mb-1 ml-1">PHONE NUMBER</label>
                            <div className="relative mb-4">
                                <Phone className="absolute left-3 top-3 text-gray-500 w-5 h-5" />
                                <input
                                    type="tel"
                                    required={!isLogin}
                                    className="w-full bg-dark-surface border border-dark-border rounded-lg py-3 pl-10 pr-4 text-white focus:border-neon-purple outline-none transition-colors"
                                    placeholder="+1 234 567 890"
                                    value={formData.phone}
                                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                />
                            </div>
                        </motion.div>
                    )}

                    <div>
                        <label className="block text-gray-400 text-xs mb-1 ml-1">PASSWORD</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 text-gray-500 w-5 h-5" />
                            <input
                                type="password"
                                required
                                className="w-full bg-dark-surface border border-dark-border rounded-lg py-3 pl-10 pr-4 text-white focus:border-neon-blue outline-none transition-colors"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={e => setFormData({ ...formData, password: e.target.value })}
                            />
                        </div>
                    </div>

                    <button className="w-full py-4 bg-neon-blue hover:bg-white text-black font-bold rounded-lg transition-all shadow-neon-blue flex items-center justify-center gap-2">
                        {isLogin ? 'LOGIN' : 'REGISTER'} <ArrowRight size={20} />
                    </button>
                </form>

                <div className="mt-6 text-center text-sm">
                    <span className="text-gray-400">{isLogin ? "Don't have an account? " : "Already have an account? "}</span>
                    <button
                        onClick={() => setIsLogin(!isLogin)}
                        className="text-neon-blue font-bold hover:underline"
                    >
                        {isLogin ? 'Register Now' : 'Login Here'}
                    </button>
                </div>

            </motion.div>
        </div>
    );
}

export default Auth;
