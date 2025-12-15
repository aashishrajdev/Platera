import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { RecipeCategory } from '@prisma/client';

/**
 * GET /api/recipes
 * Get all recipes with optional filtering
 */
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const category = searchParams.get('category') as RecipeCategory | null;
        const authorId = searchParams.get('authorId');
        const minRating = searchParams.get('minRating') ? parseFloat(searchParams.get('minRating')!) : null;
        const maxTime = searchParams.get('maxTime') ? parseInt(searchParams.get('maxTime')!) : null;
        const sortBy = searchParams.get('sortBy') || 'newest';
        const search = searchParams.get('search');
        const limit = parseInt(searchParams.get('limit') || '20');
        const page = parseInt(searchParams.get('page') || '1');

        // Build where clause
        const where: any = {
            ...(category && { category }),
            ...(authorId && { authorId }),
            ...(maxTime && { totalTime: { lte: maxTime } }),
            ...(search && {
                OR: [
                    { title: { contains: search } },
                    { description: { contains: search } },
                ],
            }),
        };

        const recipes = await prisma.recipe.findMany({
            where,
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                        profileImage: true,
                    },
                },
                reviews: {
                    select: {
                        rating: true,
                    },
                },
                _count: {
                    select: {
                        reviews: true,
                        comments: true,
                    },
                },
            },
            orderBy: sortBy === 'newest' ? { createdAt: 'desc' } : undefined,
            take: limit,
            skip: (page - 1) * limit,
        });

        const total = await prisma.recipe.count({ where });

        // Calculate average rating and filter by minRating
        let recipesWithAvgRating = recipes.map((recipe) => {
            const avgRating = recipe.reviews.length > 0
                ? recipe.reviews.reduce((sum, r) => sum + r.rating, 0) / recipe.reviews.length
                : 0;

            const { reviews, ...recipeData } = recipe;
            return {
                ...recipeData,
                avgRating: Math.round(avgRating * 10) / 10,
            };
        });

        // Filter by minRating if specified
        if (minRating) {
            recipesWithAvgRating = recipesWithAvgRating.filter(r => r.avgRating >= minRating);
        }

        // Sort recipes
        if (sortBy === 'topRated') {
            recipesWithAvgRating.sort((a, b) => b.avgRating - a.avgRating);
        } else if (sortBy === 'mostSaved') {
            // Use review count as proxy for saves for now
            recipesWithAvgRating.sort((a, b) => b._count.reviews - a._count.reviews);
        }
        // 'newest' is already sorted by default (orderBy createdAt desc)

        return NextResponse.json({
            recipes: recipesWithAvgRating,
            pagination: {
                total: minRating ? recipesWithAvgRating.length : total,
                page,
                limit,
                totalPages: Math.ceil((minRating ? recipesWithAvgRating.length : total) / limit),
            },
        });
    } catch (error) {
        console.error('Error fetching recipes:', error);
        return NextResponse.json({ error: 'Failed to fetch recipes' }, { status: 500 });
    }
}

/**
 * POST /api/recipes
 * Create a new recipe
 */
export async function POST(request: NextRequest) {
    try {
        const user = await getCurrentUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { title, description, category, servings, totalTime, ingredients, steps, images } = body;

        // Validation
        if (!title || !category || !servings || !totalTime || !ingredients || !steps) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        if (!['VEG', 'NON_VEG', 'EGG'].includes(category)) {
            return NextResponse.json({ error: 'Invalid category. Must be VEG, NON_VEG, or EGG' }, { status: 400 });
        }

        if (servings <= 0 || totalTime <= 0) {
            return NextResponse.json({ error: 'Servings and totalTime must be positive' }, { status: 400 });
        }

        // Validate ingredients is an array and not empty
        if (!Array.isArray(ingredients) || ingredients.length === 0) {
            return NextResponse.json({ error: 'Ingredients must be a non-empty array' }, { status: 400 });
        }

        // Validate steps is an array and not empty
        if (!Array.isArray(steps) || steps.length === 0) {
            return NextResponse.json({ error: 'Steps must be a non-empty array' }, { status: 400 });
        }

        // Validate images (optional, but max 5 if provided)
        if (images && (!Array.isArray(images) || images.length > 5)) {
            return NextResponse.json({ error: 'Images must be an array with maximum 5 URLs' }, { status: 400 });
        }

        const recipe = await prisma.recipe.create({
            data: {
                title,
                description,
                category,
                servings,
                totalTime,
                ingredients,
                steps,
                images: images || [],
                authorId: user.id,
            },
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                        profileImage: true,
                    },
                },
            },
        });

        return NextResponse.json(recipe, { status: 201 });
    } catch (error) {
        console.error('Error creating recipe:', error);
        return NextResponse.json({ error: 'Failed to create recipe' }, { status: 500 });
    }
}
