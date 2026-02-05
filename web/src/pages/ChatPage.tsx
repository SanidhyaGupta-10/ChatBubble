import { useAuth , useUser} from "@clerk/clerk-react"
import { useRef, useState } from "react";
import { useSearchParams } from "react-router";
import { useSocketStore } from "../lib/socket";

function ChatPage() {
  const { signOut } = useAuth();
  const user = useUser();
  const [searchParams, setSearchParams] = useSearchParams();
  console.log(searchParams.get("chatId"))

  const [messageInput, setMessageInput] = useState("");          
  const [isNewChatModalOpen, setIsNewChatModalOpen] = useState(false);  
  
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const {
    socket, 
    setTyping, 
    sendMessage 
} = useSocketStore()

  return (
    <div>
      <button
        onClick={() => signOut()}
      >Sign Out</button>
    </div>
  )
}

export default ChatPage
