import { View, Text, Pressable, ActivityIndicator, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { useWindowDimensions } from "react-native";
import useAuthSocial from "@/hooks/useSocialAuth";

const AuthScreen = () => {
  const { width, height } = useWindowDimensions();
  const { handleSocialAuth, loadingStrategy } = useAuthSocial();
  const isLoading = loadingStrategy !== null;

  return (
    <View className="flex-1 bg-surface-dark">
      <SafeAreaView className="flex-1">

        <View className="items-center pt-10">
          <Image
            source={require("../../assets/images/logo.png")}
            style={{ width: 100, height: 100, marginVertical: -20 }}
            contentFit="contain"
          />
          <Text className="text-4xl font-bold text-primary uppercase">
            ChatBubble
          </Text>
        </View>

        <View className="flex-1 px-6 justify-center items-center">
          <Image
            source={require("../../assets/images/auth.png")}
            style={{ width: width - 48, height: height * 0.3 }}
            contentFit="contain"
          />

          <View className="mt-6 items-center">
            <Text className="text-5xl font-bold text-foreground text-center">
              Connect & Chat
            </Text>
            <Text className="text-3xl font-bold text-primary">
              Seamlessly
            </Text>
          </View>

          <View className="flex-row gap-4 mt-10">
            {/* Google */}
            <Pressable
              disabled={isLoading}
              onPress={() => handleSocialAuth("oauth_google")}
              className="flex-1 flex-row items-center justify-center gap-2 bg-white py-4 rounded-2xl"
            >
              {loadingStrategy === "oauth_google" ? (
                <ActivityIndicator />
              ) : (
                <>
                  <Image
                    source={require("../../assets/images/google.png")}
                    style={{ width: 20, height: 20 }}
                  />
                  <Text className="text-gray-900 font-semibold">Google</Text>
                </>
              )}
            </Pressable>

            {/* Apple */}
            {Platform.OS === "ios" && (
              <Pressable
                disabled={isLoading}
                onPress={() => handleSocialAuth("oauth_apple")}
                className="flex-1 flex-row items-center justify-center gap-2 bg-white/10 py-4 rounded-2xl"
              >
                {loadingStrategy === "oauth_apple" ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <>
                    <Ionicons name="logo-apple" size={20} color="#fff" />
                    <Text className="text-white font-semibold">Apple</Text>
                  </>
                )}
              </Pressable>
            )}
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default AuthScreen;
