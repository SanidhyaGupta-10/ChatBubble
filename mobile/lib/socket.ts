import { create } from "zustand";
import { io, Socket } from "socket.io-client";
import { QueryClient } from "@tanstack/react-query";
import { Chat, Message, MessageSender } from "@/types";
import * as Sentry from "@sentry/react-native";

const SOCKET_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000";

interface SocketState {
  socket: Socket | null;
  isConnected: boolean;
  onlineUsers: Set<string>;
  typingUsers: Map<string, string>;
  unreadChats: Set<string>;
  currentChatId: string | null;
  queryClient: QueryClient | null;

  connect: (token: string, queryClient: QueryClient) => void;
  disconnect: () => void;
  joinChat: (chatId: string) => void;
  leaveChat: (chatId: string) => void;
  sendMessage: (
    chatId: string,
    text: string,
    currentUser: MessageSender
  ) => void;
  sendTyping: (chatId: string, isTyping: boolean) => void;
}

export const useSocketStore = create<SocketState>((set, get) => ({
  socket: null,
  isConnected: false,
  onlineUsers: new Set(),
  typingUsers: new Map(),
  unreadChats: new Set(),
  currentChatId: null,
  queryClient: null,

  connect: (token, queryClient) => {
    const existing = get().socket;
    if (existing?.connected) return;
    existing?.disconnect();

    const socket = io(SOCKET_URL, { auth: { token } });

    socket.on("connect", () => {
      Sentry.logger.info("Socket connected", { id: socket.id });
      set({ isConnected: true });
    });

    socket.on("disconnect", () => {
      Sentry.logger.info("Socket disconnected");
      set({ isConnected: false });
    });

    socket.on("online-users", ({ userIds }: { userIds: string[] }) => {
      set({ onlineUsers: new Set(userIds) });
    });

    socket.on("user-online", ({ userId }: { userId: string }) => {
      set((s) => ({
        onlineUsers: new Set([...s.onlineUsers, userId]),
      }));
    });

    socket.on("user-offline", ({ userId }: { userId: string }) => {
      set((s) => {
        const onlineUsers = new Set(s.onlineUsers);
        onlineUsers.delete(userId);
        return { onlineUsers };
      });
    });

    socket.on("typing", ({ userId, chatId, isTyping }) => {
      set((s) => {
        const typingUsers = new Map(s.typingUsers);
        isTyping ? typingUsers.set(chatId, userId) : typingUsers.delete(chatId);
        return { typingUsers };
      });
    });

    socket.on("new-message", (message: Message) => {
      const { currentChatId } = get();
      const senderId = (message.sender as MessageSender)._id;

      queryClient.setQueryData<Message[]>(
        ["messages", message.chat],
        (old = []) => {
          const filtered = old.filter(
            (m) =>
              !(m._id.startsWith("temp-") && m.text === message.text)
          );
          return filtered.some((m) => m._id === message._id)
            ? filtered
            : [...filtered, message];
        }
      );

      queryClient.setQueryData<Chat[]>(["chats"], (old = []) =>
        old.map((chat) =>
          chat._id === message.chat
            ? {
                ...chat,
                lastMessage: {
                  _id: message._id,
                  text: message.text,
                  sender: senderId,
                  createdAt: message.createdAt,
                },
                lastMessageAt: message.createdAt,
              }
            : chat
        )
      );

      set((s) => {
        const typingUsers = new Map(s.typingUsers);
        typingUsers.delete(message.chat);
        return {
          typingUsers,
          unreadChats:
            currentChatId === message.chat
              ? s.unreadChats
              : new Set([...s.unreadChats, message.chat]),
        };
      });
    });

    set({ socket, queryClient });
  },

  disconnect: () => {
    get().socket?.disconnect();
    set({
      socket: null,
      isConnected: false,
      onlineUsers: new Set(),
      typingUsers: new Map(),
      unreadChats: new Set(),
      currentChatId: null,
      queryClient: null,
    });
  },

  joinChat: (chatId) => {
    get().socket?.emit("join-chat", { chatId });
    set((s) => {
      const unreadChats = new Set(s.unreadChats);
      unreadChats.delete(chatId);
      return { currentChatId: chatId, unreadChats };
    });
  },

  leaveChat: (chatId) => {
    get().socket?.emit("leave-chat", { chatId });
    set({ currentChatId: null });
  },

  sendMessage: (chatId, text, currentUser) => {
    const { socket, queryClient } = get();
    if (!socket || !queryClient) return;

    const tempId = `temp-${Date.now()}`;

    const optimistic: Message = {
      _id: tempId,
      chat: chatId,
      sender: currentUser,
      text,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    queryClient.setQueryData<Message[]>(["messages", chatId], (old = []) => [
      ...old,
      optimistic,
    ]);

    socket.emit("send-message", { chatId, text }, (err : { message: string }) => {
      if (err) {
        queryClient.setQueryData<Message[]>(
          ["messages", chatId],
          (old = []) => old.filter((m) => m._id !== tempId)
        );
        Sentry.logger.error("Send failed", err);
      }
    });
  },

  sendTyping: (chatId, isTyping) => {
    get().socket?.emit("typing", { chatId, isTyping });
  },
}));
