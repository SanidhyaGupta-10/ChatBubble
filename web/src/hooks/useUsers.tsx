import { useAuth } from "@clerk/clerk-react";
import api from "../lib/axios";
import { useQuery } from "@tanstack/react-query";

export const useUsers = (page: number = 1) => {
    const { getToken } = useAuth();

    return useQuery({
        queryKey: ["users", page],
        queryFn: async () => {
            const token = await getToken();
            const response = await api.get("/users", {
                params: { page },
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data;
        },
    });
};