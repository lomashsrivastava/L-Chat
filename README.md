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
The backend uses Socket.io and **cannot** be hosted on Netlify. It must be hosted on a service like Render or Railway.
1. Click the button below to deploy the backend.
2. Render will auto-detect `render.yaml` and set it up.
3. **Copy the HTTPS URL** given by Render (e.g. `https://l-chat-backend.onrender.com`).

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy)

### 2. Frontend (Netlify)
[Live on Netlify](https://lchat-app.netlify.app)
1. Deploy the frontend to Netlify.
2. Go to **Site Settings > Environment Variables**.
3. Add a new variable:
   - Key: `VITE_SOCKET_URL`
   - Value: `YOUR_RENDER_BACKEND_URL` (from step 1).
4. Redeploy the site.

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
