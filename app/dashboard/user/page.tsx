import UserDashboardContent from "@/components/user-dashboard/user-dashboard-content";

export default function UserDashboardPage() {
  // TODO: Fetch user profile and stats, pass as props
  return <UserDashboardContent profile={{ full_name: null, username: null, bio: null, avatar_url: null }} stats={{ followers: 0, following: 0, notifications: 0 }} />;
}
