import { formatTime } from "../lib/utils";

interface Sender {
  _id: string;
  name?: string;
  email?: string;
  avatar?: string;
}

interface MessageType {
  _id: string;
  chat: string;
  sender?: Sender;
  text: string;
  createdAt: string;
}

interface User {
  _id: string;
  fullName?: string;
  firstName?: string;
  primaryEmailAddress?: {
    emailAddress: string;
  };
  imageUrl?: string;
}

export function MessageBubble({
  message,
  currentUser,
}: {
  message: MessageType;
  currentUser?: User;
}) {
  const isMe = message.sender?._id === currentUser?._id;

  return (
    <div className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-md px-4 py-2.5 rounded-2xl ${
          isMe
            ? "bg-linear-to-r from-amber-500 to-orange-500 text-primary-content"
            : "bg-base-300/40 text-base-content"
        }`}
      >
        <p className="text-sm">{message.text}</p>
        <p className={`text-xs mt-1 ${isMe ? "text-primary-content/80" : "text-base-content/70"}`}>
          {formatTime(message.createdAt)}
        </p>
      </div>
    </div>
  );
}