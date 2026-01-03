require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

const PORT = process.env.PORT || 5000;

// --- DATABASE (In-Memory for Demo) ---
// users: { username: { password, phone, online, socketId, avatar, contacts: [] } }
let users = {};
// messages: { roomId: [ { text, sender, timestamp, id } ] }
let messagesFunc = {};
// rooms: { roomName: { type: 'group' | 'private', members: [] } }
let rooms = {};

io.on('connection', (socket) => {
    console.log(`Socket Connected: ${socket.id}`);

    // --- AUTHENTICATION ---

    // Register
    socket.on('register', ({ username, phone, password }) => {
        if (users[username]) {
            socket.emit('auth_error', { message: 'Username already taken.' });
            return;
        }
        const phoneExists = Object.values(users).some(u => u.phone === phone);
        if (phoneExists) {
            socket.emit('auth_error', { message: 'Phone number already registered.' });
            return;
        }

        users[username] = {
            username,
            phone,
            password,
            online: true,
            socketId: socket.id,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
            // No separate contacts list anymore, everyone is connected
        };

        // Join personal room
        socket.join(`user_${username}`);

        socket.emit('auth_success', { username, phone });

        // Broadcast online status
        io.emit('user_status_change', { username, online: true });

        // Send the FULL directory to the logged-in user
        const allUsers = Object.values(users).map(u => ({
            username: u.username,
            phone: u.phone,
            online: u.online,
            avatar: u.avatar,
            lastSeen: u.lastSeen
        }));
        socket.emit('all_users', allUsers);

    }); // This closes the 'register' handler

    // Login (This block was previously malformed, assuming this is the intended structure for login)
    socket.on('login', ({ username, password }) => {
        const user = users[username];
        if (user && user.password === password) {
            user.online = true;
            user.socketId = socket.id;

            // Join personal room
            socket.join(`user_${username}`);

            socket.emit('auth_success', { username, phone: user.phone });

            // Broadcast online status
            io.emit('user_status_change', { username, online: true });

            // Send the FULL directory to the logged-in user
            const allUsers = Object.values(users).map(u => ({
                username: u.username,
                phone: u.phone,
                online: u.online,
                avatar: u.avatar,
                lastSeen: u.lastSeen
            }));
            socket.emit('all_users', allUsers);

        } else {
            socket.emit('auth_error', { message: 'Invalid credentials.' });
        }
    });

    // Fetch users on demand (fixes race condition where Chat component isn't mounted yet)
    socket.on('get_users', () => {
        const allUsers = Object.values(users).map(u => ({
            username: u.username,
            phone: u.phone,
            online: u.online,
            avatar: u.avatar,
            lastSeen: u.lastSeen
        }));
        socket.emit('all_users', allUsers);
    });

    // --- FEATURES ---

    // No explicit "add_contact" needed anymore since everyone is auto-added.
    // We can keep a simplified handler if the frontend sends it, but it just returns success.
    socket.on('add_contact', ({ myUsername, contactUsername }) => {
        // Just confirm availability
        const target = Object.values(users).find(u => u.username === contactUsername || u.phone === contactUsername);
        if (target) {
            socket.emit('contact_added_success', {
                username: target.username, phone: target.phone, online: target.online, avatar: target.avatar
            });
        } else {
            socket.emit('contact_error', { message: 'User not found.' });
        }
    });


    // --- CHAT ---
    socket.on('join_room', ({ room, username }) => {
        // Only used for loading history now
        if (messagesFunc[room]) {
            socket.emit('load_history', messagesFunc[room]);
        }
    });

    socket.on('typing', ({ recipient, username }) => {
        io.to(`user_${recipient}`).emit('display_typing', { username });
    });

    socket.on('stop_typing', ({ recipient, username }) => {
        io.to(`user_${recipient}`).emit('hide_typing', { username });
    });

    socket.on('send_message', (data) => {
        const { room, username, recipient, text, type } = data;
        const messageData = {
            id: uuidv4(),
            room, // Keep room for history indexing
            username,
            text,
            timestamp: new Date().toISOString(),
            sender: username,
            type: type || 'text'
        };

        if (!messagesFunc[room]) messagesFunc[room] = [];
        messagesFunc[room].push(messageData);
        if (messagesFunc[room].length > 200) messagesFunc[room].shift();

        // Send to Recipient's personal room (guaranteed delivery if online)
        io.to(`user_${recipient}`).emit('receive_message', messageData);

        // Send back to Sender (for UI update)
        io.to(`user_${username}`).emit('receive_message', messageData);
    });

    socket.on('disconnect', () => {
        const username = Object.keys(users).find(u => users[u].socketId === socket.id);
        if (username) {
            users[username].online = false;
            users[username].lastSeen = new Date().toISOString(); // Update Last Seen
            io.emit('user_status_change', { username, online: false, lastSeen: users[username].lastSeen });
        }
    });
});

server.listen(PORT, () => {
    console.log(`L-CHAT Server running on port ${PORT}`);
});
