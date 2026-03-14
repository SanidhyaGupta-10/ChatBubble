import { UserButton } from "@clerk/clerk-react"
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router";
import { useSocketStore } from "../lib/socket";
import { useSocketConnection } from "../hooks/useSocketConnection";
import { useChats, useGetOrCreateChat } from "../hooks/useChats";
import { useMessages } from "../hooks/useMessages";
import { useCurrentUser } from "../hooks/useCurrentUser";
import { Link, MessageSquareIcon, PlusIcon, SparklesIcon } from "lucide-react";
import { ChatListItem } from "../components/ChatListItem";
import { ChatHeader } from "../components/ChatHeader";
import { MessageBubble } from "../components/MessageBubble";
import { ChatInput } from "../components/ChatInput";
import { NewChatModal } from "../components/NewChatModal";


function ChatPage() {
  const { data: currentUser } = useCurrentUser();

  const [searchParams, setSearchParams] = useSearchParams();
  const activeChatId = searchParams.get("chat") ?? "";

  const [messageInput, setMessageInput] = useState("");
  const [isNewChatModalOpen, setIsNewChatModalOpen] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const {
    socket,
    setTyping,
    sendMessage
  } = useSocketStore();

  useSocketConnection(activeChatId);

  const { data: chats = [], isLoading: chatsLoading } = useChats();
  const { data: messages = [], isLoading: messagesLoading } = useMessages(activeChatId);

  const chatList = Array.isArray(chats) ? chats : [];

  const startChatMutation = useGetOrCreateChat();

  // scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeChatId, messages]);

  const handleStartChat = (participantId: string | null) => {
    if (participantId) {
      startChatMutation.mutate(participantId, {
        onSuccess: (chat) => setSearchParams({ chat: chat._id }),
      });
    }
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim() || !activeChatId || !socket || !currentUser) return;

    const text = messageInput.trim();
    sendMessage(activeChatId, text, currentUser);
    setMessageInput("");
    setTyping(activeChatId, false);
  };

  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessageInput(e.target.value);
    if (!activeChatId) return;

    setTyping(activeChatId, true);
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      setTyping(activeChatId, false);
    }, 2000);
  };
  const activeChat = chatList.find((c: any) => c._id === activeChatId);

  return (
    <div className="h-screen flex bg-base-100 text-base-content">
      {/* Sidebar */}
      <div className="w-80 border-r border-base-300 flex flex-col bg-base-200">
        {/* HEADER */}
        <div className="p-4 border-b border-base-300">
          <div className="flex items-center justify-between mb-4">
            <Link to="/chat" className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-lg bg-linear-to-br from-amber-400
               to-orange-500 flex items-center justify-center"
              >
                <SparklesIcon className="w-4 h-4 text-primary-content" />
              </div>
              <span className="font-bold">Whisper</span>
            </Link>
            <UserButton />
          </div>
          <button
            onClick={() => setIsNewChatModalOpen(true)}
            className="btn btn-primary btn-block gap-2 rounded-xl bg-linear-to-r
             from-amber-500 to-orange-500 border-none"
          >
            <PlusIcon className="w-4 h-4" />
            New Chat
          </button>
        </div>
        {/* CHAT LIST */}
        <div className="flex-1 overflow-y-auto">
          {chatsLoading && (
            <div className="flex items-center justify-center py-8">
              <span className="loading loading-spinner loading-sm text-amber-400" />
            </div>
          )}

          {chatList.length === 0 && !chatsLoading && <NoConversationsUI />}
          <div className="flex flex-col gap-1">
            {chatList.map((chat: any) => (
              <ChatListItem
                key={chat._id}
                chat={chat}
                isActive={activeChatId === chat._id}
                onClick={() => setSearchParams({ chat: chat._id })}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Chat Window */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        {activeChatId && activeChat ? (
          <>
            <ChatHeader participant={activeChat.participant} chatId={activeChat} />
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messagesLoading && (
                <div className="flex items-center justify-center h-full">
                  <span className="loading loading-spinner loading-md text-amber-400" />
                </div>
              )}

              {messages.length === 0 && <NoMessagesUI />}

              {messages.length > 0 && (
                messages.map((msg: any) => <MessageBubble key={msg._id} message={msg} currentUser={currentUser} />)
              )}
              <div ref={messagesEndRef} />
            </div>

            <ChatInput
              value={messageInput}
              onChange={handleTyping}
              onSend={handleSend}
              disabled={!messageInput.trim()}
            />
          </>
        ) : <NoChatSelectedUI />}
      </div>

      <NewChatModal
        onStartChat={handleStartChat}
        isPending={startChatMutation.isPending}
        isOpen={isNewChatModalOpen}
        onClose={() => setIsNewChatModalOpen(false)}
      />
    </div>

  )
}

export default ChatPage;

function NoConversationsUI() {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <MessageSquareIcon className="w-10 h-10 text-amber-400 mb-3" />
      <p className="text-base-content/70 text-sm">No conversations yet</p>
      <p className="text-base-content/60 text-xs mt-1">Start a new chat to begin</p>
    </div>
  );
}
function NoMessagesUI() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
      <div className="w-16 h-16 rounded-2xl bg-base-300/40 flex items-center justify-center mb-4">
        <MessageSquareIcon className="w-8 h-8 text-base-content/20" />
      </div>
      <p className="text-base-content/70">No messages yet</p>
      <p className="text-base-content/60 text-sm mt-1">Send a message to start the conversation</p>
    </div>
  );
}
function NoChatSelectedUI() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center px-8">
      <div className="w-20 h-20 rounded-3xl bg-linear-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center mb-6">
        <MessageSquareIcon className="w-10 h-10 text-amber-400" />
      </div>
      <h2 className="text-2xl font-bold mb-2">Welcome to Whisper</h2>
      <p className="text-base-content/70 max-w-sm">
        Select a conversation from the sidebar or start a new chat to begin messaging
      </p>
    </div>
  );
}