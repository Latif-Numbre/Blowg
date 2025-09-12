import { requireAuth } from "@/lib/auth"
import { Header } from "@/components/header"
import { SettingsTabs } from "@/components/settings-tabs"

export default async function SettingsPage() {
  const user = await requireAuth()

  return (
    <div className="min-h-screen bg-background">
      <Header user={user} />

      <main className="container py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Settings</h1>
          <p className="text-muted-foreground">Manage your account settings and preferences.</p>
        </div>

        <SettingsTabs user={user} />
      </main>
    </div>
  )
}
