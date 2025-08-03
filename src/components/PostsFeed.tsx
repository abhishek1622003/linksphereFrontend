import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import type { PostWithDetails } from "@/types";

export default function PostsFeed() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: posts = [], isLoading } = useQuery<PostWithDetails[]>({
    queryKey: ["/api/posts"],
    retry: false,
  });

  const likeMutation = useMutation({
    mutationFn: async (postId: number) => {
      const response = await apiRequest("POST", `/api/posts/${postId}/like`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/posts"] });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
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
      toast({
        title: "Error",
        description: "Failed to update like. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleLike = (postId: number) => {
    likeMutation.mutate(postId);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="animate-pulse">
                <div className="flex space-x-3 mb-4">
                  <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-300 rounded w-1/4 mb-2"></div>
                    <div className="h-3 bg-gray-300 rounded w-1/6"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-300 rounded"></div>
                  <div className="h-4 bg-gray-300 rounded"></div>
                  <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <i className="fas fa-newspaper text-4xl text-gray-300 mb-4"></i>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No posts yet</h3>
          <p className="text-gray-600">Be the first to share something with the community!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => {
        const authorName = post.author 
          ? `${post.author.firstName || ''} ${post.author.lastName || ''}`.trim() || 'Anonymous User'
          : 'Anonymous User';
        const authorInitials = post.author?.firstName && post.author?.lastName
          ? `${post.author.firstName[0]}${post.author.lastName[0]}`.toUpperCase()
          : 'AU';

        return (
          <Card key={post.id}>
            <CardContent className="p-4">
              {/* Post Header */}
              <div className="flex items-start space-x-3 mb-3">
                <Link href={`/profile/${post.author?.id}`}>
                  <div className="w-12 h-12 bg-linkedin-blue rounded-full flex items-center justify-center text-white font-semibold hover:bg-linkedin-dark transition-colors cursor-pointer">
                    {authorInitials}
                  </div>
                </Link>
                <div className="flex-1">
                  <Link href={`/profile/${post.author?.id}`}>
                    <h4 className="font-semibold text-gray-900 hover:text-linkedin-blue transition-colors cursor-pointer">
                      {authorName}
                    </h4>
                  </Link>
                  <p className="text-sm text-gray-600">{post.author?.email}</p>
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
              
              {/* Post Content */}
              <div className="mb-4">
                <p className="text-gray-900 leading-relaxed whitespace-pre-wrap">{post.content}</p>
              </div>
              
              {/* Post Actions */}
              <div className="flex items-center justify-between pt-3 border-t border-linkedin-border">
                <div className="flex space-x-6">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleLike(post.id)}
                    disabled={likeMutation.isPending}
                    className="flex items-center space-x-2 text-gray-600 hover:text-linkedin-blue transition-colors p-0 h-auto"
                  >
                    <i className="far fa-thumbs-up"></i>
                    <span className="text-sm">Like</span>
                  </Button>
                </div>
                <div className="text-sm text-gray-500">
                  {post._count.likes} likes
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
