"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Heart, MessageCircle, Reply, Loader2 } from "lucide-react";
import type { Comment } from "@/lib/social";
import axios from "axios";

interface CommentSectionProps {
  postId: string;
  currentUser?: {
    id: string;
    username: string;
    full_name: string;
    avatar_url?: string;
  } | null;
}
const API_URL = "http://127.0.0.1:8000/";

interface CommentItemProps {
  comment: Comment;
  currentUser?: {
    id: string;
    username: string;
    full_name: string;
    avatar_url?: string;
  } | null;
  onReply: (parentId: string) => void;
  level?: number;
}

function CommentItem({
  comment,
  currentUser,
  onReply,
  level = 0,
}: CommentItemProps) {
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(comment.likes_count);

  const handleLike = async () => {
    // In a real app, you'd call API to like comment

    const response = await fetch(`/api/comments/${comment.id}/like`, {
      method: "POST",
    });
    if (response.ok) {
      const data = await response.json();
      setLiked(data.liked);
      setLikes((prev) => (data.liked ? prev + 1 : prev - 1));
    }
  };

  return (
    <div className={`${level > 0 ? "ml-8 border-l-2 border-muted pl-4" : ""}`}>
      <Card className="mb-4">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage
                src={comment.author.avatar_url || "/placeholder.svg"}
                alt={comment.author.full_name}
              />
              <AvatarFallback>
                {comment.author.full_name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-semibold text-sm">
                  {comment.author.full_name}
                </span>
                <span className="text-xs text-muted-foreground">
                  @{comment.author.username}
                </span>
                <span className="text-xs text-muted-foreground">·</span>
                <span className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(comment.created_at), {
                    addSuffix: true,
                  })}
                </span>
              </div>

              <p className="text-sm mb-3 text-pretty">{comment.content}</p>

              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLike}
                  className={`h-6 px-2 gap-1 ${
                    liked
                      ? "text-red-500 hover:text-red-600"
                      : "text-muted-foreground hover:text-red-500"
                  }`}
                >
                  <Heart className={`h-3 w-3 ${liked ? "fill-current" : ""}`} />
                  <span className="text-xs">{likes}</span>
                </Button>

                {currentUser && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onReply(comment.id)}
                    className="h-6 px-2 gap-1 text-muted-foreground hover:text-blue-500"
                  >
                    <Reply className="h-3 w-3" />
                    <span className="text-xs">Reply</span>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Render replies */}
      {comment.replies.map((reply) => (
        <CommentItem
          key={reply.id}
          comment={reply}
          currentUser={currentUser}
          onReply={onReply}
          level={level + 1}
        />
      ))}
    </div>
  );
}

export function CommentSection({ postId, currentUser }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const fetchComments = async () => {
    setLoading(true);

    try {
      const response = await axios.get(
        `${API_URL}blog/posts/${postId}/comments/`
      );
      const data = response.data;
      // console.log(data);
      if (response.status === 200) {
        setComments(data.results);
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !currentUser) return;
    console.log("Submitting comment:", { newComment, replyingTo });

    setSubmitting(true);
    setError("");

    try {
      const response = await axios.post(
        `${API_URL}blog/posts/${postId}/comments/`,
        {
          content: newComment,
          parentId: replyingTo,
        }
      );

      if (response.status === 201) {
        setNewComment("");
        setReplyingTo(null);
        // In a real app, you'd refresh comments or add optimistically
        fetchComments();
      } else {
        setError(response.data.error || "Failed to post comment");
      }
    } catch (error) {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleReply = async (parentId: string) => {
    setReplyingTo(parentId);
    // Focus on comment input (you could scroll to it too)

    try {
      const res = await fetch(`api/posts/${postId}/comments/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: newComment,
          parentId: parentId,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setNewComment("");
        setReplyingTo(null);
        // In a real app, you'd refresh comments or add optimistically
        fetchComments();
      } else {
        const data = await res.json();
        setError(data.error || "Failed to post comment");
      }
    } catch (error) {
      console.error("Error posting reply:", error);
    }
  };

  return (
    <div id="comments" className="space-y-6">
      <h3 className="text-xl font-semibold">Comments ({comments.length})</h3>

      {/* Comment Form */}
      {currentUser ? (
        <Card>
          <CardContent className="p-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex items-start gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={currentUser.avatar_url || "/placeholder.svg"}
                    alt={currentUser.full_name}
                  />
                  <AvatarFallback>
                    {currentUser.full_name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <Textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder={
                      replyingTo ? "Write a reply..." : "Write a comment..."
                    }
                    rows={3}
                    className="resize-none"
                  />
                </div>
              </div>

              {replyingTo && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MessageCircle className="h-4 w-4" />
                  <span>Replying to comment</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setReplyingTo(null)}
                    className="h-6 px-2"
                  >
                    Cancel
                  </Button>
                </div>
              )}

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={!newComment.trim() || submitting}
                >
                  {submitting && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {replyingTo ? "Reply" : "Comment"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-muted-foreground">
              <a href="/auth/signin" className="text-primary hover:underline">
                Sign in
              </a>{" "}
              to join the conversation
            </p>
          </CardContent>
        </Card>
      )}

      {/* Comments List */}
      {loading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      ) : comments.length > 0 ? (
        <div className="space-y-4">
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              currentUser={currentUser}
              onReply={handleReply}
            />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-8 text-center">
            <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h4 className="font-semibold mb-2">No comments yet</h4>
            <p className="text-muted-foreground">
              Be the first to share your thoughts!
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
