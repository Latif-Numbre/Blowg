export interface Post {
  id: string;
  title: string;
  content: string;
  excerpt?: string;
  author_id: string;
  author: {
    id: string;
    username: string;
    full_name: string;
    avatar_url?: string;
  };
  created_at: string;
  updated_at: string;
  published: boolean;
  tags: string[];
  likes_count: number;
  comments_count: number;
  bookmarks_count: number;
  reposts_count: number;
}

export interface CreatePostData {
  title: string;
  content: string;
  excerpt: string;
  published: boolean;
  tags: string[];
}

// Mock data for demonstration
export const mockPosts: Post[] = [
  {
    id: "1",
    title: "Getting Started with Modern Web Development",
    content: `# Getting Started with Modern Web Development

Web development has evolved tremendously over the past few years. In this post, we'll explore the latest trends and technologies that are shaping the future of web development.

## The Rise of Full-Stack Frameworks

Modern frameworks like Next.js, Nuxt.js, and SvelteKit have revolutionized how we build web applications. These frameworks provide:

- **Server-side rendering** for better SEO and performance
- **API routes** for building full-stack applications
- **File-based routing** for intuitive project structure
- **Built-in optimization** for images, fonts, and more

## Key Technologies to Learn

1. **React/Vue/Svelte** - Component-based UI libraries
2. **TypeScript** - Type safety for JavaScript
3. **Tailwind CSS** - Utility-first CSS framework
4. **Node.js** - JavaScript runtime for backend development

The future of web development is bright, and there's never been a better time to start learning!`,
    excerpt:
      "Explore the latest trends and technologies shaping modern web development, from full-stack frameworks to essential tools every developer should know.",
    author_id: "1",
    author: {
      id: "1",
      username: "johndoe",
      full_name: "John Doe",
      avatar_url: "/developer-working.png",
    },
    created_at: "2024-01-15T10:30:00Z",
    updated_at: "2024-01-15T10:30:00Z",
    published: true,
    tags: ["web-development", "javascript", "react", "nextjs"],
    likes_count: 42,
    comments_count: 8,
    bookmarks_count: 15,
    reposts_count: 3,
  },
  {
    id: "2",
    title: "The Art of Writing Clean Code",
    content: `# The Art of Writing Clean Code

Clean code is not just about making your code work—it's about making it readable, maintainable, and elegant. Here are some principles every developer should follow.

## Principles of Clean Code

### 1. Meaningful Names
Choose names that reveal intent. Your code should read like well-written prose.

\`\`\`javascript
// Bad
const d = new Date();
const u = users.filter(u => u.a);

// Good
const currentDate = new Date();
const activeUsers = users.filter(user => user.isActive);
\`\`\`

### 2. Functions Should Do One Thing
Keep your functions small and focused on a single responsibility.

### 3. Comments Should Explain Why, Not What
Good code is self-documenting. Use comments to explain the reasoning behind complex decisions.

## Conclusion

Writing clean code is a skill that develops over time. Practice these principles consistently, and your code will become more maintainable and enjoyable to work with.`,
    excerpt:
      "Learn the essential principles of writing clean, maintainable code that your future self and teammates will thank you for.",
    author_id: "2",
    author: {
      id: "2",
      username: "sarahsmith",
      full_name: "Sarah Smith",
      avatar_url: "/programmer.png",
    },
    created_at: "2024-01-14T14:20:00Z",
    updated_at: "2024-01-14T14:20:00Z",
    published: true,
    tags: ["programming", "best-practices", "clean-code"],
    likes_count: 67,
    comments_count: 12,
    bookmarks_count: 28,
    reposts_count: 7,
  },
];
