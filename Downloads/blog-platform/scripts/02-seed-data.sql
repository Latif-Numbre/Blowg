-- Insert sample users
INSERT INTO users (email, username, full_name, bio, avatar_url) VALUES
('john@example.com', 'johndoe', 'John Doe', 'Tech enthusiast and blogger', '/placeholder.svg?height=40&width=40'),
('jane@example.com', 'janesmith', 'Jane Smith', 'Writer and content creator', '/placeholder.svg?height=40&width=40'),
('mike@example.com', 'mikedev', 'Mike Developer', 'Full-stack developer sharing coding tips', '/placeholder.svg?height=40&width=40')
ON CONFLICT (email) DO NOTHING;

-- Insert sample posts
INSERT INTO posts (author_id, title, content, excerpt, published) VALUES
(
  (SELECT id FROM users WHERE username = 'johndoe'),
  'Getting Started with Modern Web Development',
  'Web development has evolved significantly over the past few years. In this post, we''ll explore the latest trends and technologies that are shaping the future of web development...',
  'Explore the latest trends in modern web development and learn about cutting-edge technologies.',
  true
),
(
  (SELECT id FROM users WHERE username = 'janesmith'),
  'The Art of Technical Writing',
  'Technical writing is more than just documenting code. It''s about creating clear, concise, and helpful content that guides readers through complex topics...',
  'Learn the essential skills needed to become an effective technical writer.',
  true
),
(
  (SELECT id FROM users WHERE username = 'mikedev'),
  'Building Scalable APIs with Node.js',
  'When building APIs that need to handle thousands of requests, scalability becomes crucial. Here are some best practices for building robust APIs...',
  'Best practices for creating scalable and maintainable APIs using Node.js.',
  true
)
ON CONFLICT DO NOTHING;

-- Insert sample comments
INSERT INTO comments (post_id, author_id, content) VALUES
(
  (SELECT id FROM posts WHERE title = 'Getting Started with Modern Web Development'),
  (SELECT id FROM users WHERE username = 'janesmith'),
  'Great article! I especially liked the section about modern frameworks.'
),
(
  (SELECT id FROM posts WHERE title = 'The Art of Technical Writing'),
  (SELECT id FROM users WHERE username = 'mikedev'),
  'This is exactly what I needed. Thanks for sharing these insights!'
)
ON CONFLICT DO NOTHING;
