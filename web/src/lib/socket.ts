import { create } from "zustand";
import { io, Socket } from "socket.io-client";
import type { QueryClient } from "@tanstack/react-query";

const SOCKET_URL = import.meta.env.VITE_API_URL as string;

/* =======================
   Types & Interfaces
======================= */

interface User {
  _id: string;
  fullName?: string;
  firstName?: string;
  primaryEmailAddress?: {
    emailAddress: string;
  };
  imageUrl?: string;
}

interface Message {
  _id: string;
  chat: string;
  sender: {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  text: string;
  createdAt: string;
}

interface Chat {
  _id: string;
  lastMessage?: {
    _id: string;
    text: string;
    sender: string;
    createdAt: string;
  };
  lastMessageAt?: string;
}

interface SocketStore {
  socket: Socket | null;
  onlineUsers: Set<string>;
  typingUsers: Map<string, string>; // chatId -> userId
  queryClient: QueryClient | null;

  connect: (token: string, queryClient: QueryClient) => void;
  disconnect: () => void;
  joinChat: (chatId: string) => void;
  leaveChat: (chatId: string) => void;
  sendMessage: (chatId: string, text: string, currentUser: User) => void;
  setTyping: (chatId: string, isTyping: boolean) => void;
}

/* =======================
   Zustand Store
======================= */

export const useSocketStore = create<SocketStore>((set, get) => ({
  socket: null,
  onlineUsers: new Set<string>(),
  typingUsers: new Map<string, string>(),
  queryClient: null,

  connect: (token, queryClient) => {
    const existingSocket = get().socket;
    if (existingSocket?.connected || !queryClient) return;

    if (existingSocket) existingSocket.disconnect();

    const socket: Socket = io(SOCKET_URL, {
      auth: { token },
    });

    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
    });

    socket.on("connect_error", (error: Error) => {
      console.error("Socket connection error:", error.message);
    });

    socket.on("socket-error", (error: unknown) => {
      console.error("Socket error:", error);
    });

    socket.on("online-users", ({ userIds }: { userIds: string[] }) => {
      set({ onlineUsers: new Set(userIds) });
    });

    socket.on("user-online", ({ userId }: { userId: string }) => {
      set((state) => ({
        onlineUsers: new Set([...state.onlineUsers, userId]),
      }));
    });

    socket.on("user-offline", ({ userId }: { userId: string }) => {
      set((state) => {
        const onlineUsers = new Set(state.onlineUsers);
        onlineUsers.delete(userId);
        return { onlineUsers };
      });
    });

    socket.on(
      "typing",
      ({ userId, chatId, isTyping }: { userId: string; chatId: string; isTyping: boolean }) => {
        set((state) => {
          const typingUsers = new Map(state.typingUsers);
          if (isTyping) typingUsers.set(chatId, userId);
          else typingUsers.delete(chatId);
          return { typingUsers };
        });
      }
    );

    socket.on("new-message", (message: Message & { sender?: { _id: string } }) => {
      const senderId = message.sender?._id;

      queryClient.setQueryData<Message[]>(["messages", message.chat], (old) => {
        if (!old) return [message];
        const filtered = old.filter((m) => !m._id.startsWith("temp-"));
        const exists = filtered.some((m) => m._id === message._id);
        return exists ? filtered : [...filtered, message];
      });

      queryClient.setQueryData<Chat[]>(["chats"], (oldChats) => {
        return oldChats?.map((chat) =>
          chat._id === message.chat
            ? {
                ...chat,
                lastMessage: {
                  _id: message._id,
                  text: message.text,
                  sender: senderId!,
                  createdAt: message.createdAt,
                },
                lastMessageAt: message.createdAt,
              }
            : chat
        );
      });

      set((state) => {
        const typingUsers = new Map(state.typingUsers);
        typingUsers.delete(message.chat);
        return { typingUsers };
      });
    });

    set({ socket, queryClient });
  },

  disconnect: () => {
    const socket = get().socket;
    if (!socket) return;

    socket.disconnect();
    set({
      socket: null,
      onlineUsers: new Set(),
      typingUsers: new Map(),
      queryClient: null,
    });
  },

  joinChat: (chatId) => {
    get().socket?.emit("join-chat", chatId);
  },

  leaveChat: (chatId) => {
    get().socket?.emit("leave-chat", chatId);
  },

  sendMessage: (chatId, text, currentUser) => {
    const { socket, queryClient } = get();
    if (!socket?.connected || !queryClient) return;

    const tempId = `temp-${Date.now()}`;

    const optimisticMessage: Message = {
      _id: tempId,
      chat: chatId,
      sender: {
        _id: currentUser._id,
        name: currentUser.fullName || currentUser.firstName || "You",
        email: currentUser.primaryEmailAddress?.emailAddress || "",
        avatar: currentUser.imageUrl,
      },
      text,
      createdAt: new Date().toISOString(),
    };

    queryClient.setQueryData<Message[]>(["messages", chatId], (old) =>
      old ? [...old, optimisticMessage] : [optimisticMessage]
    );

    socket.emit("send-message", { chatId, text });

    socket.once("socket-error", () => {
      queryClient.setQueryData<Message[]>(["messages", chatId], (old) =>
        old ? old.filter((m) => m._id !== tempId) : []
      );
    });
  },

  setTyping: (chatId, isTyping) => {
    get().socket?.emit("typing", { chatId, isTyping });
  },
}));
