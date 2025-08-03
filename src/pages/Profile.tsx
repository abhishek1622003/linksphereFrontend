import { useParams } from "wouter";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/Navigation";
import { Card, CardContent } from "@/components/ui/card";
import type { User, PostWithDetails } from "@/types";

export default function Profile() {
  const { userId } = useParams<{ userId?: string }>();
  const { user: currentUser, isAuthenticated, isLoading: authLoading } = useAuth();
  const { toast } = useToast();

  const profileUserId = userId || currentUser?.id;
  const isOwnProfile = !userId || userId === currentUser?.id;

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, authLoading, toast]);

  const { data: profileUser, isLoading: userLoading } = useQuery<User>({
    queryKey: ["/api/users", profileUserId],
    enabled: !!profileUserId && isAuthenticated,
    retry: false,
  });

  const { data: userPosts = [], isLoading: postsLoading } = useQuery<PostWithDetails[]>({
    queryKey: ["/api/posts/user", profileUserId],
    enabled: !!profileUserId && isAuthenticated,
    retry: false,
  });

  if (authLoading || userLoading) {
    return (
      <div className="min-h-screen bg-linkedin-bg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-linkedin-blue"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const displayUser = profileUser || currentUser;
  const userName = displayUser?.firstName && displayUser?.lastName 
    ? `${displayUser.firstName} ${displayUser.lastName}` 
    : 'Anonymous User';
  const userInitials = displayUser?.firstName && displayUser?.lastName
    ? `${displayUser.firstName[0]}${displayUser.lastName[0]}`
    : 'AU';

  return (
    <div className="bg-linkedin-bg min-h-screen">
      <Navigation />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Profile Header */}
        <Card className="mb-6">
          <CardContent className="p-0">
            <div className="h-32 bg-gradient-to-r from-linkedin-blue to-linkedin-light rounded-t-lg"></div>
            <div className="relative px-6 pb-6">
              <div className="flex flex-col md:flex-row md:items-end -mt-16">
                <div className="w-32 h-32 bg-gray-300 rounded-full border-4 border-white flex items-center justify-center text-3xl font-semibold text-gray-700 mb-4 md:mb-0">
                  {userInitials}
                </div>
                <div className="md:ml-6 flex-1">
                  <h1 className="text-3xl font-bold text-gray-900">{userName}</h1>
                  <p className="text-gray-600 mb-2">{displayUser?.email}</p>
                  {displayUser?.bio && (
                    <p className="text-gray-700 mb-4">{displayUser.bio}</p>
                  )}
                  <div className="flex space-x-4 text-sm text-gray-600">
                    <span>{userPosts.length} posts</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Posts Section */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {isOwnProfile ? 'Your Posts' : `${userName}'s Posts`}
            </h2>
            
            {postsLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-linkedin-blue mx-auto"></div>
                <p className="mt-2 text-gray-600">Loading posts...</p>
              </div>
            ) : userPosts.length === 0 ? (
              <div className="text-center py-8">
                <i className="fas fa-file-alt text-4xl text-gray-300 mb-4"></i>
                <p className="text-gray-600">
                  {isOwnProfile ? "You haven't posted anything yet." : "No posts to show."}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {userPosts.map((post) => (
                  <article key={post.id} className="border border-linkedin-border rounded-lg p-4">
                    <div className="flex items-start space-x-3 mb-3">
                      <div className="w-10 h-10 bg-linkedin-blue rounded-full flex items-center justify-center text-white font-semibold">
                        {userInitials}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{userName}</h4>
                        <p className="text-xs text-gray-500">
                          {new Date(post.createdAt!).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <p className="text-gray-900 leading-relaxed whitespace-pre-wrap">{post.content}</p>
                    </div>
                    
                    <div className="flex items-center justify-between pt-3 border-t border-linkedin-border">
                      <div className="flex space-x-6">
                        <span className="flex items-center space-x-2 text-gray-600">
                          <i className="far fa-thumbs-up"></i>
                          <span className="text-sm">Like</span>
                        </span>
                      </div>
                      <div className="text-sm text-gray-500">
                        {post._count.likes} likes
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
