'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star } from 'lucide-react';
import Image from 'next/image';

interface Recipe {
    id: string;
    title: string;
    image: string;
    rating: number;
    chef: string;
}

const DUMMY_RECIPES: Recipe[] = [
    {
        id: 'dummy-1',
        title: 'Truffle Risotto',
        image: 'https://images.unsplash.com/photo-1476124369491-c8fb2c6cb0f7?w=400&h=500&fit=crop',
        rating: 4.8,
        chef: 'Chef Marco',
    },
    {
        id: 'dummy-2',
        title: 'Seared Duck Breast',
        image: 'https://images.unsplash.com/photo-1432139555190-58524dae6a55?w=400&h=500&fit=crop',
        rating: 4.9,
        chef: 'Chef Elena',
    },
    {
        id: 'dummy-3',
        title: 'Lobster Thermidor',
        image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400&h=500&fit=crop',
        rating: 5.0,
        chef: 'Chef Antoine',
    },
];

interface FeaturedRecipeCarouselProps {
    recipes?: Recipe[];
}

export default function FeaturedRecipeCarousel({ recipes }: FeaturedRecipeCarouselProps) {
    const displayRecipes = recipes && recipes.length > 0 ? recipes : DUMMY_RECIPES;
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    useEffect(() => {
        if (isPaused || displayRecipes.length <= 1) return;

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % displayRecipes.length);
        }, 4000);

        return () => clearInterval(interval);
    }, [isPaused, displayRecipes.length]);

    const getVisibleRecipes = () => {
        const visible = [];
        for (let i = 0; i < 3; i++) {
            const index = (currentIndex + i) % displayRecipes.length;
            visible.push({ ...displayRecipes[index], position: i });
        }
        return visible;
    };

    return (
        <div className="relative w-full max-w-3xl">
            <div className="flex gap-4 items-center justify-center">
                <AnimatePresence mode="popLayout">
                    {getVisibleRecipes().map((recipe, i) => (
                        <motion.div
                            key={`${recipe.id}-${i}`}
                            initial={{ opacity: 0, x: 100 }}
                            animate={{
                                opacity: i === 1 ? 1 : 0.5,
                                x: 0,
                                scale: i === 1 ? 1 : 0.85,
                            }}
                            exit={{ opacity: 0, x: -100 }}
                            transition={{
                                duration: 0.7,
                                ease: [0.16, 1, 0.3, 1],
                            }}
                            onMouseEnter={() => setIsPaused(true)}
                            onMouseLeave={() => setIsPaused(false)}
                            className={`relative group cursor-pointer flex-shrink-0 ${i === 1 ? 'w-64' : 'w-52'}`}
                        >
                            <div className="relative overflow-hidden rounded-2xl backdrop-blur-sm transition-all duration-500">
                                {/* Base layer */}
                                <div className="absolute inset-0 bg-gradient-to-br from-neutral-900 to-stone-950" />

                                {/* Subtle texture */}
                                <div className="absolute inset-0 opacity-[0.02] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJib2xlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGQ9Ik0wIDBoMzAwdjMwMEgweiIgZmlsdGVyPSJ1cmwoI2EpIiBvcGFjaXR5PSIuMDUiLz48L3N2Zz4=')]" />

                                {/* Border - orange for main card */}
                                <div className={`absolute inset-0 border ${i === 1 ? 'border-brand-600/40' : 'border-stone-700/30'} group-hover:border-brand-600/60 rounded-2xl transition-colors duration-500`} />

                                {/* Shadow */}
                                <div className={`absolute inset-0 ${i === 1 ? 'shadow-2xl shadow-brand-500/20' : 'shadow-xl shadow-black/40'} group-hover:shadow-2xl group-hover:shadow-brand-500/30 rounded-2xl transition-shadow duration-500`} />

                                {/* Content */}
                                <div className="relative">
                                    {/* Image */}
                                    <div className={`relative ${i === 1 ? 'h-44' : 'h-36'} w-full overflow-hidden rounded-t-2xl`}>
                                        <Image
                                            src={recipe.image}
                                            alt={recipe.title}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-700"
                                        />
                                        {/* Gradient overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

                                        {/* Rating badge */}
                                        <div className="absolute top-2.5 right-2.5 flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-sm border border-brand-500/30">
                                            <Star className="w-3 h-3 fill-brand-500 text-brand-500" />
                                            <span className="text-xs font-semibold text-white">{recipe.rating}</span>
                                        </div>
                                    </div>

                                    {/* Info */}
                                    <div className="p-3">
                                        <h3 className={`${i === 1 ? 'text-lg' : 'text-base'} font-display font-bold text-white mb-1 group-hover:text-brand-400 transition-colors duration-300 line-clamp-1`}>
                                            {recipe.title}
                                        </h3>

                                        <div className="flex items-center gap-1.5">
                                            <div className="w-5 h-5 rounded-full bg-gradient-to-br from-brand-600 to-brand-700 flex items-center justify-center text-white text-xs font-semibold">
                                                {recipe.chef.charAt(5)}
                                            </div>
                                            <span className="text-xs text-stone-400 font-medium">{recipe.chef}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
}
