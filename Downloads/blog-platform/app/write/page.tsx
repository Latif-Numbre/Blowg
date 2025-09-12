import { requireAuth } from "@/lib/auth"
import { Header } from "@/components/header"
import { PostEditor } from "@/components/post-editor"

export default async function WritePage() {
  const user = await requireAuth()

  return (
    <div className="min-h-screen bg-background">
      <Header user={user} />
      <main className="container py-8">
        <PostEditor />
      </main>
    </div>
  )
}
