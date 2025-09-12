"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Bookmark, Repeat2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface SocialActionsProps {
  postId: string;
  initialLikes: number;
  initialComments: number;
  initialBookmarks: number;
  initialReposts: number;
  showCommentButton?: boolean;
}

export function SocialActions({
  postId,
  initialLikes,
  initialComments,
  initialBookmarks,
  initialReposts,
  showCommentButton = true,
}: SocialActionsProps) {
  const [likes, setLikes] = useState(initialLikes);
  const [bookmarks, setBookmarks] = useState(initialBookmarks);
  const [reposts, setReposts] = useState(initialReposts);
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [reposted, setReposted] = useState(false);
  const [loading, setLoading] = useState<string | null>(null);
  const router = useRouter();

  const handleLike = async () => {
    setLoading("like");
    try {
      const response = await fetch(`/api/posts/${postId}/like`, {
        method: "POST",
      });

      if (response.ok) {
        setLiked(!liked);
        setLikes((prev) => (liked ? prev - 1 : prev + 1));
      }
    } catch (error) {
      console.error("Error liking post:", error);
    } finally {
      setLoading(null);
    }
  };

  const handleBookmark = async () => {
    setLoading("bookmark");
    try {
      const response = await fetch(`/api/posts/${postId}/bookmark`, {
        method: "POST",
      });

      if (response.ok) {
        setBookmarked(!bookmarked);
        setBookmarks((prev) => (bookmarked ? prev - 1 : prev + 1));
      }
    } catch (error) {
      console.error("Error bookmarking post:", error);
    } finally {
      setLoading(null);
    }
  };

  const handleRepost = async () => {
    setLoading("repost");
    try {
      const response = await fetch(`/api/posts/${postId}/repost`, {
        method: "POST",
      });

      if (response.ok) {
        setReposted(!reposted);
        setReposts((prev) => (reposted ? prev - 1 : prev + 1));
      }
    } catch (error) {
      console.error("Error reposting:", error);
    } finally {
      setLoading(null);
    }
  };

  const handleComment = () => {
    router.push(`/posts/${postId}#comments`);
  };

  return (
    <div className="flex items-center justify-between pt-3 border-t">
      <div className="flex items-center gap-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLike}
          disabled={loading === "like"}
          className={`gap-2 ${
            liked
              ? "text-red-500 hover:text-red-600"
              : "text-muted-foreground hover:text-red-500"
          }`}
        >
          <Heart className={`h-4 w-4 ${liked ? "fill-current" : ""}`} />
          <span className="text-sm">{likes}</span>
        </Button>

        {showCommentButton && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleComment}
            className="text-muted-foreground hover:text-blue-500 gap-2"
          >
            <MessageCircle className="h-4 w-4" />
            <span className="text-sm">{initialComments}</span>
          </Button>
        )}

        <Button
          variant="ghost"
          size="sm"
          onClick={handleRepost}
          disabled={loading === "repost"}
          className={`gap-2 ${
            reposted
              ? "text-green-500 hover:text-green-600"
              : "text-muted-foreground hover:text-green-500"
          }`}
        >
          <Repeat2 className="h-4 w-4" />
          <span className="text-sm">{reposts}</span>
        </Button>
      </div>

      <Button
        variant="ghost"
        size="sm"
        onClick={handleBookmark}
        disabled={loading === "bookmark"}
        className={`${
          bookmarked
            ? "text-yellow-500 hover:text-yellow-600"
            : "text-muted-foreground hover:text-yellow-500"
        }`}
      >
        <Bookmark className={`h-4 w-4 ${bookmarked ? "fill-current" : ""}`} />
      </Button>
    </div>
  );
}
