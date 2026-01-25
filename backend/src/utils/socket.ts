import { Socket, Server as SocketServer } from "socket.io";
import { Server as HttpServer } from "http";
import { verifyToken } from "@clerk/express";
import Chat  from '../models/Chat.model';
import User from "../models/User.model";
import Message from "../models/Message.model";

const CLERK = process.env.CLERK_SECRET_KEY!;

interface SocketWithUserId extends Socket {
    userId: string;
}

// store online users in memory: userId => socketid
export const OnlineUsers: Map<string, string> = new Map();

export const initializeSocket = (httpServer: HttpServer) => {
    const allowedOrigins = [
        'http://localhost:8081',
        'http://localhost:5173',
        process.env.FRONTEND_URL as string,
    ];

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

            const user = await User.findOne({ clerkId });
            if(!user) return next(new Error("User not found"));

            (socket as SocketWithUserId).userId = user._id.toString();
            next();

        } catch (error: any) {
            next(new Error(error))
        }
    });

    // this "connection" event name is special and should be written like this
    // it's the event that is triggered when a new client connects to the Server

    io.on("connection", (socket) => {
        const userId = (socket as SocketWithUserId).userId;
        
        // send list of currently online users to the newly connected client.
        socket.emit("online-users", { userIds: Array.from(OnlineUsers.keys()) });

        // store user in the onlineUsers map
        OnlineUsers.set(userId, socket.id);

        // notify others that this current user is online
        socket.broadcast.emit("user-online", { userId });

        socket.join(`user: ${userId}`);

        socket.on("join-chat", (chatId: string) => {
            socket.join(`chat: ${chatId}`);
        });
        socket.on("leave-chat", (chatId: string) => {
            socket.leave(`chat: ${chatId}`);
        });

        // handle sending messages
        socket.on("send-message", async (data: { chatId: string, text: string}) => {
            try {
                const { chatId, text } = data

                const chat = await Chat.findOne({
                    _id: chatId,
                    participants: userId,
                });
                if(!chat){
                    socket.emit("socket-error", "Chat not found");
                    return;
                };

                const message = await Message.create({
                    chat: chatId,
                    sender: userId,
                    text,
                });

                chat.lastMessage = message._id;
                chat.lastMessageAt = message.createdAt;
                await chat.save();

                await message.populate("sender",  "email name avatar");

                io.to(`chat: ${chatId}`).emit("new-message", message);

                for(const participantId of chat.participants){
                    io.to
                };
            } catch (error) {
                socket.emit("socket-error", error);
            }
        });

        // Todo : later
        socket.on("typing", async(data) => {});

        socket.on("disconnect", () => {
            OnlineUsers.delete(userId);

            // notify others
            socket.broadcast.emit("user-offline", { userId });
        });
    });

    return io;

};