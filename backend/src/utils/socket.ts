import { Socket, Server as SocketServer } from "socket.io";
import { Server as HttpServer } from "http";
import { verifyToken } from "@clerk/express";
import prisma from '../config/prisma';
import { serializeMessage } from "./serializers";

const CLERK = process.env.CLERK_SECRET_KEY!;
const defaultAllowedOrigins = [
    'http://localhost:8081',
    'http://localhost:5173',
];
const envAllowedOrigins = (process.env.ALLOWED_ORIGINS ?? '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

// store online users in memory: userId => socketid
export const OnlineUsers: Map<string, string> = new Map();

export const initializeSocket = (httpServer: HttpServer) => {
    const allowedOrigins = Array.from(new Set([
        ...defaultAllowedOrigins,
        ...envAllowedOrigins,
        process.env.FRONTEND_URL,
    ].filter(Boolean))) as string[]

    const io = new SocketServer(httpServer, { 
        cors: { origin: allowedOrigins}
    });

    // Verify socket connection - if the user is authenticated, we will store the user id in the socket

    io.use(async (socket, next) => {
        const token = socket.handshake.auth.token; // this is what user will send from client
        if(!token) return next(new Error("Authentication error"));

        try {
            const session = await verifyToken(token, { secretKey: CLERK });

            const clerkId = session.sub;

            const user = await prisma.user.findUnique({ where: { clerkId } });
            if(!user) return next(new Error("User not found"));

            socket.data.userId = user.id;
            next();

        } catch (error: any) {
            next(new Error(error))
        }
    });

    // this "connection" event name is special and should be written like this
    // it's the event that is triggered when a new client connects to the Server

    io.on("connection", (socket) => {
        const userId = socket.data.userId;
        
        // send list of currently online users to the newly connected client.
        socket.emit("online-users", { userIds: Array.from(OnlineUsers.keys()) });

        // store user in the onlineUsers map
        OnlineUsers.set(userId, socket.id);

        // notify others that this current user is online
        socket.broadcast.emit("user-online", { userId });

        socket.join(`user:${userId}`);

        socket.on("join-chat", (payload: string | { chatId: string }) => {
            const chatId = typeof payload === "string" ? payload : payload.chatId;
            if(!chatId) return;

            socket.join(`chat:${chatId}`);
            socket.join(`chat: ${chatId}`);
        });
        socket.on("leave-chat", (payload: string | { chatId: string }) => {
            const chatId = typeof payload === "string" ? payload : payload.chatId;
            if(!chatId) return;

            socket.leave(`chat:${chatId}`);
            socket.leave(`chat: ${chatId}`);
        });

        // handle sending messages
        socket.on("send-message", async (
            data: { chatId: string, text: string},
            ack?: (error?: { message: string }) => void
        ) => {
            try {
                const { chatId, text } = data;

                const chat = await prisma.chat.findUnique({
                    where: { id: chatId },
                    include: { participants: true }
                });

                if(!chat || !chat.participants.some(p => p.id === userId)){
                    const error = { message: "Chat not found or access denied" };
                    socket.emit("socket-error", error.message);
                    ack?.(error);
                    return;
                };

                const message = await prisma.message.create({
                    data: {
                        chatId,
                        senderId: userId,
                        text,
                    },
                    include: {
                        sender: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                                avatar: true
                            }
                        }
                    }
                });

                await prisma.chat.update({
                    where: { id: chatId },
                    data: {
                        lastMessageId: message.id,
                        lastMessageAt: message.createdAt
                    }
                });

                const serializedMessage = serializeMessage(message);

                io.to(`chat:${chatId}`).emit("new-message", serializedMessage);
                io.to(`chat: ${chatId}`).emit("new-message", serializedMessage);
                ack?.();

                // For real-time updates when user is not in the chat screen
                for(const participant of chat.participants){
                    if(participant.id !== userId) {
                        io.to(`user:${participant.id}`).emit("notification", {
                            chatId,
                            senderId: userId,
                            text
                        });
                    }
                };
            } catch (error) {
                console.error("Socket send-message error:", error);
                const socketError = { message: "Failed to send message" };
                socket.emit("socket-error", socketError.message);
                ack?.(socketError);
            }
        });

        socket.on("typing", async ( data: { chatId: string, isTyping: boolean}) => 
        {
            const typingPayload = {
                userId,
                chatId: data.chatId,
                isTyping: data.isTyping,
            }

            socket.to(`chat:${data.chatId}`).emit("typing", typingPayload);
            socket.to(`chat: ${data.chatId}`).emit("typing", typingPayload);

            try {
                const chat = await prisma.chat.findUnique({
                    where: { id: data.chatId },
                    include: { participants: true }
                });
                if(chat) {
                    const otherParticipant = chat.participants.find(
                        (p) => p.id !== userId
                    );
                    if(otherParticipant){
                        socket.to(`user:${otherParticipant.id}`).emit("typing", typingPayload);
                    }
                }
            } catch (error) {
                // Ignore silent typing errors
            }

        });

        socket.on("disconnect", () => {
            OnlineUsers.delete(userId);

            // notify others
            socket.broadcast.emit("user-offline", { userId });
        });
    });

    return io;

};
