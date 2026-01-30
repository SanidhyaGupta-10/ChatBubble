import { View, Text, ActivityIndicator, FlatList } from 'react-native';
import * as Sentry from '@sentry/react-native';
import { useRouter } from 'expo-router';
import { useChats } from '@/hooks/useChats';
import Header from '@/components/Header';
import ChatItem from '@/components/ChatItem';
import EmptyUI from '@/components/EmptyUi';
import { Chat } from '@/types';

const ChatsTab = () => {
  const router = useRouter();
  const { data: chats, isLoading, error } = useChats();

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-surface">
        <ActivityIndicator size={"large"} color="#F4A261" />
      </View>
    )
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center bg-surface">
        <Text className='text-red-500'>Something went wrong!</Text>
      </View>
    )
  }

  const handleChatPress = (chat: Chat) => {
    router.push({
      pathname:"/chat/[id]",
      params: { 
        id: chat._id,
        name: chat.participant.name,
        avatar: chat.participant.avatar ?? "",
        participantId: chat.participant._id,
      },
    });
  };

  return (
    <View className='flex-1 bg-surface'>
      <FlatList
        data={chats}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => <ChatItem chat={item} onPress={() => handleChatPress(item)}/>}
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior='automatic'
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 16,
          paddingBottom: 16,
        }}
        ListHeaderComponent={<Header />}
        ListEmptyComponent={
        <EmptyUI 
          title='No chats yet'
          subtitle='Start a Conversation'
          iconName='chatbubbles-outline'
          iconColor='#6B6B70'
          iconSize={64}
          buttonLabel='New Chat'
          onPressButton={() => console.log("Hello")}
        />}
      />
    </View>
  );
};

export default ChatsTab;
