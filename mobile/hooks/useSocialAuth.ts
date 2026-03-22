import { useSSO } from "@clerk/clerk-expo";
import { useState } from "react";
import { Alert } from "react-native";
import * as Sentry from "@sentry/react-native";

function useAuthSocial(){
    const [loadingStrategy, setLoadingStrategy] = useState<string | null>(null);
    const { startSSOFlow } = useSSO();

    const handleSocialAuth = async (strategy: "oauth_google" | "oauth_apple") => {
        setLoadingStrategy(strategy);
       
        try {
            const { createdSessionId, setActive } = await startSSOFlow({ strategy });
            if(createdSessionId && setActive){
                await setActive({
                    session: createdSessionId,
                });
            };
        } catch (error) {
            Sentry.logger.error("Social auth failed", {
                provider: strategy,
                error: error instanceof Error ? error.message : String(error),
            });
            const provider = strategy === "oauth_google" ? "Google" : "Apple";
            Alert.alert("Error", `Failed to sign in with ${provider}. Please try again.`)
        } finally {
            setLoadingStrategy(null);
        };
    }; 

    return { handleSocialAuth, loadingStrategy };
};

export default useAuthSocial;
