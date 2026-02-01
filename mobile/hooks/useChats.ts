import { useApi } from "@/lib/axios";
import { Chat } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useChats = () => {
  const { apiWithAuth } = useApi();

  return useQuery({
    queryKey: ["chats"],
    queryFn: async (): Promise<Chat[]> => {
      const response = await apiWithAuth<Chat[]>({
        method: "GET",
        url: "/chat",
      });

      const chats = Array.isArray(response.data) ? response.data : [];

      return chats.filter(chat => chat?.participant);
    },
    initialData: [], // 🔑 CRITICAL
  });
};

export const useGetOrCreateChats = () => {
  const { apiWithAuth } = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (participantId: string) => {
      const { data } = await apiWithAuth<Chat>({
        method: "POST",
        url: `/chats/with/${participantId}`,
      });
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["chats"] });
    },
  });
};