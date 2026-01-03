# L-CHAT - Advanced Realtime Messaging Platform

## 🚀 Project Overview
**Developed by Lomash Srivastava**

L-CHAT is a futuristic, neon-styled, real-time chat application built with modern web technologies. It supports instant messaging, rooms, and a high-performance websocket backend.

**Repositories & Live Links:**
- **GitHub Repo**: [https://github.com/lomashsrivastava/L-Chat](https://github.com/lomashsrivastava/L-Chat)
- **Live Demo (GitHub Pages)**: [https://lomashsrivastava.github.io/L-Chat](https://lomashsrivastava.github.io/L-Chat)
- **Live Demo (Netlify)**: [https://lchat12.netlify.app/]

## 🛠 Tech Stack
- **Frontend**: React (TypeScript), Vite, Tailwind CSS (Neon Theme), Framer Motion.
- **Backend (Realtime)**: Node.js, Express, Socket.io.
- **Architecture**: Microservices ready (Folders for Django Auth, FASTAPI AI).
- **Deployment**: GitHub Pages, Netlify.

## ☁️ Deployment (Cloud)

### 1. Backend (Render)
**Live Status**: ✅ Deployed
**URL**: [https://l-chat-backend.onrender.com](https://l-chat-backend.onrender.com)

### 2. Frontend (Netlify)
**Live Status**: ✅ Deployed
**URL**: [https://lchat12.netlify.app](https://lchat12.netlify.app)

*(Note: The code is now pre-configured to connect to the live backend automatically!)*

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/lomashsrivastava/L-Chat)

## 📂 Structure
- `/frontend`: The React Client.
- `/backend-realtime`: The Node.js Websocket Server.

## ⚡ How to Run Locally
### 1. Start the Backend Server
```bash
cd backend-realtime
npm install
node index.js
```
*Server runs on port 5000.*

### 2. Start the Frontend
```bash
cd frontend
npm install
npm run dev
```
*App runs on http://localhost:5173.*

## ✨ Features Implemented
- **Neon/Cyberpunk UI**: Glowing borders, animated text, glassmorphism.
- **Real-time Chat**: Instant delivery via Socket.io.
- **Rooms/Channels**: Join specific rooms (e.g., #Zion, #Matrix).
- **Responsive Design**: Mobile-friendly layout.
