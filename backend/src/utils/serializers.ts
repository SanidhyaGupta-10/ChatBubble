type SerializableUser = {
  id: string;
  name: string;
  email: string;
  avatar: string;
};

type SerializableMessage = {
  id: string;
  chatId: string;
  text: string;
  createdAt: Date;
  updatedAt: Date;
  sender?: SerializableUser | { id: string; name?: string | null; email?: string | null; avatar?: string | null };
  senderId?: string;
};

type SerializableChat = {
  id: string;
  participant: SerializableUser | null;
  lastMessage?: SerializableMessage | null;
  lastMessageAt: Date;
  createdAt: Date;
};

export function serializeUser(user: SerializableUser) {
  return {
    _id: user.id,
    name: user.name,
    email: user.email,
    avatar: user.avatar,
  };
}

export function serializeMessage(message: SerializableMessage) {
  return {
    _id: message.id,
    chat: message.chatId,
    sender: message.sender
      ? {
          _id: message.sender.id,
          name: message.sender.name ?? "",
          email: message.sender.email ?? "",
          avatar: message.sender.avatar ?? "",
        }
      : message.senderId,
    text: message.text,
    createdAt: message.createdAt,
    updatedAt: message.updatedAt,
  };
}

export function serializeChat(chat: SerializableChat) {
  return {
    _id: chat.id,
    participant: chat.participant ? serializeUser(chat.participant) : null,
    lastMessage: chat.lastMessage ? serializeMessage(chat.lastMessage) : null,
    lastMessageAt: chat.lastMessageAt,
    createdAt: chat.createdAt,
  };
}
