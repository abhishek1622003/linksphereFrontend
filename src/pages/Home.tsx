import { useAuth } from "@/hooks/useAuth";
import Navigation from "@/components/Navigation";
import UserProfileSidebar from "@/components/UserProfileSidebar";
import CreatePost from "@/components/CreatePost";
import PostsFeed from "@/components/PostsFeed";

export default function Home() {
  const { isAuthenticated, isLoading } = useAuth();

  // No redirect logic needed; router handles auth and landing page

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-linkedin-bg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-linkedin-blue"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-linkedin-bg min-h-screen">
      <Navigation />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <UserProfileSidebar />
          </div>
          
          <div className="lg:col-span-2">
            <CreatePost />
            <PostsFeed />
          </div>
        </div>
      </main>
    </div>
  );
}
