import { Post, User } from "@/types";
import { formatDate, formatNumber } from "@/utils/formatters";
import { AntDesign, Feather } from "@expo/vector-icons";
import { View, Text, Alert, Image, TouchableOpacity } from "react-native";

interface PostCardProps {
  post: Post;
  onLike: (postId: string) => void;
  onDelete: (postId: string) => void;
  onComment: (post: Post) => void;
  isLiked?: boolean;
  currentUser: User;
}

// Optional fallback image in case profilePicture fails
const fallbackImage =
  "https://cdn-icons-png.flaticon.com/512/847/847969.png"; // or use one from assets

const PostCard = ({
  currentUser,
  onDelete,
  onLike,
  post,
  isLiked,
  onComment,
}: PostCardProps) => {
  // Hydration guard: bail out if user is missing or just an ObjectId
  if (!post.user || typeof post.user === "string") return null;

  const { firstName, lastName, username, profilePicture, _id: authorId } = post.user;
  const isOwnPost = authorId === currentUser._id;

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

  return (
    <View className="border-b border-gray-100 bg-white px-4 py-3">
      <View className="flex-row">
        <Image
          source={{ uri: profilePicture || fallbackImage }}
          className="w-12 h-12 rounded-full mr-3"
        />

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
