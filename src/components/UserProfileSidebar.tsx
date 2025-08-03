import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import type { PostWithDetails } from "@/types";

export default function UserProfileSidebar() {
  const { user } = useAuth();

  const { data: userPosts = [] } = useQuery<PostWithDetails[]>({
    queryKey: ["/api/posts/user", user?.id],
    enabled: !!user?.id,
  });

  if (!user) return null;

  const userName = user.firstName && user.lastName 
    ? `${user.firstName} ${user.lastName}` 
    : 'Anonymous User';
  const userInitials = user.firstName && user.lastName
    ? `${user.firstName[0]}${user.lastName[0]}`
    : 'AU';

  return (
    <>
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          {/* Profile Header */}
          <div className="h-16 bg-gradient-to-r from-linkedin-blue to-linkedin-light"></div>
          <div className="relative px-4 pb-4">
            <div className="flex flex-col items-center -mt-8">
              {/* Profile Picture */}
              <div className="w-16 h-16 bg-gray-300 rounded-full border-4 border-white flex items-center justify-center text-xl font-semibold text-gray-700">
                {userInitials}
              </div>
              <h3 className="mt-2 text-lg font-semibold text-gray-900">{userName}</h3>
              <p className="text-sm text-gray-600">{user.email}</p>
              {user.bio && (
                <p className="text-sm text-gray-500 text-center mt-2">{user.bio}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <Card className="mt-4">
        <CardContent className="p-4">
          <h4 className="font-semibold text-gray-900 mb-3">Activity</h4>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Posts</span>
              <span className="font-medium">{userPosts.length}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Member since</span>
              <span className="font-medium">
                {user.createdAt ? new Date(user.createdAt).getFullYear() : 'Recently'}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
