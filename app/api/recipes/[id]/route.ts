import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

/**
 * GET /api/recipes/[id]
 * Get a single recipe by ID
 */
export async function GET(
    request: NextRequest,
    props: { params: Promise<{ id: string }> }
) {
    try {
        const params = await props.params;
        const recipe = await prisma.recipe.findUnique({
            where: { id: params.id },
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                        profileImage: true,
                    },
                },
                reviews: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                profileImage: true,
                            },
                        },
                    },
                    orderBy: { createdAt: 'desc' },
                },
                comments: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                profileImage: true,
                            },
                        },
                    },
                    orderBy: { createdAt: 'desc' },
                },
                _count: {
                    select: {
                        reviews: true,
                        comments: true,
                    },
                },
            },
        });

        if (!recipe) {
            return NextResponse.json({ error: 'Recipe not found' }, { status: 404 });
        }

        // Calculate average rating
        const avgRating = recipe.reviews.length > 0
            ? recipe.reviews.reduce((sum, r) => sum + r.rating, 0) / recipe.reviews.length
            : 0;

        return NextResponse.json({
            ...recipe,
            avgRating: Math.round(avgRating * 10) / 10,
        });
    } catch (error) {
        console.error('Error fetching recipe:', error);
        return NextResponse.json({ error: 'Failed to fetch recipe' }, { status: 500 });
    }
}

/**
 * PATCH /api/recipes/[id]
 * Update a recipe (author only)
 */
export async function PATCH(
    request: NextRequest,
    props: { params: Promise<{ id: string }> }
) {
    try {
        const params = await props.params;
        const user = await getCurrentUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Check if recipe exists and user is the author
        const existingRecipe = await prisma.recipe.findUnique({
            where: { id: params.id },
        });

        if (!existingRecipe) {
            return NextResponse.json({ error: 'Recipe not found' }, { status: 404 });
        }

        if (existingRecipe.authorId !== user.id) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const body = await request.json();
        const { title, description, category, servings, totalTime, ingredients, steps, images } = body;

        // Validation
        if (category && !['VEG', 'NON_VEG', 'EGG'].includes(category)) {
            return NextResponse.json({ error: 'Invalid category' }, { status: 400 });
        }

        if ((servings !== undefined && servings <= 0) || (totalTime !== undefined && totalTime <= 0)) {
            return NextResponse.json({ error: 'Servings and totalTime must be positive' }, { status: 400 });
        }

        const recipe = await prisma.recipe.update({
            where: { id: params.id },
            data: {
                ...(title !== undefined && { title }),
                ...(description !== undefined && { description }),
                ...(category !== undefined && { category }),
                ...(servings !== undefined && { servings }),
                ...(totalTime !== undefined && { totalTime }),
                ...(ingredients !== undefined && { ingredients }),
                ...(steps !== undefined && { steps }),
                ...(images !== undefined && { images }),
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

        return NextResponse.json(recipe);
    } catch (error) {
        console.error('Error updating recipe:', error);
        return NextResponse.json({ error: 'Failed to update recipe' }, { status: 500 });
    }
}

/**
 * DELETE /api/recipes/[id]
 * Delete a recipe (author only)
 */
export async function DELETE(
    request: NextRequest,
    props: { params: Promise<{ id: string }> }
) {
    try {
        const params = await props.params;
        const user = await getCurrentUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Check if recipe exists and user is the author
        const recipe = await prisma.recipe.findUnique({
            where: { id: params.id },
        });

        if (!recipe) {
            return NextResponse.json({ error: 'Recipe not found' }, { status: 404 });
        }

        if (recipe.authorId !== user.id) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        await prisma.recipe.delete({
            where: { id: params.id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting recipe:', error);
        return NextResponse.json({ error: 'Failed to delete recipe' }, { status: 500 });
    }
}
