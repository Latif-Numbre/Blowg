"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { UserPlus, UserMinus, Loader2 } from "lucide-react"

interface FollowButtonProps {
  username: string
  initialFollowing: boolean
  initialFollowersCount: number
}

export function FollowButton({ username, initialFollowing, initialFollowersCount }: FollowButtonProps) {
  const [isFollowing, setIsFollowing] = useState(initialFollowing)
  const [followersCount, setFollowersCount] = useState(initialFollowersCount)
  const [loading, setLoading] = useState(false)

  const handleFollow = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/users/${username}/follow`, {
        method: "POST",
      })

      if (response.ok) {
        const data = await response.json()
        setIsFollowing(data.following)
        setFollowersCount((prev) => (data.following ? prev + 1 : prev - 1))
      }
    } catch (error) {
      console.error("Error toggling follow:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button onClick={handleFollow} disabled={loading} variant={isFollowing ? "outline" : "default"} className="gap-2">
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : isFollowing ? (
        <UserMinus className="h-4 w-4" />
      ) : (
        <UserPlus className="h-4 w-4" />
      )}
      {isFollowing ? "Unfollow" : "Follow"}
    </Button>
  )
}
