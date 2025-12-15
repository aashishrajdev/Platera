// Global type definitions for platera
// Leveraging Prisma-generated types for type safety

import { User, Recipe, Review, Comment, RecipeCategory } from '@prisma/client';

// Re-export Prisma types
export type { User, Recipe, Review, Comment, RecipeCategory };

// Extended types for API responses with relations
export type RecipeWithAuthor = Recipe & {
    author: User;
};

export type RecipeWithDetails = Recipe & {
    author: User;
    reviews: Review[];
    comments: CommentWithUser[];
    _count?: {
        reviews: number;
        comments: number;
    };
};

export type ReviewWithUser = Review & {
    user: User;
};

export type CommentWithUser = Comment & {
    user: User;
};

// Types for creating/updating entities (omit auto-generated fields)
export type CreateRecipeInput = Omit<Recipe, 'id' | 'createdAt' | 'updatedAt' | 'authorId'>;
export type UpdateRecipeInput = Partial<CreateRecipeInput>;

export type CreateReviewInput = Omit<Review, 'id' | 'createdAt' | 'updatedAt' | 'userId' | 'recipeId'>;
export type UpdateReviewInput = Partial<CreateReviewInput>;

export type CreateCommentInput = Omit<Comment, 'id' | 'createdAt' | 'updatedAt' | 'userId' | 'recipeId'>;
export type UpdateCommentInput = Partial<CreateCommentInput>;

// JSON types for Recipe fields
export interface RecipeIngredient {
    name: string;
    quantity: string;
    unit?: string;
}

export type RecipeStep = string;
export type RecipeImage = string; // Cloudinary URL
