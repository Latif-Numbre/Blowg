export interface UserProfile {
  id: string
  username: string
  full_name: string
  email: string
  bio?: string
  avatar_url?: string
  website?: string
  location?: string
  created_at: string
  followers_count: number
  following_count: number
  posts_count: number
  is_following?: boolean
}

export interface Follow {
  id: string
  follower_id: string
  following_id: string
  created_at: string
}

// Mock user profiles
export const mockUsers: UserProfile[] = [
  {
    id: "1",
    username: "johndoe",
    full_name: "John Doe",
    email: "john@example.com",
    bio: "Full-stack developer passionate about modern web technologies. Love sharing knowledge about React, Next.js, and TypeScript.",
    avatar_url: "/developer-working.png",
    website: "https://johndoe.dev",
    location: "San Francisco, CA",
    created_at: "2023-06-15T10:30:00Z",
    followers_count: 1250,
    following_count: 340,
    posts_count: 42,
  },
  {
    id: "2",
    username: "sarahsmith",
    full_name: "Sarah Smith",
    email: "sarah@example.com",
    bio: "Senior Software Engineer at TechCorp. Writing about clean code, best practices, and developer productivity.",
    avatar_url: "/programmer.png",
    website: "https://sarahsmith.blog",
    location: "New York, NY",
    created_at: "2023-03-20T14:20:00Z",
    followers_count: 890,
    following_count: 180,
    posts_count: 28,
  },
  {
    id: "3",
    username: "alexchen",
    full_name: "Alex Chen",
    email: "alex@example.com",
    bio: "Frontend developer and UI/UX enthusiast. Always learning something new!",
    avatar_url: "/placeholder.svg",
    location: "Seattle, WA",
    created_at: "2023-08-10T09:15:00Z",
    followers_count: 456,
    following_count: 220,
    posts_count: 15,
  },
]
