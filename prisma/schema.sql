-- PostgreSQL Migration for platera Database Schema
-- This represents the structure that will be created when you run: npx prisma migrate dev

-- ====================================
-- DROP EXISTING TABLES (if re-running)
-- ====================================
DROP TABLE IF EXISTS "comments" CASCADE;
DROP TABLE IF EXISTS "reviews" CASCADE;
DROP TABLE IF EXISTS "recipes" CASCADE;
DROP TABLE IF EXISTS "users" CASCADE;
DROP TYPE IF EXISTS "RecipeCategory" CASCADE;

-- ====================================
-- CREATE ENUMS
-- ====================================

CREATE TYPE "RecipeCategory" AS ENUM ('VEG', 'NON_VEG', 'EGG');

-- ====================================
-- CREATE TABLES
-- ====================================

-- Users Table
CREATE TABLE "users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "clerkId" TEXT NOT NULL UNIQUE,
    "email" TEXT NOT NULL UNIQUE,
    "name" TEXT NOT NULL,
    "profileImage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- Recipes Table
CREATE TABLE "recipes" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "category" "RecipeCategory" NOT NULL,
    "servings" INTEGER NOT NULL,
    "totalTime" INTEGER NOT NULL,
    "ingredients" JSONB NOT NULL,
    "steps" JSONB NOT NULL,
    "images" JSONB NOT NULL,
    "authorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "recipes_authorId_fkey" FOREIGN KEY ("authorId") 
        REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Reviews Table
CREATE TABLE "reviews" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "userId" TEXT NOT NULL,
    "recipeId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "reviews_userId_fkey" FOREIGN KEY ("userId") 
        REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "reviews_recipeId_fkey" FOREIGN KEY ("recipeId") 
        REFERENCES "recipes"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "unique_user_recipe_review" UNIQUE ("userId", "recipeId")
);

-- Comments Table
CREATE TABLE "comments" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "content" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "recipeId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "comments_userId_fkey" FOREIGN KEY ("userId") 
        REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "comments_recipeId_fkey" FOREIGN KEY ("recipeId") 
        REFERENCES "recipes"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- ====================================
-- CREATE INDEXES
-- ====================================

-- Users indexes
CREATE INDEX "users_clerkId_idx" ON "users"("clerkId");
CREATE INDEX "users_email_idx" ON "users"("email");

-- Recipes indexes
CREATE INDEX "recipes_authorId_idx" ON "recipes"("authorId");
CREATE INDEX "recipes_category_idx" ON "recipes"("category");
CREATE INDEX "recipes_createdAt_idx" ON "recipes"("createdAt");

-- Reviews indexes
CREATE INDEX "reviews_recipeId_idx" ON "reviews"("recipeId");
CREATE INDEX "reviews_userId_idx" ON "reviews"("userId");

-- Comments indexes
CREATE INDEX "comments_recipeId_idx" ON "comments"("recipeId");
CREATE INDEX "comments_userId_idx" ON "comments"("userId");
CREATE INDEX "comments_createdAt_idx" ON "comments"("createdAt");

-- ====================================
-- ADD CONSTRAINTS (Optional but recommended)
-- ====================================

-- Rating must be between 1 and 5
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_rating_check" 
    CHECK ("rating" >= 1 AND "rating" <= 5);

-- Servings must be positive
ALTER TABLE "recipes" ADD CONSTRAINT "recipes_servings_check" 
    CHECK ("servings" > 0);

-- Total time must be positive
ALTER TABLE "recipes" ADD CONSTRAINT "recipes_totalTime_check" 
    CHECK ("totalTime" > 0);
