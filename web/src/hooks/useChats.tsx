import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@clerk/clerk-react";
import api from "../lib/axios";

export const useChats = () => {
  const { getToken } = useAuth();

    return useQuery({
        queryKey: ["chats"],
        queryFn: async () => {
            const token = await getToken();
            const response = await api.get("/chat", {
                headers: { Authorization: `Bearer ${token}` },
            });
            return response.data;
        }
    });
};

export const useGetOrCreateChat = () => {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation<any, Error, string>({
    mutationFn: async (participantId: string) => {
      const token = await getToken();
      const res = await api.post(
        `/chat/with/${participantId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return res.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["chats"] }),
  });
};