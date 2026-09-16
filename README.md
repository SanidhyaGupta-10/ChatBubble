# 📱 NexusChat | Enterprise-Grade Real-Time Messaging

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactnative.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![Socket.io](https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=socket.io&logoColor=white)](https://socket.io/)
[![Clerk](https://img.shields.io/badge/Clerk-6C47FF?style=for-the-badge&logo=clerk&logoColor=white)](https://clerk.com/)
[![Sentry](https://img.shields.io/badge/Sentry-362D59?style=for-the-badge&logo=sentry&logoColor=white)](https://sentry.io/)

NexusChat is a high-performance, full-stack messaging ecosystem designed for seamless cross-platform communication. It bridges the gap between web and mobile experiences with a unified identity layer and a real-time synchronization engine, delivering a professional-grade UI/UX inspired by industry leaders.

## 🚀 Core Features

- **Cross-Platform Synchronization**: Instant message delivery and state consistency across Web and Mobile clients.
- **Unified Identity**: Seamless authentication and session management via a centralized identity provider.
- **Optimistic Interactions**: Zero-latency user experience with immediate UI updates and background reconciliation.
- **Intelligent Conversation Management**: High-performance chat lists with real-time "last message" previews and sorting.
- **Enterprise Reliability**: Full-stack observability and crash reporting to ensure 99.9% uptime and rapid issue resolution.

## 🛠 Technical Deep Dive

### High-Performance Real-Time Architecture
To solve the inherent challenges of latency and server-side broadcast overhead in real-time applications, I implemented:
- **Hybrid State Management**: Combined **Zustand** for global UI state and **TanStack Query** for server-state caching, ensuring predictable data flow and reduced redundant API calls.
- **Optimistic UI Updates**: Implemented a temp-timestamp reconciliation strategy, allowing messages to appear instantly in the UI while synchronizing with the database in the background.
- **Socket.io Room Strategy**: Leveraged dynamic `join-chat` and `leave-chat` events to isolate traffic, ensuring the server only broadcasts messages to active participants in a specific room.
- **Dual-Channel Messaging**: Segregated high-frequency chat traffic from critical system notifications using dedicated channels, preventing notification lag during peak chat activity.

### Enterprise-Grade Auth & Security
Addressing the risk of unauthorized socket access and fragmented user identities:
- **Unified Identity Layer**: Integrated **Clerk** across both Web and Mobile platforms to provide a single, secure source of truth for user authentication.
- **Secure Socket Handshaking**: Developed middleware-level **JWT verification** during the Socket.io handshake process, rejecting unauthenticated connections before they reach the application logic.
- **Fine-Grained Authorization**: Implemented server-side validation to ensure users can only join and read messages from chats they are explicitly authorized to access.
- **Persistent Mobile Sessions**: Utilized **Expo tokenCache** and secure storage to maintain persistent, encrypted sessions on mobile devices.

### Optimized Database Design
To eliminate expensive aggregations and slow query times in large-scale conversation histories:
- **Denormalized Performance Schema**: Strategically stored `lastMessageId` and `lastMessageAt` directly on the `Chat` model, reducing the complexity of fetching chat lists from $O(N \cdot M)$ to $O(N)$.
- **Strategic Indexing**: Applied B-Tree indexing on temporal fields to achieve $O(\log n)$ sorting performance for conversation histories.
- **Relational Integrity**: Designed a robust many-to-many relationship between `User` and `Chat` using **Prisma**, ensuring strict data consistency and referential integrity.

### Polished "WhatsApp-Style" UX
Solving for network flooding and mobile memory constraints:
- **Network-Efficient Typing Indicators**: Implemented **debounced events** for typing indicators, preventing network congestion by limiting the frequency of "user is typing" broadcasts.
- **Advanced List Rendering**: Utilized React Native's `FlatList` with optimized `getItemLayout` and `windowSize` to ensure buttery-smooth scrolling through thousands of messages.
- **Seamless Mobile Layouts**: Integrated `KeyboardAvoidingView` and custom auto-scroll logic to maintain a professional messaging feel across various device screen sizes.
- **Dynamic Component System**: Developed a flexible `MessageBubble` system that adapts aesthetics based on sender role and message type, ensuring a clean, modern visual hierarchy.

### Observability & Reliability
Ensuring production stability and rapid debugging:
- **Full-Stack Monitoring**: Integrated **Sentry** for real-time crash reporting and session replay, allowing for the precise reproduction of client-side bugs.
- **Delivery Guarantees**: Implemented **Socket.io acknowledgement callbacks**, providing the client with explicit confirmation of message delivery or failure.

## 💻 Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend (Web)** | React 19, Vite, Tailwind CSS, Zustand, TanStack Query |
| **Frontend (Mobile)** | React Native, Expo, NativeWind, Zustand, TanStack Query |
| **Backend** | Bun, Express, Socket.io, TypeScript |
| **Database** | PostgreSQL, Prisma ORM |
| **Authentication** | Clerk |
| **Observability** | Sentry |

## 🏁 Getting Started

### Prerequisites
- [Bun](https://bun.sh/) (Recommended for Backend)
- [Node.js](https://nodejs.org/) (v18+)
- [PostgreSQL](https://www.postgresql.org/)
- [Clerk Account](https://clerk.com/)

### Backend Setup
```bash
cd backend
bun install
# Create a .env file with:
# DATABASE_URL="postgresql://user:password@localhost:5432/nexuschat"
# CLERK_SECRET_KEY="sk_test_..."
bun run dev
```

### Web Setup
```bash
cd web
npm install
# Create a .env file with:
# VITE_CLERK_PUBLISHABLE_KEY="pk_test_..."
npm run dev
```

### Mobile Setup
```bash
cd mobile
npm install
npx expo start
```

## 📁 Project Structure

```text
.
├── backend/            # Express server, Socket.io logic, and Prisma schema
├── web/                # Vite + React web application
└── mobile/             # Expo + React Native mobile application
```
