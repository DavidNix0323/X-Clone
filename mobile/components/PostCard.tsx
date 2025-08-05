import { Post, User } from "@/types";
import { formatDate, formatNumber } from "@/utils/formatters";
import { AntDesign, Feather } from "@expo/vector-icons";
import { View, Text, Alert, Image, TouchableOpacity } from "react-native";
import Avatar from "../components/Avatar";

interface PostCardProps {
  post: Post;
  onLike: (postId: string) => void;
  onDelete: (postId: string) => void;
  onComment: (post: Post) => void;
  isLiked?: boolean;
  currentUser?: User;
}


const PostCard = ({
  currentUser,
  onDelete,
  onLike,
  post,
  isLiked,
  onComment,
}: PostCardProps) => {

  const userId = currentUser?._id;
  const isOwnPost = userId && post.user._id === userId;


  const handleDelete = () => {
    Alert.alert("Delete Post", "Are you sure you want to delete this post?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => onDelete(post._id),
      },
    ]);
  };

  if (!post.user) return null; // fallback for ghost hydration

  const {
    firstName,
    lastName,
    username,
    profilePicture,
  } = post.user;

  return (



    <View className="border-b border-gray-100 bg-white">
      <View className="flex-row p-4">
        <Avatar
          uploadedImage={isOwnPost ? currentUser?.profilePicture : post.user.profilePicture}
          size={48}



        <View className="flex-1 space-y-1">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center flex-wrap">
              <Text className="font-semibold text-gray-900 mr-1">
                {firstName} {lastName}
              </Text>
              <Text className="text-sm text-gray-500">
                @{username} · {formatDate(post.createdAt)}
              </Text>
            </View>

            {isOwnPost && (
              <TouchableOpacity onPress={handleDelete}>
                <Feather name="trash" size={20} color="#657786" />
              </TouchableOpacity>
            )}
          </View>

          {post.content ? (
            <Text className="text-gray-800 text-base leading-snug">{post.content}</Text>
          ) : null}

          {post.image ? (
            <Image
              source={{ uri: post.image }}
              className="w-full h-48 rounded-xl"
              resizeMode="cover"
            />
          ) : null}

          <View className="flex-row justify-between max-w-xs pt-2">
            <TouchableOpacity className="flex-row items-center" onPress={() => onComment(post)}>
              <Feather name="message-circle" size={18} color="#657786" />
              <Text className="text-gray-500 text-sm ml-2">
                {formatNumber(post.comments?.length || 0)}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity className="flex-row items-center">
              <Feather name="repeat" size={18} color="#657786" />
              <Text className="text-gray-500 text-sm ml-2">0</Text>
            </TouchableOpacity>

            <TouchableOpacity className="flex-row items-center" onPress={() => onLike(post._id)}>
              {isLiked ? (
                <AntDesign name="heart" size={18} color="#E0245E" />
              ) : (
                <Feather name="heart" size={18} color="#657786" />
              )}
              <Text className={`text-sm ml-2 ${isLiked ? "text-red-500" : "text-gray-500"}`}>
                {formatNumber(post.likes?.length || 0)}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity>
              <Feather name="share" size={18} color="#657786" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default PostCard;
