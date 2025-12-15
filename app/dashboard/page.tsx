'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { motion, AnimatePresence } from 'framer-motion';
import { ChefHat, Star, MessageCircle, Edit, Trash2, Plus, Calendar } from 'lucide-react';
import Link from 'next/link';
import { PageTransition } from '@/components/animations/PageTransition';
import { RevealSection } from '@/components/animations/RevealSection';

interface Recipe {
    id: string;
    title: string;
    description?: string;
    category: 'VEG' | 'NON_VEG' | 'EGG';
    images: string[];
    createdAt: string;
    avgRating: number;
    _count: { reviews: number; comments: number };
}

interface Review {
    id: string;
    rating: number;
    comment?: string;
    createdAt: string;
    recipe: {
        id: string;
        title: string;
    };
}

export default function DashboardPage() {
    const { user, isLoaded } = useUser();
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'recipes' | 'reviews' | 'account'>('recipes');

    useEffect(() => {
        if (isLoaded && user) {
            fetchUserData();
        }
    }, [isLoaded, user]);

    const fetchUserData = async () => {
        try {
            // Fetch user's recipes
            const recipesRes = await fetch('/api/recipes?userId=' + user?.id);
            if (recipesRes.ok) {
                const data = await recipesRes.json();
                setRecipes(data.recipes || []);
            }

            // Fetch user's reviews (you'd need to create this endpoint)
            // For now, leaving as empty array
            setReviews([]);
        } catch (error) {
            console.error('Failed to fetch user data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteRecipe = async (recipeId: string) => {
        if (!confirm('Are you sure you want to delete this recipe?')) return;

        try {
            const response = await fetch(`/api/recipes/${recipeId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setRecipes(recipes.filter(r => r.id !== recipeId));
            }
        } catch (error) {
            console.error('Failed to delete recipe:', error);
        }
    };

    if (!isLoaded || loading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-neutral-950 via-neutral-900 to-black flex items-center justify-center">
                <motion.div
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="text-neutral-400 text-lg"
                >
                    Loading your dashboard...
                </motion.div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-neutral-950 via-neutral-900 to-black flex items-center justify-center">
                <div className="text-center space-y-6">
                    <ChefHat className="w-16 h-16 mx-auto text-neutral-700" />
                    <h1 className="text-3xl font-bold text-neutral-300">Please sign in</h1>
                    <p className="text-neutral-500">You need to be signed in to view your dashboard.</p>
                </div>
            </div>
        );
    }

    const joinedDate = user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric',
    }) : 'Recently';

    return (
        <PageTransition>
            <div className="min-h-screen bg-gradient-to-b from-neutral-950 via-neutral-900 to-black">
                {/* Header */}
                <section className="border-b border-neutral-800/50 bg-neutral-900/50 backdrop-blur-lg">
                    <div className="container mx-auto px-4 py-8">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center ring-2 ring-neutral-800">
                                    {user.imageUrl ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img src={user.imageUrl} alt={user.fullName || ''} className="w-full h-full rounded-full" />
                                    ) : (
                                        <span className="text-2xl font-bold text-white">
                                            {(user.fullName || user.firstName || 'U')[0].toUpperCase()}
                                        </span>
                                    )}
                                </div>
                                <div>
                                    <h1 className="text-3xl font-bold text-white">Your Dashboard</h1>
                                    <p className="text-neutral-400">Welcome back, {user.firstName || 'Chef'}!</p>
                                </div>
                            </div>

                            <Link href="/create">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg font-medium hover:from-primary-500 hover:to-primary-600 transition-all flex items-center gap-2"
                                >
                                    <Plus className="w-5 h-5" />
                                    Create Recipe
                                </motion.button>
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Tabs */}
                <section className="sticky top-20 z-30 bg-neutral-900/80 backdrop-blur-lg border-b border-neutral-800/50">
                    <div className="container mx-auto px-4">
                        <div className="flex gap-8">
                            {[
                                { id: 'recipes', label: 'My Recipes', count: recipes.length },
                                { id: 'reviews', label: 'My Reviews', count: reviews.length },
                                { id: 'account', label: 'Account' },
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id as any)}
                                    className={`relative py-4 px-2 transition-colors ${activeTab === tab.id ? 'text-white' : 'text-neutral-500 hover:text-neutral-300'
                                        }`}
                                >
                                    <span className="font-medium">
                                        {tab.label}
                                        {tab.count !== undefined && (
                                            <span className="ml-2 text-sm">({tab.count})</span>
                                        )}
                                    </span>
                                    {activeTab === tab.id && (
                                        <motion.div
                                            layoutId="activeTab"
                                            className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-500"
                                        />
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Content */}
                <section className="py-12">
                    <div className="container mx-auto px-4 max-w-6xl">
                        <AnimatePresence mode="wait">
                            {activeTab === 'recipes' && (
                                <motion.div
                                    key="recipes"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    {recipes.length > 0 ? (
                                        <div className="space-y-4">
                                            {recipes.map((recipe) => (
                                                <RecipeCard
                                                    key={recipe.id}
                                                    recipe={recipe}
                                                    onDelete={() => handleDeleteRecipe(recipe.id)}
                                                />
                                            ))}
                                        </div>
                                    ) : (
                                        <EmptyState
                                            icon={<ChefHat className="w-12 h-12" />}
                                            title="No recipes yet"
                                            description="Start sharing your culinary creations with the world."
                                            action={
                                                <Link href="/create">
                                                    <motion.button
                                                        whileHover={{ scale: 1.02 }}
                                                        whileTap={{ scale: 0.98 }}
                                                        className="px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg font-medium"
                                                    >
                                                        Create Your First Recipe
                                                    </motion.button>
                                                </Link>
                                            }
                                        />
                                    )}
                                </motion.div>
                            )}

                            {activeTab === 'reviews' && (
                                <motion.div
                                    key="reviews"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <EmptyState
                                        icon={<Star className="w-12 h-12" />}
                                        title="No reviews yet"
                                        description="Share your thoughts on recipes you've tried."
                                    />
                                </motion.div>
                            )}

                            {activeTab === 'account' && (
                                <motion.div
                                    key="account"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-8 space-y-6">
                                        <h2 className="text-2xl font-bold mb-6">Account Information</h2>

                                        <div className="space-y-4">
                                            <InfoRow label="Name" value={user.fullName || 'Not set'} />
                                            <InfoRow label="Email" value={user.primaryEmailAddress?.emailAddress || 'Not set'} />
                                            <InfoRow label="Joined" value={joinedDate} />
                                            <InfoRow label="Username" value={user.username || 'Not set'} />
                                        </div>

                                        <div className="pt-6 border-t border-neutral-800">
                                            <p className="text-sm text-neutral-500 mb-4">
                                                Manage your account settings and preferences in Clerk.
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </section>
            </div>
        </PageTransition>
    );
}

function RecipeCard({ recipe, onDelete }: { recipe: Recipe; onDelete: () => void }) {
    const categoryColors = {
        VEG: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
        NON_VEG: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
        EGG: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    };

    return (
        <motion.div
            whileHover={{ scale: 1.01 }}
            className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-6 hover:border-neutral-700 transition-all"
        >
            <div className="flex items-start gap-6">
                {/* Thumbnail */}
                <div className="relative w-32 h-32 rounded-lg overflow-hidden bg-neutral-800 flex-shrink-0">
                    {recipe.images && recipe.images.length > 0 ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={recipe.images[0]} alt={recipe.title} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <ChefHat className="w-12 h-12 text-neutral-700" />
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-3">
                        <div className="flex-1">
                            <Link href={`/recipes/${recipe.id}`} className="group">
                                <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-primary-400 transition-colors line-clamp-1">
                                    {recipe.title}
                                </h3>
                            </Link>
                            {recipe.description && (
                                <p className="text-sm text-neutral-500 line-clamp-2">{recipe.description}</p>
                            )}
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${categoryColors[recipe.category]}`}>
                            {recipe.category === 'NON_VEG' ? 'Non-Veg' : recipe.category === 'VEG' ? 'Vegetarian' : 'Egg'}
                        </span>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm text-neutral-500">
                            <div className="flex items-center gap-1">
                                <Star className="w-4 h-4 text-amber-400" />
                                <span>{recipe.avgRating.toFixed(1)}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <MessageCircle className="w-4 h-4" />
                                <span>{recipe._count.reviews} reviews</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                <span>{new Date(recipe.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <Link href={`/recipes/${recipe.id}/edit`}>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="p-2 rounded-lg border border-neutral-700 hover:border-primary-600 hover:bg-primary-950/30 transition-all"
                                >
                                    <Edit className="w-4 h-4" />
                                </motion.button>
                            </Link>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={onDelete}
                                className="p-2 rounded-lg border border-neutral-700 hover:border-rose-600 hover:bg-rose-950/30 transition-all"
                            >
                                <Trash2 className="w-4 h-4" />
                            </motion.button>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

function InfoRow({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex items-center justify-between py-3 border-b border-neutral-800 last:border-0">
            <span className="text-neutral-500">{label}</span>
            <span className="text-white font-medium">{value}</span>
        </div>
    );
}

function EmptyState({
    icon,
    title,
    description,
    action,
}: {
    icon: React.ReactNode;
    title: string;
    description: string;
    action?: React.ReactNode;
}) {
    return (
        <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-600 mb-6">
                {icon}
            </div>
            <h3 className="text-2xl font-semibold text-neutral-300 mb-2">{title}</h3>
            <p className="text-neutral-500 mb-6 max-w-md mx-auto">{description}</p>
            {action}
        </div>
    );
}
