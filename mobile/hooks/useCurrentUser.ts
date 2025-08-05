import { useQuery } from "@tanstack/react-query";
import { useApiClient, userApi } from "../utils/api";

export const useCurrentUser = () => {
  const api = useApiClient();

  const {
    data: currentUser,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      const response = await userApi.getCurrentUser(api);
      return response.data.user; // May be null — you control fallback downstream
    },
    refetchOnWindowFocus: false,
  });

  return { currentUser, isLoading, error, refetch };
};
