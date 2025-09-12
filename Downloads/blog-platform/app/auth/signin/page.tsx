import { AuthForm } from "@/components/auth-form"

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <AuthForm mode="signin" />
      </div>
    </div>
  )
}
