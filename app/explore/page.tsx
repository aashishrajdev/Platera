'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChefHat, Star, Clock, Sparkles } from 'lucide-react';
import { RecipeCard } from '@/components/recipes/RecipeCard';

interface Recipe {
    id: string;
    title: string;
    description?: string;
    category: 'VEG' | 'NON_VEG' | 'EGG';
    servings: number;
    totalTime: number;
    images: string[];
    author: {
        id: string;
        name: string;
        profileImage?: string;
    };
    avgRating: number;
    _count: {
        reviews: number;
        comments: number;
    };
}

function ExploreContent() {
    const searchParams = useSearchParams();
    const router = useRouter();

    // Core State
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [loading, setLoading] = useState(true);
    const [localSearchQuery, setLocalSearchQuery] = useState('');

    // Derived State from URL
    const category = searchParams.get('category') || '';
    const maxTime = searchParams.get('maxTime') || '';
    const minRating = searchParams.get('minRating') === '4';
    const sortBy = searchParams.get('sortBy') || 'newest';
    const urlSearchQuery = searchParams.get('search') || '';

    // Sync local search with URL
    useEffect(() => {
        setLocalSearchQuery(urlSearchQuery);
    }, [urlSearchQuery]);

    // Fetch when URL params change
    useEffect(() => {
        fetchRecipes();
    }, [category, maxTime, minRating, sortBy, urlSearchQuery]);

    const fetchRecipes = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (category) params.append('category', category);
            if (maxTime) params.append('maxTime', maxTime);
            if (minRating) params.append('minRating', '4');
            if (sortBy) params.append('sortBy', sortBy);
            if (urlSearchQuery) params.append('search', urlSearchQuery);

            const response = await fetch(`/api/recipes?${params}`);
            if (response.ok) {
                const data = await response.json();
                setRecipes(data.recipes || []);
            }
        } catch (error) {
            console.error('Failed to fetch recipes:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setLocalSearchQuery(value);

        // Debounce URL update
        const timeoutId = setTimeout(() => {
            const params = new URLSearchParams(searchParams.toString());
            if (value) {
                params.set('search', value);
            } else {
                params.delete('search');
            }
            router.replace(`/explore?${params.toString()}`);
        }, 500);

        return () => clearTimeout(timeoutId);
    };

    const clearFilters = () => {
        router.push('/explore');
        setLocalSearchQuery('');
    };

    return (
        <div className="min-h-screen bg-stone-950 text-stone-200 selection:bg-amber-500/30 selection:text-amber-100">
            {/* Ambient Background Effects */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-stone-900 via-stone-950 to-transparent opacity-80" />
                <div className="absolute -top-40 left-1/4 w-96 h-96 bg-amber-900/20 rounded-full blur-3xl mix-blend-screen opacity-30" />
                <div className="absolute top-20 right-1/4 w-[500px] h-[500px] bg-sepia-900/10 rounded-full blur-3xl mix-blend-screen opacity-20" />
            </div>

            {/* Header Section */}
            <section className="relative z-10 pt-32 pb-16 px-4">
                <div className="container mx-auto max-w-5xl text-center space-y-8">
                    {/* Badge */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stone-900/50 border border-stone-800 backdrop-blur-md"
                    >
                        <Sparkles className="w-3 h-3 text-amber-500" />
                        <span className="text-xs font-medium text-amber-500 uppercase tracking-widest">Premium Collection</span>
                    </motion.div>

                    {/* Title */}
                    <div className="space-y-4">
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-5xl md:text-7xl font-display font-medium text-white tracking-tight"
                        >
                            Culinary <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-sepia-100 to-amber-200">Excellence</span>
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-lg md:text-xl text-stone-400 font-light max-w-2xl mx-auto leading-relaxed"
                        >
                            Explore a curated selection of exquisite recipes crafted by our community of passionate chefs.
                        </motion.p>
                    </div>

                </div>
            </section>

            {/* Content Area */}
            <section className="relative z-10 min-h-[60vh]">
                <div className="container mx-auto px-4 py-8 max-w-7xl">
                    {loading ? (
                        <LoadingGrid />
                    ) : recipes.length > 0 ? (
                        <motion.div
                            layout
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                        >
                            <AnimatePresence mode="popLayout">
                                {recipes.map((recipe) => (
                                    <motion.div
                                        key={recipe.id}
                                        layout
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ duration: 0.4, type: "spring", stiffness: 100 }}
                                    >
                                        <RecipeCard recipe={recipe} />
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </motion.div>
                    ) : (
                        <EmptyState onClearFilters={clearFilters} />
                    )}
                </div>
            </section>
        </div>
    );

}

export default function ExplorePage() {
    return (
        <Suspense fallback={<LoadingGrid />}>
            <ExploreContent />
        </Suspense>
    );
}

function LoadingGrid() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="animate-pulse bg-stone-900/50 rounded-2xl overflow-hidden border border-stone-800 h-[450px]">
                    <div className="h-64 bg-stone-800/50" />
                    <div className="p-6 space-y-4">
                        <div className="h-6 bg-stone-800/50 rounded w-3/4" />
                        <div className="h-4 bg-stone-800/50 rounded w-full" />
                        <div className="flex justify-between pt-4">
                            <div className="h-8 w-24 bg-stone-800/50 rounded-full" />
                            <div className="h-8 w-8 bg-stone-800/50 rounded-full" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

function EmptyState({ onClearFilters }: { onClearFilters: () => void }) {
    return (
        <div className="text-center py-24 space-y-6">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-stone-900/50 border border-stone-800 shadow-xl shadow-stone-950/20"
            >
                <ChefHat className="w-10 h-10 text-stone-600" />
            </motion.div>

            <div className="space-y-2">
                <h3 className="text-2xl font-display text-stone-300">
                    No recipes found
                </h3>
                <p className="text-stone-500 max-w-md mx-auto font-light">
                    We couldn't find any recipes matching your specific criteria. Try adjusting your filters.
                </p>
            </div>

            <button
                onClick={onClearFilters}
                className="px-8 py-3 bg-stone-100 hover:bg-white text-stone-900 rounded-full font-medium transition-all shadow-lg shadow-white/5 hover:scale-105"
            >
                Clear Filters
            </button>
        </div>
    );
}

