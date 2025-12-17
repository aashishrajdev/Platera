
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import Image from 'next/image';
import { Clock, Users, ChevronLeft, Calendar, ChefHat, Star } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

interface PageProps {
    params: {
        id: string;
    };
}

// Fetch data directly on the server
async function getRecipe(id: string) {
    const recipe = await prisma.recipe.findUnique({
        where: { id },
        include: {
            author: {
                select: {
                    id: true,
                    name: true,
                    profileImage: true,
                    clerkId: true,
                }
            },
            reviews: {
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            profileImage: true,
                        }
                    }
                },
                orderBy: { createdAt: 'desc' }
            },
            // savedBy count removed due to missing DB table
            // _count: {
            //    select: {
            //        savedBy: true
            //    }
            // }
        }
    });
    return recipe;
}

export default async function RecipeDetailsPage({ params }: PageProps) {
    const recipe = await getRecipe(params.id);

    if (!recipe) {
        notFound();
    }

    const avgRating = recipe.reviews.length > 0
        ? (recipe.reviews.reduce((acc, r) => acc + r.rating, 0) / recipe.reviews.length).toFixed(1)
        : null;

    // Helper to safely parse JSON or use string array
    const ingredients = Array.isArray(recipe.ingredients)
        ? recipe.ingredients as string[]
        : typeof recipe.ingredients === 'string'
            ? JSON.parse(recipe.ingredients)
            : [];

    const steps = Array.isArray(recipe.steps)
        ? recipe.steps as string[]
        : typeof recipe.steps === 'string'
            ? JSON.parse(recipe.steps)
            : [];

    const images = Array.isArray(recipe.images)
        ? recipe.images as string[]
        : [];

    return (
        <div className="min-h-screen bg-[#050505] text-stone-200 font-sans selection:bg-orange-500/30">
            {/* Navigation removed, moved to Header */}

            {/* Hero Section */}
            <div className="relative w-full h-[60vh] md:h-[70vh]">
                {images[0] ? (
                    <Image
                        src={images[0]}
                        alt={recipe.title}
                        fill
                        className="object-cover"
                        priority
                    />
                ) : (
                    <div className="w-full h-full bg-stone-900 flex items-center justify-center">
                        <ChefHat className="w-20 h-20 text-stone-700" />
                    </div>
                )}
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/60 to-transparent" />

                {/* Hero Content */}
                <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 lg:p-20">
                    <div className="max-w-4xl mx-auto space-y-6">
                        {/* Tags */}
                        <div className="flex items-center gap-3">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase border ${recipe.category === 'VEG' ? 'border-green-500/30 text-green-400 bg-green-500/10' :
                                recipe.category === 'NON_VEG' ? 'border-red-500/30 text-red-400 bg-red-500/10' :
                                    'border-yellow-500/30 text-yellow-400 bg-yellow-500/10'
                                }`}>
                                {recipe.category}
                            </span>
                            {avgRating && (
                                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold">
                                    <Star className="w-3 h-3 fill-current" />
                                    {avgRating} ({recipe.reviews.length})
                                </div>
                            )}
                        </div>

                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight tracking-tight">
                            {recipe.title}
                        </h1>

                        {recipe.description && (
                            <p className="text-lg md:text-xl text-stone-400 max-w-2xl leading-relaxed">
                                {recipe.description}
                            </p>
                        )}

                        {/* Author & Meta */}
                        <div className="flex items-center gap-6 pt-4">
                            <div className="flex items-center gap-3">
                                <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-orange-500/20">
                                    {recipe.author.profileImage ? (
                                        <Image src={recipe.author.profileImage} alt={recipe.author.name} fill className="object-cover" />
                                    ) : (
                                        <div className="w-full h-full bg-stone-800 flex items-center justify-center text-stone-500 font-bold">
                                            {recipe.author.name[0]}
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <p className="text-xs text-stone-500 uppercase tracking-widest font-semibold">Created By</p>
                                    <p className="text-white font-medium">{recipe.author.name}</p>
                                </div>
                            </div>

                            <div className="h-8 w-px bg-stone-800" />

                            <div className="flex items-center gap-6 text-stone-300">
                                <div className="flex items-center gap-2">
                                    <Clock className="w-5 h-5 text-orange-500" />
                                    <span className="font-medium">{recipe.totalTime} min</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Users className="w-5 h-5 text-orange-500" />
                                    <span className="font-medium">{recipe.servings} Servings</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Grid */}
            <div className="max-w-4xl mx-auto px-6 py-16 md:py-24">
                <div className="grid md:grid-cols-[1fr_1.5fr] gap-12 lg:gap-20">

                    {/* Left Column: Ingredients */}
                    <div className="space-y-8">
                        <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                            <span className="w-8 h-1 bg-orange-500 rounded-full" />
                            Ingredients
                        </h3>
                        <ul className="space-y-4">
                            {ingredients.map((ingredient: string, idx: number) => (
                                <li key={idx} className="flex items-start gap-4 p-4 rounded-xl bg-stone-900/40 border border-stone-800/40 hover:border-orange-500/30 transition-colors group">
                                    <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-2.5 group-hover:scale-125 transition-transform" />
                                    <span className="text-stone-300 leading-relaxed group-hover:text-white transition-colors">{ingredient}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Right Column: Steps */}
                    <div className="space-y-8">
                        <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                            <span className="w-8 h-1 bg-orange-500 rounded-full" />
                            Method
                        </h3>
                        <div className="space-y-6">
                            {steps.map((step: string, idx: number) => (
                                <div key={idx} className="relative pl-8 border-l border-stone-800 hover:border-orange-500/50 transition-colors pb-8 last:pb-0 group">
                                    <span className="absolute -left-3 top-0 flex items-center justify-center w-6 h-6 rounded-full bg-[#050505] border border-stone-700 text-xs font-bold text-stone-500 group-hover:border-orange-500 group-hover:text-orange-500 transition-colors">
                                        {idx + 1}
                                    </span>
                                    <p className="text-stone-300 leading-relaxed text-lg group-hover:text-white transition-colors">
                                        {step}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Reviews Section Placeholder */}
                {recipe.reviews.length > 0 && (
                    <div className="mt-24 pt-12 border-t border-stone-900">
                        <h3 className="text-2xl font-bold text-white mb-8">Community Reviews</h3>
                        <div className="grid gap-6">
                            {recipe.reviews.map((review) => (
                                <div key={review.id} className="p-6 rounded-2xl bg-stone-900/30 border border-stone-800/50">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-stone-800 overflow-hidden">
                                                {review.user.profileImage && (
                                                    <Image src={review.user.profileImage} alt={review.user.name} width={32} height={32} />
                                                )}
                                            </div>
                                            <span className="font-medium text-white">{review.user.name}</span>
                                        </div>
                                        <div className="flex items-center gap-1 text-amber-500">
                                            <Star className="w-4 h-4 fill-current" />
                                            <span className="font-bold">{review.rating}</span>
                                        </div>
                                    </div>
                                    {review.comment && (
                                        <p className="text-stone-400">{review.comment}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
