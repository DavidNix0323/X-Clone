import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  TextInput,
  Image,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";

// If you already have FormData type exported from hooks/useProfile.ts, import it like:
// import { FormData } from "../hooks/useProfile";

// Otherwise define it here:
type FormData = {
  firstName: string;
  lastName: string;
  bio: string;
  location: string;
  profilePicture: string;
  bannerImage: string;
};

interface EditProfileModalProps {
  isVisible: boolean;
  onClose: () => void;
  formData: FormData;
  saveProfile: () => void;
  updateFormField: (field: keyof FormData, value: string) => void;
  isUpdating: boolean;
}

const EditProfileModal = ({
  formData,
  isUpdating,
  isVisible,
  onClose,
  saveProfile,
  updateFormField,
}: EditProfileModalProps) => {
  const [profilePicture, setProfilePicture] = useState<string>("");
  const [uploading, setUploading] = useState<boolean>(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets?.[0]?.uri;
      if (uri) {
        setProfilePicture(uri);
        updateFormField("profilePicture", uri); // live sync
      }
    }
  };

  const uploadProfilePicture = async () => {
    if (!profilePicture) return;
    setUploading(true);
    try {
      await fetch("/api/profile/picture", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profilePicture }),
      });
    } catch (err) {
      console.warn("Upload failed:", err);
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    await uploadProfilePicture();
    saveProfile();
    onClose();
  };

  return (
    <Modal visible={isVisible} animationType="slide" presentationStyle="pageSheet">
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-100">
        <TouchableOpacity onPress={onClose}>
          <Text className="text-blue-500 text-lg">Cancel</Text>
        </TouchableOpacity>

        <Text className="text-lg font-semibold">Edit Profile</Text>

        <TouchableOpacity
          onPress={handleSave}
          disabled={isUpdating || uploading}
          className={`${isUpdating || uploading ? "opacity-50" : ""}`}
        >
          {(isUpdating || uploading) ? (
            <ActivityIndicator size="small" color="#1DA1F2" />
          ) : (
            <Text className="text-blue-500 text-lg font-semibold">Save</Text>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 px-4 py-6">
        <View className="space-y-4">
          {/* Profile Picture */}
          <View>
            <Text className="text-gray-500 text-sm mb-2">Profile Picture</Text>
            {formData.profilePicture ? (
              <Image source={{ uri: formData.profilePicture }} className="w-20 h-20 rounded-full mb-2" />
            ) : (
              <Text className="text-gray-400 mb-2">No image selected</Text>
            )}
            <TouchableOpacity onPress={pickImage}>
              <Text className="text-blue-500">Choose Image</Text>
            </TouchableOpacity>
          </View>

          {/* First Name */}
          <View>
            <Text className="text-gray-500 text-sm mb-2">First Name</Text>
            <TextInput
              className="border border-gray-200 rounded-lg p-3 text-base"
              value={formData.firstName}
              onChangeText={(text) => updateFormField("firstName", text)}
              placeholder="Your first name"
            />
          </View>

          {/* Last Name */}
          <View>
            <Text className="text-gray-500 text-sm mb-2">Last Name</Text>
            <TextInput
              className="border border-gray-200 rounded-lg px-3 py-3 text-base"
              value={formData.lastName}
              onChangeText={(text) => updateFormField("lastName", text)}
              placeholder="Your last name"
            />
          </View>

          {/* Bio */}
          <View>
            <Text className="text-gray-500 text-sm mb-2">Bio</Text>
            <TextInput
              className="border border-gray-200 rounded-lg px-3 py-3 text-base"
              value={formData.bio}
              onChangeText={(text) => updateFormField("bio", text)}
              placeholder="Tell us about yourself"
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>

          {/* Location */}
          <View>
            <Text className="text-gray-500 text-sm mb-2">Location</Text>
            <TextInput
              className="border border-gray-200 rounded-lg px-3 py-3 text-base"
              value={formData.location}
              onChangeText={(text) => updateFormField("location", text)}
              placeholder="Where are you located?"
            />
          </View>
        </View>
      </ScrollView>
    </Modal>
  );
};

export default EditProfileModal;

