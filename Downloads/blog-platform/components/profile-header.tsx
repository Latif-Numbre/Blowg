import { formatDistanceToNow } from "date-fns"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { FollowButton } from "@/components/follow-button"
import { MapPin, LinkIcon, Calendar, Settings } from "lucide-react"
import type { UserProfile } from "@/lib/users"
import Link from "next/link"

interface ProfileHeaderProps {
  profile: UserProfile
  isOwnProfile: boolean
}

export function ProfileHeader({ profile, isOwnProfile }: ProfileHeaderProps) {
  return (
    <Card>
      <CardContent className="p-8">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Avatar and Basic Info */}
          <div className="flex flex-col items-center md:items-start">
            <Avatar className="h-32 w-32 mb-4">
              <AvatarImage src={profile.avatar_url || "/placeholder.svg"} alt={profile.full_name} />
              <AvatarFallback className="text-2xl">{profile.full_name.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>

            {isOwnProfile ? (
              <Button asChild variant="outline" className="gap-2 bg-transparent">
                <Link href="/settings">
                  <Settings className="h-4 w-4" />
                  Edit Profile
                </Link>
              </Button>
            ) : (
              <FollowButton
                username={profile.username}
                initialFollowing={profile.is_following || false}
                initialFollowersCount={profile.followers_count}
              />
            )}
          </div>

          {/* Profile Details */}
          <div className="flex-1">
            <div className="mb-4">
              <h1 className="text-2xl md:text-3xl font-bold mb-2">{profile.full_name}</h1>
              <p className="text-muted-foreground text-lg">@{profile.username}</p>
            </div>

            {profile.bio && <p className="text-pretty mb-4 leading-relaxed">{profile.bio}</p>}

            {/* Profile Metadata */}
            <div className="flex flex-wrap gap-4 mb-4 text-sm text-muted-foreground">
              {profile.location && (
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>{profile.location}</span>
                </div>
              )}

              {profile.website && (
                <div className="flex items-center gap-1">
                  <LinkIcon className="h-4 w-4" />
                  <a
                    href={profile.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    {profile.website.replace(/^https?:\/\//, "")}
                  </a>
                </div>
              )}

              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>Joined {formatDistanceToNow(new Date(profile.created_at), { addSuffix: true })}</span>
              </div>
            </div>

            {/* Stats */}
            <div className="flex gap-6">
              <div className="text-center">
                <div className="font-bold text-lg">{profile.posts_count}</div>
                <div className="text-sm text-muted-foreground">Posts</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-lg">{profile.followers_count}</div>
                <div className="text-sm text-muted-foreground">Followers</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-lg">{profile.following_count}</div>
                <div className="text-sm text-muted-foreground">Following</div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
