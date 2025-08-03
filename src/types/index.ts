import { z } from "zod";

// Client-side type definitions
export interface User {
  id: string;
  email: string;
  name: string;
  profileImageUrl?: string | null;
  bio?: string | null;
  createdAt?: Date | null;
  updatedAt?: Date | null;
}

export interface Post {
  id: number;
  content: string;
  authorId: string;
  createdAt?: Date | null;
  updatedAt?: Date | null;
  author?: User;
  likes?: Like[];
  comments?: Comment[];
  _count?: {
    likes: number;
    comments: number;
  };
}

export interface Comment {
  id: number;
  content: string;
  postId: number;
  authorId: string;
  createdAt?: Date | null;
  updatedAt?: Date | null;
  author?: User;
}

export interface Like {
  id: number;
  postId: number;
  userId: string;
  createdAt?: Date | null;
  user?: User;
}

export interface Follow {
  id: number;
  followerId: string;
  followingId: string;
  createdAt?: Date | null;
  follower?: User;
  following?: User;
}

// API Response types
export interface ApiResponse<T = any> {
  data?: T;
  message?: string;
  error?: string;
}

export interface PostWithDetails extends Post {
  author: User;
  _count: {
    likes: number;
    comments: number;
  };
  isLiked?: boolean;
}

// Form data types
export interface CreatePostData {
  content: string;
}

export interface UpdateProfileData {
  name?: string;
  bio?: string;
  profileImageUrl?: string;
}

export interface CreateCommentData {
  content: string;
  postId: number;
}

// Auth types
export interface AuthUser {
  uid: string;
  email?: string | null;
  displayName?: string | null;
  photoURL?: string | null;
}

// Zod schemas for validation
export const createPostSchema = z.object({
  content: z.string().min(1, "Content is required").max(2000, "Content must be less than 2000 characters"),
});

export const updateProfileSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  bio: z.string().max(1000).optional(),
  profileImageUrl: z.string().url().optional(),
});

export const createCommentSchema = z.object({
  content: z.string().min(1, "Comment is required").max(1000, "Comment must be less than 1000 characters"),
  postId: z.number().int().positive(),
});

export type CreatePostInput = z.infer<typeof createPostSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type CreateCommentInput = z.infer<typeof createCommentSchema>;
