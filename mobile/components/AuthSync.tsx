import { useAuthCallback } from "@/hooks/useAuth";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { useEffect, useRef, useState } from "react";
import * as Sentry from '@sentry/react-native';

const AuthSync = () => {
    const { isSignedIn } = useAuth();
    const { user } = useUser();
    const { mutate: syncUser } = useAuthCallback();
    const hasSynced = useRef(false);
    const [retryCount, setRetryCount] = useState(0);

    useEffect(() => {
        if (isSignedIn && user && !hasSynced.current) {
            syncUser(undefined, {
                onSuccess: (data) => {
                    hasSynced.current = true;
                    Sentry.logger.info(Sentry.logger.fmt`User synced ${data.name}`, {
                        userId: user.id,
                        userName: data.name,
                    });
                },
                onError: (error) => {
                    Sentry.logger.error(Sentry.logger.fmt`Error syncing user ${error}`, {
                        userId: user.id,
                        error: error instanceof Error ? error.message : String(error),
                    });

                    if (retryCount < 3) {
                        setTimeout(() => {
                            setRetryCount(prev => prev + 1);
                        }, 5000 * (retryCount + 1));
                    }
                }
            });
        }

        if(!isSignedIn){
            hasSynced.current = false;
        }

    }, [isSignedIn, user, syncUser, retryCount])

    return null;
}

export default AuthSync
