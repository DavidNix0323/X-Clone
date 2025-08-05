import React from "react";
import { Image } from "react-native";

type AvatarProps = {
    uploadedImage?: string;
    clerkImage?: string;
    name?: string;              
    size?: number;
  };
  

const Avatar = ({ uploadedImage, clerkImage, size = 128 }: AvatarProps) => {
  const fallbackUri = `https://ui-avatars.com/api/?name=User&background=DDD&color=555&size=${size}`;
  const imageUri = uploadedImage || clerkImage || fallbackUri;

  return (
    <Image
      source={{ uri: imageUri }}
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        borderWidth: 4,
        borderColor: "white",
      }}
      resizeMode="cover"
    />
  );
};

export default Avatar;
