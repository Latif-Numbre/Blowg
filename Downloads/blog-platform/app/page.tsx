import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Header } from "@/components/header"
import { getUser } from "@/lib/auth"
import {
  PenSquare,
  Users,
  Heart,
  MessageCircle,
  Bookmark,
  Repeat2,
  Zap,
  Shield,
  Palette,
  ArrowRight,
  Star,
} from "lucide-react"

export default async function HomePage() {
  const user = await getUser()

  return (
    <div className="min-h-screen bg-background">
      <Header user={user} />

      {/* Hero Section */}
      <section className="relative py-20 px-4 text-center">
        <div className="container max-w-4xl mx-auto">
          <Badge variant="secondary" className="mb-6">
            <Zap className="h-3 w-3 mr-1" />
            Now in Beta
          </Badge>

          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-balance">
            Share Your Stories with the <span className="text-primary">World</span>
          </h1>

          <p className="text-xl text-muted-foreground mb-8 text-pretty max-w-2xl mx-auto">
            BlogSphere is the modern blogging platform where writers connect, engage, and grow their audience through
            meaningful conversations.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {user ? (
              <Button asChild size="lg" className="text-lg px-8">
                <Link href="/dashboard">
                  Go to Dashboard
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            ) : (
              <>
                <Button asChild size="lg" className="text-lg px-8">
                  <Link href="/auth/signup">
                    Start Writing Today
                    <PenSquare className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button variant="outline" asChild size="lg" className="text-lg px-8 bg-transparent">
                  <Link href="/auth/signin">Sign In</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything You Need to Blog</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Powerful features designed to help you create, share, and engage with your community.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-8 text-center">
                <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <PenSquare className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Rich Writing Experience</h3>
                <p className="text-muted-foreground">
                  Beautiful, distraction-free editor with markdown support and real-time preview.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-8 text-center">
                <div className="h-12 w-12 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Users className="h-6 w-6 text-accent" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Build Your Community</h3>
                <p className="text-muted-foreground">
                  Connect with like-minded writers and readers. Follow your favorite authors.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-8 text-center">
                <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Engage & Discuss</h3>
                <p className="text-muted-foreground">
                  Nested comments, likes, and bookmarks to foster meaningful conversations.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-8 text-center">
                <div className="h-12 w-12 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Palette className="h-6 w-6 text-accent" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Beautiful Design</h3>
                <p className="text-muted-foreground">
                  Sleek, modern interface with dark mode support and responsive design.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-8 text-center">
                <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Secure & Private</h3>
                <p className="text-muted-foreground">
                  Your data is protected with enterprise-grade security and privacy controls.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-8 text-center">
                <div className="h-12 w-12 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Zap className="h-6 w-6 text-accent" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Lightning Fast</h3>
                <p className="text-muted-foreground">
                  Optimized for speed with instant loading and seamless interactions.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Social Features Showcase */}
      <section className="py-20 px-4">
        <div className="container max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Social Features That Matter</h2>
          <p className="text-xl text-muted-foreground mb-12">
            Engage with your audience through powerful social interactions.
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex flex-col items-center p-6 rounded-lg bg-card border">
              <Heart className="h-8 w-8 text-red-500 mb-3" />
              <h3 className="font-semibold mb-2">Likes</h3>
              <p className="text-sm text-muted-foreground text-center">Show appreciation for great content</p>
            </div>

            <div className="flex flex-col items-center p-6 rounded-lg bg-card border">
              <MessageCircle className="h-8 w-8 text-blue-500 mb-3" />
              <h3 className="font-semibold mb-2">Comments</h3>
              <p className="text-sm text-muted-foreground text-center">Start meaningful discussions</p>
            </div>

            <div className="flex flex-col items-center p-6 rounded-lg bg-card border">
              <Bookmark className="h-8 w-8 text-yellow-500 mb-3" />
              <h3 className="font-semibold mb-2">Bookmarks</h3>
              <p className="text-sm text-muted-foreground text-center">Save posts for later reading</p>
            </div>

            <div className="flex flex-col items-center p-6 rounded-lg bg-card border">
              <Repeat2 className="h-8 w-8 text-green-500 mb-3" />
              <h3 className="font-semibold mb-2">Reposts</h3>
              <p className="text-sm text-muted-foreground text-center">Share great content with your followers</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-primary/5">
        <div className="container max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Start Your Blogging Journey?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of writers who are already sharing their stories on BlogSphere.
          </p>

          {!user && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="text-lg px-8">
                <Link href="/auth/signup">
                  Create Your Account
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button variant="outline" asChild size="lg" className="text-lg px-8 bg-transparent">
                <Link href="/explore">Explore Posts</Link>
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 px-4">
        <div className="container max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-lg">B</span>
                </div>
                <span className="font-bold text-xl">BlogSphere</span>
              </div>
              <p className="text-muted-foreground mb-4">
                The modern blogging platform for writers who want to connect, engage, and grow their audience.
              </p>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span>Built with ❤️ using Next.js</span>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Platform</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/explore" className="hover:text-foreground transition-colors">
                    Explore
                  </Link>
                </li>
                <li>
                  <Link href="/auth/signup" className="hover:text-foreground transition-colors">
                    Sign Up
                  </Link>
                </li>
                <li>
                  <Link href="/auth/signin" className="hover:text-foreground transition-colors">
                    Sign In
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/help" className="hover:text-foreground transition-colors">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-foreground transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-foreground transition-colors">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 BlogSphere. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
