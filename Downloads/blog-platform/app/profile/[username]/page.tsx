import { notFound } from "next/navigation";
import { Header } from "@/components/header";
import { ProfileHeader } from "@/components/profile-header";
import { ProfileTabs } from "@/components/profile-tabs";
import { getUser, getUserProfile } from "@/lib/auth";
import { mockUsers } from "@/lib/users";
import { get } from "http";

interface ProfilePageProps {
  params: { username: string };
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const currentUser = await getUser();

  const userProfile = await getUserProfile(params.username);
  console.log("Fetched user profile:", userProfile);

  if (!userProfile) {
    notFound();
  }

  const isOwnProfile = currentUser?.username === params.username;

  // In a real app, you'd fetch follow status from API
  const profileWithFollowStatus = {
    ...userProfile,
    is_following: currentUser && !isOwnProfile ? Math.random() > 0.5 : false,
  };

  return (
    <div className="min-h-screen bg-background">
      <Header user={currentUser} />

      <main className="container py-8 max-w-4xl px-8">
        <div className="space-y-8">
          <ProfileHeader
            profile={profileWithFollowStatus}
            isOwnProfile={isOwnProfile}
          />
          <ProfileTabs username={params.username} />
        </div>
      </main>
    </div>
  );
}
