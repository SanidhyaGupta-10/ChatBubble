import { useAuth } from "@clerk/clerk-react";
import api from "../lib/axios";
import { useQuery } from "@tanstack/react-query";

export const useUsers = () => {
    const { getToken } = useAuth();

    return useQuery({
        queryKey: ["users"],
        queryFn: async () => {
            const token = await getToken();
            const response = await api.get("/users", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data;
        },
    });
};