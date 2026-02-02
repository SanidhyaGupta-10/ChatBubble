import { View, Text } from 'react-native'
import { useState , useRef, useEffect, useCallback} from 'react'
import { ScrollView } from 'react-native-reanimated/lib/typescript/Animated';
import { useCurrentUser } from '@/hooks/useAuth';
import { useMessages } from '@/hooks/useMessages';
import { useLocalSearchParams } from 'expo-router';
import { useSocketStore } from '@/lib/socket';

type ChatParams = {
  id: string;
  name: string;
  avatar: string;
  participantId: string;
};

const ChatDetailScreen = () => {

  const {id: chatId, name, avatar, participantId} = useLocalSearchParams<ChatParams>();

  const [messageText, setMessageText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const { data: currentUser } = useCurrentUser();
  const { data: messages, isLoading } = useMessages(chatId);

  const {
    joinChat,
    leaveChat,
    sendMessage,
    sendTyping,
    isConnected,
    onlineUsers,
    typingUsers
  } = useSocketStore();

  const isOnline = participantId ? onlineUsers.has(participantId) : false;
  const isTyping = typingUsers.get(chatId) === participantId;

  const typeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // join chat room on mount, leave on unmount
  useEffect(() => {
    if (chatId && isConnected) joinChat(chatId);

    return () => {
      if (chatId) leaveChat(chatId);
    };
  }, [chatId, isConnected, joinChat, leaveChat]);

   // scroll to bottom when new messages arrive
  useEffect(() => {
    if (messages && messages.length > 0) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const handleTyping = useCallback((text: string) => {
    setMessageText(text)

    if(!isConnected || !chatId) return;
  })


  return (
    <View>
      <Text>ChatDetailScreen</Text>
    </View>
  );
};

export default ChatDetailScreen;