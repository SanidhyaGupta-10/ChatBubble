import { useSSO } from "@clerk/clerk-expo";
import { useState, useCallback } from "react";
import { Alert, Platform } from "react-native";

type Strategy = "oauth_google" | "oauth_apple";

const useAuthSocial = () => {
    const { startSSOFlow } = useSSO();
    const [loadingStrategy, setLoadingStrategy] = useState<Strategy | null>(null);

    const handleSocialAuth = useCallback(async (strategy: Strategy) => {
        if (strategy === "oauth_apple" && Platform.OS !== "ios") {
            Alert.alert("Unavailable", "Apple Sign In is only available on iOS.");
            return;
        }

        setLoadingStrategy(strategy);

        try {
            const { createdSessionId, setActive } = await startSSOFlow({ strategy });

            if (!createdSessionId || !setActive) {
                throw new Error("SSO flow did not return a valid session");
            }

            await setActive({ session: createdSessionId });

        } catch (err) {
            console.error("Social auth error:", err);
            const provider = strategy === "oauth_google" ? "Google" : "Apple";
            Alert.alert("Error", `Failed to sign in with ${provider}`);
        } finally {
            setLoadingStrategy(null);
        }
    }, []);

    return { handleSocialAuth, loadingStrategy };
};

export default useAuthSocial;
