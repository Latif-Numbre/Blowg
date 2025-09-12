export interface Comment {
  id: string
  content: string
  author_id: string
  author: {
    id: string
    username: string
    full_name: string
    avatar_url?: string
  }
  post_id: string
  parent_id?: string
  created_at: string
  updated_at: string
  likes_count: number
  replies: Comment[]
}

export interface SocialInteraction {
  id: string
  user_id: string
  post_id?: string
  comment_id?: string
  type: "like" | "bookmark" | "repost"
  created_at: string
}

// Mock comments data
export const mockComments: Comment[] = [
  {
    id: "1",
    content: "Great article! This really helped me understand the concepts better.",
    author_id: "3",
    author: {
      id: "3",
      username: "alexchen",
      full_name: "Alex Chen",
      avatar_url: "/placeholder.svg",
    },
    post_id: "1",
    created_at: "2024-01-15T12:30:00Z",
    updated_at: "2024-01-15T12:30:00Z",
    likes_count: 5,
    replies: [
      {
        id: "2",
        content: "I agree! The examples were particularly helpful.",
        author_id: "4",
        author: {
          id: "4",
          username: "mariagarcia",
          full_name: "Maria Garcia",
          avatar_url: "/placeholder.svg",
        },
        post_id: "1",
        parent_id: "1",
        created_at: "2024-01-15T13:15:00Z",
        updated_at: "2024-01-15T13:15:00Z",
        likes_count: 2,
        replies: [],
      },
    ],
  },
  {
    id: "3",
    content: "Could you elaborate more on the TypeScript part? I'm still learning it.",
    author_id: "5",
    author: {
      id: "5",
      username: "davidlee",
      full_name: "David Lee",
      avatar_url: "/placeholder.svg",
    },
    post_id: "1",
    created_at: "2024-01-15T14:20:00Z",
    updated_at: "2024-01-15T14:20:00Z",
    likes_count: 3,
    replies: [],
  },
]
