import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Send, LogOut, Phone, Video, MoreVertical, Search, Copy,
    UserPlus, Users, Settings, MessageSquare, CheckCheck,
    Mic, Smile, X,
    Bell, Shield, Moon, Share2, Paperclip
} from 'lucide-react';
import { useSocket } from '../context/SocketContext';

// --- Types ---
interface User {
    username: string;
    phone: string;
    online: boolean;
    avatar: string;
    lastSeen?: string;
}

interface Message {
    id: string;
    text: string;
    sender: string;
    timestamp: string;
    type?: 'text' | 'image' | 'voice';
    status?: 'sent' | 'delivered' | 'read';
    room?: string;
}

interface ChatProps {
    currentUser: string;
    onLogout: () => void;
}

// --- Components ---

// 1. Settings Modal
const SettingsModal = ({ isOpen, onClose, username }: { isOpen: boolean; onClose: () => void; username: string }) => {
    if (!isOpen) return null;
    return (
        <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
        >
            <motion.div
                initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}
                className="w-96 bg-gray-900 border border-white/10 rounded-2xl p-6 shadow-2xl relative"
            >
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white"><X size={20} /></button>
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><Settings className="text-neon-blue" /> Settings</h2>

                <div className="space-y-6">
                    <div className="flex items-center gap-4 p-3 bg-white/5 rounded-xl">
                        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-neon-blue">
                            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`} alt="Profile" />
                        </div>
                        <div>
                            <h3 className="font-bold">{username}</h3>
                            <p className="text-xs text-green-400">Online</p>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-center justify-between p-2 hover:bg-white/5 rounded-lg cursor-pointer">
                            <div className="flex items-center gap-3 text-gray-300">
                                <Bell size={18} /> Notifications
                            </div>
                            <div className="w-10 h-5 bg-neon-blue rounded-full relative">
                                <div className="absolute right-1 top-1 w-3 h-3 bg-black rounded-full"></div>
                            </div>
                        </div>
                        <div className="flex items-center justify-between p-2 hover:bg-white/5 rounded-lg cursor-pointer">
                            <div className="flex items-center gap-3 text-gray-300">
                                <Shield size={18} /> Privacy
                            </div>
                            <span className="text-xs text-gray-500">Everyone</span>
                        </div>
                        <div className="flex items-center justify-between p-2 hover:bg-white/5 rounded-lg cursor-pointer">
                            <div className="flex items-center gap-3 text-gray-300">
                                <Moon size={18} /> Dark Mode
                            </div>
                            <div className="w-10 h-5 bg-neon-purple rounded-full relative">
                                <div className="absolute right-1 top-1 w-3 h-3 bg-black rounded-full"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

// 2. Call Overlay
const CallOverlay = ({ isOpen, onClose, user, type }: { isOpen: boolean; onClose: () => void; user: User | null; type: 'voice' | 'video' }) => {
    if (!isOpen || !user) return null;
    return (
        <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/90 backdrop-blur-xl"
        >
            <div className="flex flex-col items-center animate-float">
                <div className="w-32 h-32 rounded-full border-4 border-neon-blue p-1 mb-6 shadow-neon-blue relative">
                    <img src={user.avatar} className="w-full h-full rounded-full" alt={user.username} />
                    <div className="absolute inset-0 rounded-full border border-white/20 animate-ping"></div>
                </div>
                <h2 className="text-2xl font-bold mb-2">{user.username}</h2>
                <p className="text-gray-400 mb-8 animate-pulse text-lg tracking-widest uppercase">{type === 'voice' ? 'Audio Calling...' : 'Video Calling...'}</p>

                <div className="flex gap-8">
                    <button className="p-4 bg-gray-800 rounded-full text-gray-400 hover:bg-white/10 transition-colors"><Mic size={24} /></button>
                    <button onClick={onClose} className="p-4 bg-red-600 rounded-full text-white hover:bg-red-700 transition-colors shadow-lg hover:scale-110 transform duration-200">
                        <Phone size={32} className="rotate-[135deg]" />
                    </button>
                    <button className="p-4 bg-gray-800 rounded-full text-gray-400 hover:bg-white/10 transition-colors"><Video size={24} /></button>
                </div>
            </div>
        </motion.div>
    );
}

// 3. Invite Modal
const InviteModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
    if (!isOpen) return null;
    const link = window.location.origin + "/register";

    return (
        <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
        >
            <motion.div
                initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}
                className="w-full max-w-sm bg-gray-900 border border-white/10 rounded-2xl p-6 shadow-[0_0_30px_rgba(0,243,255,0.1)] relative"
            >
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white"><X size={20} /></button>
                <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-neon-blue/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-neon-blue/30">
                        <Share2 size={32} className="text-neon-blue" />
                    </div>
                    <h2 className="text-xl font-bold text-white mb-2">Invite Community</h2>
                    <p className="text-sm text-gray-400">Share this link to instantly connect with friends.</p>
                </div>

                <div className="flex items-center gap-2 bg-black/50 p-2 rounded-lg border border-white/10 mb-6">
                    <code className="flex-1 text-xs text-neon-blue truncate font-mono px-2">{link}</code>
                    <button
                        onClick={() => {
                            navigator.clipboard.writeText(link);
                            alert("Link Copied!");
                        }}
                        className="p-2 bg-white/10 hover:bg-white/20 rounded-md transition-colors"
                    >
                        <Copy size={14} />
                    </button>
                </div>

                <div className="grid grid-cols-3 gap-3">
                    <button className="flex flex-col items-center gap-2 py-3 bg-white/5 hover:bg-green-500/10 hover:text-green-400 rounded-xl transition-all">
                        <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center"><Phone size={14} /></div>
                        <span className="text-[10px]">WhatsApp</span>
                    </button>
                    <button className="flex flex-col items-center gap-2 py-3 bg-white/5 hover:bg-blue-500/10 hover:text-blue-400 rounded-xl transition-all">
                        <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center"><MessageSquare size={14} /></div>
                        <span className="text-[10px]">SMS</span>
                    </button>
                    <button className="flex flex-col items-center gap-2 py-3 bg-white/5 hover:bg-purple-500/10 hover:text-purple-400 rounded-xl transition-all">
                        <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center"><Share2 size={14} /></div>
                        <span className="text-[10px]">More</span>
                    </button>
                </div>
            </motion.div>
        </motion.div>
    )
}

// --- Main Chat Component ---
const Chat: React.FC<ChatProps> = ({ currentUser, onLogout }) => {
    const { socket } = useSocket();
    const [allUsers, setAllUsers] = useState<User[]>([]);

    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [text, setText] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isInviteOpen, setIsInviteOpen] = useState(false);
    const [activeCall, setActiveCall] = useState<{ user: User, type: 'voice' | 'video' } | null>(null);

    // Track unread messages: { [username]: count }
    const [unreadCounts, setUnreadCounts] = useState<{ [key: string]: number }>({});
    const [typingStatus, setTypingStatus] = useState<{ [key: string]: boolean }>({});

    const scrollRef = useRef<HTMLDivElement>(null);

    const getRoomId = (user1: string, user2: string) => {
        return [user1, user2].sort().join('_');
    };

    useEffect(() => {
        if (!socket) return;

        // Request full user list immediately on mount
        socket.emit('get_users');

        socket.on('all_users', (users: User[]) => {
            setAllUsers(users.filter(u => u.username !== currentUser));
        });

        socket.on('user_update', (newUser: User) => {
            if (newUser.username === currentUser) return;
            setAllUsers(prev => {
                const exists = prev.find(u => u.username === newUser.username);
                return exists ? prev : [...prev, newUser];
            });
        });

        socket.on('user_status_change', ({ username, online, lastSeen }: { username: string, online: boolean, lastSeen?: string }) => {
            setAllUsers(prev => prev.map(u => u.username === username ? { ...u, online, lastSeen } : u));
            if (selectedUser?.username === username) setSelectedUser(prev => prev ? { ...prev, online, lastSeen } : null);
        });

        socket.on('display_typing', ({ username }) => {
            setTypingStatus(prev => ({ ...prev, [username]: true }));
        });

        socket.on('hide_typing', ({ username }) => {
            setTypingStatus(prev => ({ ...prev, [username]: false }));
        });

        socket.on('receive_message', (msg: Message) => {
            const activeRoom = selectedUser ? getRoomId(currentUser, selectedUser.username) : null;

            if (activeRoom && msg.room === activeRoom) {
                setMessages(prev => [...prev, msg]);
            } else {
                // It's a message for a different chat!
                // If I am the sender (echo), I don't need a notification.
                // If I am the receiver, I need a notification.
                if (msg.sender !== currentUser) {
                    setUnreadCounts(prev => ({
                        ...prev,
                        [msg.sender]: (prev[msg.sender] || 0) + 1
                    }));
                }
            }
        });

        socket.on('load_history', (msgs: Message[]) => setMessages(msgs));

        return () => {
            socket.off('all_users'); socket.off('user_update');
            socket.off('user_status_change'); socket.off('receive_message'); socket.off('load_history');
            socket.off('display_typing'); socket.off('hide_typing');
        }
    }, [socket, currentUser, selectedUser]); // Re-bind listener when selectedUser changes to capture correct 'activeRoom'

    useEffect(() => {
        if (selectedUser && socket) {
            setMessages([]);
            // Clear unread count for this user
            setUnreadCounts(prev => ({ ...prev, [selectedUser.username]: 0 }));

            socket.emit('join_room', { room: getRoomId(currentUser, selectedUser.username), username: currentUser });
        }
    }, [selectedUser, socket, currentUser]);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Typing debounce ref
    const typingTimeoutRef = useRef<any>(null);

    const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setText(e.target.value);
        if (!selectedUser || !socket) return;

        socket.emit('typing', { recipient: selectedUser.username, username: currentUser });

        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

        typingTimeoutRef.current = setTimeout(() => {
            socket.emit('stop_typing', { recipient: selectedUser.username, username: currentUser });
        }, 1000);
    };

    const handleSend = () => {
        if (!text.trim() || !selectedUser || !socket) return;

        // Clear typing immediately on send
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        socket.emit('stop_typing', { recipient: selectedUser.username, username: currentUser });

        const room = getRoomId(currentUser, selectedUser.username);
        socket.emit('send_message', {
            room,
            username: currentUser,
            recipient: selectedUser.username, // CRITICAL: Send recipient so backend knows who to notify
            text
        });
        setText('');
    }

    // Filter users based on search
    const displayedContacts = searchTerm ?
        allUsers.filter(u => u.username.toLowerCase().includes(searchTerm.toLowerCase()) || u.phone.includes(searchTerm)) : allUsers;

    /*
    const getStatusText = () => {
        if (!selectedUser) return '';
        if (typingStatus[selectedUser.username]) {
            return 'typing...';
        }
        if (selectedUser.online) {
            return 'online';
        }
        if (selectedUser.lastSeen) {
            const date = new Date(selectedUser.lastSeen);
            const today = new Date();
            const yesterday = new Date(today);
            yesterday.setDate(today.getDate() - 1);

            const isToday = date.toDateString() === today.toDateString();
            const isYesterday = date.toDateString() === yesterday.toDateString();

            if (isToday) {
                return `last seen today at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}`;
            } else if (isYesterday) {
                return `last seen yesterday at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}`;
            } else {
                return `last seen ${date.toLocaleDateString([], { month: 'short', day: 'numeric' })} at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}`;
            }
        }
        return 'offline';
    };
    */

    return (
        <div className="flex h-screen bg-black text-white overflow-hidden font-sans relative">
            <div className="absolute inset-0 bg-grid-pattern opacity-20 pointer-events-none"></div>
            <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-neon-blue/10 blur-[120px] rounded-full pointer-events-none"></div>
            <div className="absolute bottom-[0%] right-[0%] w-[40%] h-[40%] bg-neon-purple/10 blur-[100px] rounded-full pointer-events-none"></div>

            {/* --- SIDEBAR --- */}
            <div className="w-80 glass-card border-r border-white/5 flex flex-col z-20 m-4 rounded-3xl overflow-hidden relative backdrop-blur-2xl">
                {/* Profile */}
                <div className="p-4 flex items-center justify-between border-b border-white/5 bg-white/5">
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser}`} className="w-10 h-10 rounded-full border border-white/20" alt="me" />
                            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-black rounded-full"></div>
                        </div>
                        <div className="flex flex-col">
                            <span className="font-bold text-sm">{currentUser}</span>
                            <span className="text-[10px] text-gray-400">My Status</span>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button className="p-2 hover:bg-white/10 rounded-full text-gray-400"><Users size={18} /></button>
                        <button onClick={() => setIsSettingsOpen(true)} className="p-2 hover:bg-white/10 rounded-full text-gray-400"><MoreVertical size={18} /></button>
                    </div>
                </div>

                {/* Search */}
                <div className="p-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-2.5 text-gray-500 w-4 h-4" />
                        <input
                            className="w-full bg-white/5 border border-white/10 rounded-lg py-2 pl-9 pr-4 text-xs focus:border-neon-blue outline-none transition-all placeholder-gray-500"
                            placeholder="Search or start new chat"
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* Contacts List */}
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    {displayedContacts.map(user => (
                        <motion.div
                            layout
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            key={user.username}
                            onClick={() => setSelectedUser(user)}
                            className={`flex items-center gap-3 p-3 mx-2 rounded-lg cursor-pointer transition-all border-b border-white/5 hover:bg-white/5 ${selectedUser?.username === user.username ? 'bg-white/10' : ''}`}
                        >
                            <div className="relative">
                                <img src={user.avatar} className="w-12 h-12 rounded-full bg-gray-800 object-cover" alt={user.username} />
                                {user.online && <div className="absolute bottom-0 right-0 w-3 h-3 bg-neon-blue border-2 border-black rounded-full"></div>}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-center mb-0.5">
                                    <h4 className="text-sm font-semibold text-white truncate">{user.username}</h4>
                                    <span className="text-[10px] text-gray-500">
                                        {unreadCounts[user.username] ? <span className="text-green-500 font-bold">Now</span> : '12:30 PM'}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <p className="text-xs text-gray-400 truncate font-mono flex items-center gap-1 flex-1">
                                        {!unreadCounts[user.username] && <CheckCheck size={12} className="text-blue-400" />}
                                        {unreadCounts[user.username] ? <span className="text-white font-bold">New Message</span> : 'Hey there! I am using L-Chat.'}
                                    </p>
                                    {unreadCounts[user.username] ? (
                                        <div className="min-w-[20px] h-5 bg-green-500 rounded-full flex items-center justify-center text-xs font-bold text-black px-1.5 ml-2 animate-pulse">
                                            {unreadCounts[user.username]}
                                        </div>
                                    ) : null}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Invite Fab */}
                <div className="absolute bottom-6 right-6">
                    <button
                        onClick={() => setIsInviteOpen(true)}
                        className="w-12 h-12 bg-neon-blue rounded-full flex items-center justify-center text-black shadow-[0_0_20px_rgba(0,243,255,0.4)] hover:scale-110 transition-transform"
                    >
                        <UserPlus size={20} />
                    </button>
                </div>
            </div>

            {/* --- CHAT AREA --- */}
            <div className="flex-1 flex flex-col m-4 ml-0 rounded-3xl overflow-hidden glass-card relative z-10 shadow-2xl bg-[#0b141a]">
                {!selectedUser ? (
                    <div className="flex-1 flex flex-col items-center justify-center relative overflow-hidden text-center p-10">
                        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                            <div className="w-48 h-48 bg-white/5 rounded-full flex items-center justify-center mb-6 mx-auto">
                                <MessageSquare size={64} className="text-gray-600" />
                            </div>
                        </motion.div>
                        <h1 className="text-3xl font-light text-gray-300 mb-4">L-CHAT Web</h1>
                        <p className="text-gray-500 max-w-md">Send and receive messages without keeping your phone online.<br />Use L-Chat on up to 4 linked devices and 1 phone.</p>
                        <div className="mt-10 flex items-center gap-2 text-xs text-gray-600">
                            <Shield size={12} /> End-to-end encrypted
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Header */}
                        <div className="h-16 bg-white/5 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-6 z-20">
                            <div className="flex items-center gap-4 cursor-pointer">
                                <img src={selectedUser.avatar} className="w-10 h-10 rounded-full border border-white/10" />
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold text-white">{selectedUser.username}</h3>
                                    <p className="text-xs truncate">
                                        {typingStatus[selectedUser.username] ? (
                                            <span className="text-[#00a884] font-bold animate-pulse">typing...</span>
                                        ) : selectedUser.online ? (
                                            <span className="text-gray-300">Online</span>
                                        ) : (
                                            <span className="text-gray-400">
                                                last seen {selectedUser.lastSeen ? new Date(selectedUser.lastSeen).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'recently'}
                                            </span>
                                        )}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 text-gray-400">
                                <button onClick={() => setActiveCall({ user: selectedUser, type: 'video' })} className="hover:text-white"><Video size={20} /></button>
                                <button onClick={() => setActiveCall({ user: selectedUser, type: 'voice' })} className="hover:text-white"><Phone size={20} /></button>
                                <div className="w-[1px] h-6 bg-white/10 mx-2"></div>
                                <Search size={20} className="hover:text-white cursor-pointer" />
                                <MoreVertical size={20} className="hover:text-white cursor-pointer" />
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-8 space-y-2 custom-scrollbar relative bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] bg-fixed">
                            <AnimatePresence initial={false}>
                                {messages.map((msg) => {
                                    const isMe = msg.sender === currentUser;
                                    return (
                                        <motion.div
                                            key={msg.id}
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            className={`flex ${isMe ? 'justify-end' : 'justify-start'} group mb-1`}
                                        >
                                            <div className={`max-w-[60%] p-2 px-3 rounded-lg relative shadow-sm text-sm
                                     ${isMe
                                                    ? 'bg-[#005c4b] text-white rounded-tr-none'
                                                    : 'bg-[#202c33] text-gray-100 rounded-tl-none'}
                                 `}>
                                                <p className="leading-relaxed whitespace-pre-wrap break-words pr-16">{msg.text}</p>
                                                <div className={`absolute bottom-1 right-2 flex items-center gap-1 text-[9px] opacity-70`}>
                                                    <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}</span>
                                                    {isMe && <CheckCheck size={14} className="text-blue-400" />}
                                                </div>
                                            </div>
                                        </motion.div>
                                    )
                                })}
                            </AnimatePresence>
                            <div ref={scrollRef} />
                        </div>

                        {/* Input Area */}
                        <div className="min-h-[60px] bg-[#202c33] px-4 py-2 flex items-center gap-4">
                            <button className="text-gray-400 hover:text-gray-200"><Smile size={24} /></button>
                            <button className="text-gray-400 hover:text-gray-200"><Paperclip size={24} /></button>
                            <div className="flex-1 bg-[#2a3942] rounded-lg overflow-hidden flex items-center">
                                <input
                                    className="flex-1 bg-transparent text-white placeholder-gray-400 outline-none text-sm px-4 py-2.5"
                                    placeholder="Type a message"
                                    value={text}
                                    onChange={handleTextChange}
                                    onKeyDown={e => e.key === 'Enter' && handleSend()}
                                />
                            </div>
                            {text.trim() ? (
                                <button onClick={handleSend} className="text-neon-blue hover:text-white transition-colors transform hover:scale-110 bg-transparent"><Send size={24} /></button>
                            ) : (
                                <button className="text-gray-400 hover:text-gray-200"><Mic size={24} /></button>
                            )}
                        </div>
                    </>
                )}
            </div>

            {/* Modals & Overlays */}
            <AnimatePresence>
                {isSettingsOpen && <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} username={currentUser} />}
                {isInviteOpen && <InviteModal isOpen={isInviteOpen} onClose={() => setIsInviteOpen(false)} />}
                {activeCall && <CallOverlay isOpen={!!activeCall} onClose={() => setActiveCall(null)} user={activeCall.user} type={activeCall.type} />}
            </AnimatePresence>

            {/* Logout Absolute Bottom Left */}
            <div className="absolute bottom-4 left-4 z-50">
                <button onClick={onLogout} title="Logout" className="p-2 bg-red-500/20 hover:bg-red-500 text-red-500 hover:text-white rounded-full transition-all">
                    <LogOut size={16} />
                </button>
            </div>

        </div>
    );
};

export default Chat;
