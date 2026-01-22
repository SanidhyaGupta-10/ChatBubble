# 📱 Real-Time Messaging Application

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)](#)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Bun](https://img.shields.io/badge/Runtime-Bun%20v1.0%2B-black)](https://bun.sh)
[![React Native](https://img.shields.io/badge/Mobile-React%20Native%20%2F%20Expo-blue)](https://reactnative.dev)

A full-stack, cross-platform messaging solution featuring real-time communication, seamless web/mobile synchronization, and a modern UI/UX inspired by industry-leading chat applications.

---

## 🌟 Features

### Real-Time Communication
- **Instant Messaging**: Low-latency delivery without page refreshes.
- **Presence Tracking**: Real-time online/offline status updates.
- **Typing Indicators**: Visual cues with 2-second auto-hide logic.
- **Cross-Platform Sync**: Unified experience across web and mobile via Socket.io.

### User Interface & Experience
- **WhatsApp-Style UI**: High-fidelity transitions and shrinking/sliding modals.
- **Optimistic Updates**: Immediate UI feedback while background processes complete.
- **User Discovery**: Searchable database to find and initiate new conversations.
- **Responsive Design**: Fluid layouts optimized for all device sizes.

---

## 🏗️ Tech Stack

| Component | Technology |
| :--- | :--- |
| **Backend** | Bun, Express.js, MongoDB (Mongoose), Socket.io, Sentry, Docker |
| **Mobile** | React Native (Expo), NativeWind, Zustand, TanStack Query |
| **Web** | React (Vite), Tailwind CSS, Zustand, TanStack Query |
| **Auth** | Clerk (Unified Authentication) |
| **Language** | TypeScript (Full-stack) |

---

## 🚀 Quick Start

### Prerequisites
- **Bun** (v1.0+) or **Node.js** (v18+)
- **MongoDB** (v6.0+)
- **Expo CLI** & **Docker**

### Installation

1. **Clone & Install**
   ```bash
   git clone <repository-url>
   cd messaging-app
   ```

2. **Backend Setup**
   ```bash
   cd backend
   bun install
   cp .env.example .env # Update with your credentials
   ```

3. **Web Setup**
   ```bash
   cd ../web
   npm install
   cp .env.example .env
   ```

4. **Mobile Setup**
   ```bash
   cd ../mobile
   npm install
   cp .env.example .env
   ```

---

## 🏃 Running the Application

### Development Mode
*   **Backend**: `cd backend && bun run dev`
*   **Web**: `cd web && npm run dev`
*   **Mobile**: `cd mobile && npm start` (Scan QR code with Expo Go)

### Docker Deployment
Easily spin up the entire environment:
```bash
docker-compose up --build
```

---

## 🔐 Environment Variables

### Backend (.env)
```env
PORT=3001
MONGODB_URI=your_mongodb_connection_string
CLERK_SECRET_KEY=your_clerk_secret_key
CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
SENTRY_DSN=your_sentry_dsn
JWT_SECRET=your_jwt_secret
NODE_ENV=development
```

### Web/Mobile (.env)
```env
# Web
VITE_API_URL=http://localhost:3001
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key

# Mobile
EXPO_PUBLIC_API_URL=http://localhost:3001
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
```

---

## 🔌 API Documentation

### Key Endpoints
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/login` | Authenticate user |
| `GET` | `/api/users/search` | Search users by name/email |
| `GET` | `/api/messages/:chatId` | Retrieve chat history |
| `POST` | `/api/chats` | Create new conversation |

### WebSocket Events
*   **Client → Server**: `user:online`, `user:typing`, `message:send`
*   **Server → Client**: `message:new`, `user:status`, `message:read`

---

## 📁 Project Structure
```text
messaging-app/
├── backend/            # Bun & Express API
├── web/                # React Vite Dashboard
├── mobile/             # React Native Expo App
├── docker-compose.yml  # Container Orchestration
└── README.md
```

---

## 🤝 Contributing
We welcome contributions! Please follow our workflow:
1. **Fork** the repository.
2. **Create** a feature branch (`git checkout -b feature/AmazingFeature`).
3. **Commit** using [Conventional Commits](https://www.conventionalcommits.org/).
4. **Push** to the branch and open a **Pull Request**.

---

## 📄 License
Distributed under the MIT License. See `LICENSE` for more information.

---
**Built with modern web technologies for high-performance communication.**
