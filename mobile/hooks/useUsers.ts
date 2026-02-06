import { useQuery } from "@tanstack/react-query";
import type { User } from "@/types";
import { useApi } from "@/lib/axios";

export const useUsers = (page: number = 1) => {
  const { apiWithAuth } = useApi();

  return useQuery({
    queryKey: ["users", page],
    queryFn: async () => {
      const { data } = await apiWithAuth({ method: "GET", url: "/users", params: { page } });
      return data;
    },
  });
};