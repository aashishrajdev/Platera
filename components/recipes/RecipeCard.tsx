'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Star, Clock, Users } from 'lucide-react';

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

interface RecipeCardProps {
    recipe: Recipe;
    priority?: boolean;
}

const categoryColors = {
    VEG: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    NON_VEG: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
    EGG: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
};

/**
 * Premium Recipe Card
 * Editorial design with sophisticated gradients and interactions
 */
export function RecipeCard({ recipe, priority = false }: RecipeCardProps) {
    return (
        <Link href={`/recipes/${recipe.id}`}>
            <motion.article
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                whileHover="hover"
                className="group relative overflow-hidden rounded-2xl bg-neutral-950 shadow-2xl"
            >
                {/* Image Container with Overlay */}
                <div className="relative h-80 overflow-hidden">
                    {/* Image */}
                    {recipe.images && recipe.images.length > 0 ? (
                        <>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={recipe.images[0]}
                                alt={recipe.title}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                loading={priority ? 'eager' : 'lazy'}
                            />

                            {/* Triple gradient overlay for depth */}
                            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/60 to-transparent opacity-90" />
                            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-neutral-950/40" />

                            {/* Hover glow effect */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                variants={{
                                    hover: { opacity: 0.15 }
                                }}
                                transition={{ duration: 0.4 }}
                                className="absolute inset-0 bg-gradient-to-t from-primary-600 to-transparent"
                            />
                        </>
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900" />
                    )}

                    {/* Category Badge - Top Right */}
                    <div className="absolute top-4 right-4 z-10">
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            className={`px-3 py-1.5 rounded-full text-xs font-medium border backdrop-blur-md ${categoryColors[recipe.category]}`}
                        >
                            {recipe.category === 'NON_VEG' ? 'Non-Veg' : recipe.category === 'VEG' ? 'Vegetarian' : 'Egg'}
                        </motion.div>
                    </div>

                    {/* Rating Badge - Top Left */}
                    {recipe.avgRating > 0 && (
                        <div className="absolute top-4 left-4 z-10">
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neutral-950/80 backdrop-blur-md border border-neutral-700/50"
                            >
                                <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                                <span className="text-sm font-semibold text-white">{recipe.avgRating.toFixed(1)}</span>
                                <span className="text-xs text-neutral-400">({recipe._count.reviews})</span>
                            </motion.div>
                        </div>
                    )}

                    {/* Content Overlay - Bottom */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
                        {/* Title */}
                        <h3 className="text-2xl font-bold text-white mb-2 line-clamp-2 group-hover:text-primary-300 transition-colors duration-300">
                            {recipe.title}
                        </h3>

                        {/* Description */}
                        {recipe.description && (
                            <p className="text-sm text-neutral-300 line-clamp-2 mb-4 leading-relaxed">
                                {recipe.description}
                            </p>
                        )}

                        {/* Meta Row */}
                        <div className="flex items-center justify-between">
                            {/* Author */}
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center ring-2 ring-neutral-950/50">
                                        {recipe.author.profileImage ? (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img
                                                src={recipe.author.profileImage}
                                                alt={recipe.author.name}
                                                className="w-full h-full rounded-full object-cover"
                                            />
                                        ) : (
                                            <span className="text-sm font-semibold text-white">
                                                {recipe.author.name[0].toUpperCase()}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <p className="text-xs text-neutral-500 uppercase tracking-wider">Chef</p>
                                    <p className="text-sm font-medium text-white">{recipe.author.name}</p>
                                </div>
                            </div>

                            {/* Quick Stats */}
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-1.5 text-neutral-400">
                                    <Clock className="w-4 h-4" />
                                    <span className="text-sm">{recipe.totalTime}m</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-neutral-400">
                                    <Users className="w-4 h-4" />
                                    <span className="text-sm">{recipe.servings}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Subtle border glow on hover */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        variants={{
                            hover: { opacity: 0.5 }
                        }}
                        transition={{ duration: 0.3 }}
                        className="absolute inset-0 rounded-2xl border-2 border-primary-500/0 group-hover:border-primary-500/50"
                        style={{ pointerEvents: 'none' }}
                    />
                </div>

                {/* Bottom section removed for editorial fullscreen look */}
            </motion.article>
        </Link>
    );
}
