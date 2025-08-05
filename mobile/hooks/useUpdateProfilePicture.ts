import { useMutation } from "@tanstack/react-query";
import { useApiClient, userApi } from "../utils/api";
import { usePathname, useRouter } from "expo-router";
import { useQueryClient } from "@tanstack/react-query";
import type { RelativePathString } from "expo-router";

export const useUpdateProfilePicture = () => {
  const api = useApiClient();
  const router = useRouter();
  const pathname = usePathname() as RelativePathString;
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (url: string) =>
      userApi.updateProfile(api, { profilePicture: url }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      router.replace(pathname);
    },
    onError: (err) => {
      console.error("Failed to update profile picture", err);
    },
  });

  return mutation;
};
