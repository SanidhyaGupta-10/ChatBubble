import { useAuthCallback } from "@/hooks/useAuth";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { use, useEffect, useRef } from "react";
import * as Sentry from '@sentry/react-native';

const AuthSync = () => {
    const { isSignedIn } = useAuth();
    const { user } = useUser();
    const { mutate: syncUser } = useAuthCallback();
    const hasSynced = useRef(false); // this is used to not run useEffect more than once

    useEffect(() => {
        if (isSignedIn && user && !hasSynced.current) {
            hasSynced.current = true;
            syncUser(undefined, {
                onSuccess: (data) => {
                    console.log("User synced", data.name);
                    Sentry.logger.info(Sentry.logger.fmt`User synced ${data.name}`, {
                        userId: user.id,
                        userName: data.name,
                    });
                },
                onError: (error) => {
                    console.log("Error syncing user", error);
                    Sentry.logger.error(Sentry.logger.fmt`Error syncing user ${error}`, {
                        userId: user.id,
                        error: error instanceof Error ? error.message : String(error),
                    });
                }
            });
        }

        if(!isSignedIn){
            hasSynced.current = false;;
        }

    }, [isSignedIn, user, syncUser])

    return null;
}

export default AuthSync