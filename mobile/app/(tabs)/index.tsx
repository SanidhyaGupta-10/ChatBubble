import { View, Text, ScrollView, Button } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Sentry from '@sentry/react-native';

const ChatsTab = () => {
  const throwTestError = () => {
    Sentry.captureException(new Error('ChatsTab test error'), {
      tags: { screen: 'ChatsTab' },
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-surface">
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <Text className="text-white text-lg mb-4">ChatsTab</Text>
        <Button title="Trigger Sentry Error" onPress={throwTestError} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default ChatsTab;
