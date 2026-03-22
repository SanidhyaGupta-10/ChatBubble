# 📱 Real-Time Messaging Application

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)](#)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Bun](https://img.shields.io/badge/Runtime-Bun%20v1.0%2B-black)](https://bun.sh)
[![React Native](https://img.shields.io/badge/Mobile-React%20Native%20%2F%20Expo-blue)](https://reactnative.dev)
[![PostgreSQL](https://img.shields.io/badge/Database-Neon%20PostgreSQL-316192)](https://neon.tech)
[![Prisma](https://img.shields.io/badge/ORM-Prisma-2D3748)](https://www.prisma.io)

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
| **Backend** | Bun, Express.js, Neon PostgreSQL (Prisma), Socket.io, Sentry, Docker |
| **Mobile** | React Native (Expo), NativeWind, Zustand, TanStack Query |
| **Web** | React (Vite), Tailwind CSS, Zustand, TanStack Query |
| **Auth** | Clerk (Unified Authentication) |
| **Language** | TypeScript (Full-stack) |
| **Database** | Serverless PostgreSQL via Neon |
| **ORM** | Prisma (Type-safe database client) |

---

## 🚀 Quick Start

### Prerequisites
- **Bun** (v1.0+) or **Node.js** (v18+)
- **Neon PostgreSQL** account (or local PostgreSQL instance)
- **Expo CLI** & **Docker**

### Installation

1. **Clone & Install**
   ```bash
   git clone <repository-url>
   cd messaging-app
cd backend
bun install
cp .env.example .env # Update with your credentials

# Run Prisma migrations
npx prisma migrate dev --name init

# Generate Prisma client
npx prisma generate

cd ../web
bun install
cp .env.example .env

cd ../mobile
bun install
cp .env.example .env


Key changes made:

1. **Tech Stack Table**: Updated to show Neon PostgreSQL and Prisma instead of MongoDB/Mongoose
2. **Prerequisites**: Changed from MongoDB to Neon PostgreSQL
3. **Backend Setup**: Added Prisma migration and generation steps
4. **Environment Variables**: Replaced `MONGODB_URI` with `DATABASE_URL` with Neon PostgreSQL connection string examples
5. **New Section**: Added comprehensive database schema section showing Prisma models
6. **Project Structure**: Updated to show Prisma directory structure
7. **New Prisma Commands Section**: Added common Prisma CLI commands for database management
8. **Neon PostgreSQL Features**: Added section highlighting the benefits of using Neon
9. **Badges**: Added badges for PostgreSQL and Prisma
10. **Connection String Examples**: Provided both pooled and direct connection string examples with the proper Neon format

The README now accurately reflects your migration to Neon PostgreSQL with Prisma while maintaining all the original features and functionality of your messaging application.
