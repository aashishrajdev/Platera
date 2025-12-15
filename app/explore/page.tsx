'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChefHat, Star } from 'lucide-react';
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

export default function ExplorePage() {
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    // Filters
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedTimeFilter, setSelectedTimeFilter] = useState('');
    const [minRating, setMinRating] = useState(false);
    const [sortBy, setSortBy] = useState('newest');

    useEffect(() => {
        fetchRecipes();
    }, [selectedCategory, selectedTimeFilter, minRating, sortBy, searchQuery]);

    const fetchRecipes = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (selectedCategory) params.append('category', selectedCategory);
            if (selectedTimeFilter) params.append('maxTime', selectedTimeFilter);
            if (minRating) params.append('minRating', '4');
            if (sortBy) params.append('sortBy', sortBy);
            if (searchQuery) params.append('search', searchQuery);

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

    const clearFilters = () => {
        setSelectedCategory('');
        setSelectedTimeFilter('');
        setMinRating(false);
        setSortBy('newest');
        setSearchQuery('');
    };

    return (
        <div className="min-h-screen bg-black pt-24">
            {/* Header */}
            <section className="border-b border-stone-800/50 bg-gradient-to-b from-stone-950 to-black">
                <div className="container mx-auto px-4 py-12">
                    <div className="max-w-4xl mx-auto space-y-6">
                        {/* Title */}
                        <div className="text-center space-y-2">
                            <h1 className="text-4xl md:text-5xl font-display font-bold text-white">
                                Explore Recipes
                            </h1>
                            <p className="text-stone-400">
                                Discover recipes shared by the community
                            </p>
                        </div>

                        {/* Search Bar */}
                        <div className="relative max-w-2xl mx-auto">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-500" />
                            <input
                                type="text"
                                placeholder="Search recipes..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-stone-900/50 border border-stone-800/50 rounded-xl focus:border-brand-600 focus:outline-none transition-colors backdrop-blur-sm text-white placeholder:text-stone-500"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Filters */}
            <section className="sticky top-20 z-40 bg-stone-950/95 backdrop-blur-lg border-b border-stone-800/50 py-4">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                        {/* Category Filters */}
                        <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm text-stone-400 mr-2">Category:</span>
                            {[
                                { value: '', label: 'All' },
                                { value: 'VEG', label: 'Veg 🥗' },
                                { value: 'NON_VEG', label: 'Non-Veg 🍖' },
                                { value: 'EGG', label: 'Egg 🥚' },
                            ].map((cat) => (
                                <button
                                    key={cat.value}
                                    onClick={() => setSelectedCategory(cat.value)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${selectedCategory === cat.value
                                        ? 'bg-brand-600 text-white'
                                        : 'bg-stone-900 text-stone-400 hover:bg-stone-800'
                                        }`}
                                >
                                    {cat.label}
                                </button>
                            ))}
                        </div>

                        {/* Time, Rating, Sort */}
                        <div className="flex items-center gap-3 flex-wrap">
                            {/* Time Filter */}
                            <select
                                value={selectedTimeFilter}
                                onChange={(e) => setSelectedTimeFilter(e.target.value)}
                                className="px-4 py-2 bg-stone-900 border border-stone-800 rounded-lg text-stone-300 text-sm focus:border-brand-600 focus:outline-none"
                            >
                                <option value="">Any time</option>
                                <option value="30">Under 30 min</option>
                                <option value="60">Under 60 min</option>
                            </select>

                            {/* Rating Filter */}
                            <button
                                onClick={() => setMinRating(!minRating)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all ${minRating
                                    ? 'bg-brand-600 text-white'
                                    : 'bg-stone-900 text-stone-400 hover:bg-stone-800'
                                    }`}
                            >
                                <Star className="w-4 h-4" />
                                4★ & above
                            </button>

                            {/* Sort */}
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="px-4 py-2 bg-stone-900 border border-stone-800 rounded-lg text-stone-300 text-sm focus:border-brand-600 focus:outline-none"
                            >
                                <option value="newest">Newest</option>
                                <option value="topRated">Top Rated</option>
                                <option value="mostSaved">Most Popular</option>
                            </select>
                        </div>
                    </div>
                </div>
            </section>

            {/* Recipes Grid */}
            <section className="py-12">
                <div className="container mx-auto px-4">
                    {loading ? (
                        <LoadingGrid />
                    ) : recipes.length > 0 ? (
                        <motion.div
                            layout
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                        >
                            <AnimatePresence mode="popLayout">
                                {recipes.map((recipe) => (
                                    <motion.div
                                        key={recipe.id}
                                        layout
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ duration: 0.3 }}
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

function LoadingGrid() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="animate-pulse bg-stone-900 rounded-2xl overflow-hidden">
                    <div className="h-80 bg-stone-800" />
                </div>
            ))}
        </div>
    );
}

function EmptyState({ onClearFilters }: { onClearFilters: () => void }) {
    return (
        <div className="text-center py-20 space-y-6">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-stone-900 border border-stone-800"
            >
                <ChefHat className="w-12 h-12 text-stone-600" />
            </motion.div>

            <div className="space-y-2">
                <h3 className="text-2xl font-semibold text-stone-300">
                    No recipes found
                </h3>
                <p className="text-stone-500 max-w-md mx-auto">
                    Try adjusting your filters or search query
                </p>
            </div>

            <button
                onClick={onClearFilters}
                className="px-6 py-3 bg-brand-600 hover:bg-brand-500 text-white rounded-lg font-medium transition-colors"
            >
                Clear all filters
            </button>
        </div>
    );
}
