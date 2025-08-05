import { useState } from "react";
import { Alert } from "react-native";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useApiClient, userApi } from "../utils/api";
import { useCurrentUser } from "./useCurrentUser";

type FormData = {
  firstName: string;
  lastName: string;
  bio: string;
  location: string;
  profilePicture: string;
  bannerImage: string;
};

export const useProfile = () => {
  const api = useApiClient();
  const queryClient = useQueryClient();
  const { currentUser } = useCurrentUser();

  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    bio: "",
    location: "",
    profilePicture: "",
    bannerImage: "",
  });

  const updateProfileMutation = useMutation({
    mutationFn: (profileData: FormData) =>
      userApi.updateProfile(api, profileData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      setIsEditModalVisible(false);
      Alert.alert("Success", "Profile updated successfully!");
    },
    onError: (error: any) => {
      Alert.alert(
        "Error",
        error.response?.data?.error || "Failed to update profile"
      );
    },
  });

  const openEditModal = () => {
    if (currentUser) {
      setFormData({
        firstName: currentUser.firstName || "",
        lastName: currentUser.lastName || "",
        bio: currentUser.bio || "",
        location: currentUser.location || "",
        profilePicture: currentUser.profilePicture || "",
        bannerImage: currentUser.bannerImage || "",
      });
    }
    setIsEditModalVisible(true);
  };

  const updateFormField = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return {
    isEditModalVisible,
    formData,
    openEditModal,
    closeEditModal: () => setIsEditModalVisible(false),
    saveProfile: () => updateProfileMutation.mutate(formData),
    updateFormField,
    isUpdating: updateProfileMutation.isPending,
    refetch: () => queryClient.invalidateQueries({ queryKey: ["authUser"] }),
  };
};
