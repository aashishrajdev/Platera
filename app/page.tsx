'use client';

import { motion } from 'framer-motion';
import { ChevronRight, Sparkles, Star, ChevronDown } from 'lucide-react';
import Link from 'next/link';

import FeaturedRecipeCarousel from '@/components/hero/FeaturedRecipeCarousel';

export default function Home() {
    const features = [
        {
            title: "Curated Excellence",
            description: "Handpicked recipes from world-renowned chefs",
        },
        {
            title: "Community Driven",
            description: "Share your culinary creations with food lovers",
        },
        {
            title: "Expert Guidance",
            description: "Step-by-step instructions for perfect results",
        },
    ];

    const categories = [
        { name: 'All', value: '' },
        { name: 'Vegetarian', value: 'VEG' },
        { name: 'Non-Veg', value: 'NON_VEG' },
        { name: 'Egg', value: 'EGG' },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-zinc-950 via-neutral-950 to-stone-950">
            {/* Cinematic Hero Section */}
            <section className="relative min-h-screen flex items-center overflow-hidden pt-20">
                {/* Layered Background Effects - Simplified */}
                {/* Layer 1: Base gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-zinc-950 via-neutral-900 to-stone-950" />

                {/* Layer 2: Subtle vignette for depth */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.2)_100%)]" />

                {/* Layer 4: Subtle grain texture overlay */}
                <div className="absolute inset-0 opacity-[0.015] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGQ9Ik0wIDBoMzAwdjMwMEgweiIgZmlsdGVyPSJ1cmwoI2EpIiBvcGFjaXR5PSIuMDUiLz48L3N2Zz4=')]" />

                {/* Content - Two Column Layout */}
                <div className="container mx-auto px-4 z-10">
                    <div className="grid lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
                        {/* Left Column - Hero Content */}
                        <div>
                            {/* Staggered Text Reveals */}

                            {/* Refined badge - subtle and elegant */}
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-stone-900/60 border border-stone-700/30 backdrop-blur-sm mb-12 shadow-sm"
                            >
                                <Sparkles className="w-4 h-4 text-brand-500" />
                                <span className="text-sm text-stone-400 font-medium">Curated with Excellence</span>
                            </motion.div>

                            {/* Main heading - calm entrance */}
                            <div className="mb-10">
                                <motion.h1
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 1.0, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
                                    className="text-7xl md:text-8xl lg:text-9xl font-display font-semibold leading-none"
                                >
                                    <span className="bg-gradient-to-br from-white via-stone-100 to-stone-400 bg-clip-text text-transparent">
                                        Platera
                                    </span>
                                </motion.h1>
                            </div>

                            {/* Subtitle - staggered lines */}
                            <div className="space-y-2 mb-16">
                                <motion.p
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.6, delay: 0.8 }}
                                    className="text-xl md:text-2xl text-stone-300 font-light max-w-2xl"
                                >
                                    Discover exquisite recipes
                                </motion.p>
                                <motion.p
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.6, delay: 1.0 }}
                                    className="text-lg md:text-xl text-stone-500 max-w-xl"
                                >
                                    crafted by passionate chefs around the world
                                </motion.p>
                            </div>

                            {/* CTA Buttons - asymmetrical placement with emphasis */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 1.2 }}
                                className="flex flex-col sm:flex-row gap-4 items-start"
                            >
                                <Link href="/recipes">
                                    <motion.div
                                        whileHover={{ scale: 1.02, y: -4 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="group relative px-8 py-4 rounded-xl font-medium overflow-hidden transition-all duration-500"
                                    >
                                        {/* Pure vibrant orange background */}
                                        <div className="absolute inset-0 bg-gradient-to-br from-brand-500 via-brand-600 to-brand-700" />

                                        {/* Bright highlight */}
                                        <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-transparent" />

                                        {/* Edge glow */}
                                        <div className="absolute inset-0 bg-gradient-to-b from-brand-400/40 via-transparent to-transparent" />

                                        {/* Hover brightness */}
                                        <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-all duration-500" />

                                        {/* Soft shadow */}
                                        <div className="absolute inset-0 shadow-2xl shadow-brand-600/40 group-hover:shadow-brand-500/60 rounded-xl transition-shadow duration-500" />

                                        {/* Gentle shine effect - slower, more subtle */}
                                        <motion.div
                                            animate={{
                                                x: ['-100%', '100%'],
                                            }}
                                            transition={{
                                                duration: 4,
                                                repeat: Infinity,
                                                repeatDelay: 3,
                                                ease: "easeInOut"
                                            }}
                                            className="absolute inset-0 w-1/4 bg-gradient-to-r from-transparent via-brand-300/15 to-transparent skew-x-12"
                                        />

                                        <span className="relative flex items-center gap-2 text-stone-100">
                                            Explore Creations
                                            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                                        </span>
                                    </motion.div>
                                </Link>

                                <Link href="/create">
                                    <motion.div
                                        whileHover={{ scale: 1.02, y: -2 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="relative px-8 py-4 rounded-xl font-medium overflow-hidden backdrop-blur-md transition-all duration-500 group"
                                    >
                                        {/* Base layer */}
                                        <div className="absolute inset-0 bg-gradient-to-b from-stone-900/50 to-stone-950/70" />

                                        {/* Subtle texture */}
                                        <div className="absolute inset-0 opacity-[0.02] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGQ9Ik0wIDBoMzAwdjMwMEgweiIgZmlsdGVyPSJ1cmwoI2EpIiBvcGFjaXR5PSIuMDUiLz48L3N2Zz4=')]" />

                                        {/* Warm border */}
                                        <div className="absolute inset-0 border border-stone-700/40 group-hover:border-brand-600/40 rounded-xl transition-colors duration-500" />

                                        {/* Soft shadow */}
                                        <div className="absolute inset-0 shadow-lg shadow-black/20 group-hover:shadow-xl group-hover:shadow-black/30 rounded-xl transition-shadow duration-500" />

                                        <span className="relative text-stone-300 group-hover:text-stone-100 transition-colors duration-300">
                                            Share Yours
                                        </span>
                                    </motion.div>
                                </Link>
                            </motion.div>

                            {/* Decorative accent element */}
                            <motion.div
                                initial={{ opacity: 0, scaleX: 0 }}
                                animate={{ opacity: 1, scaleX: 1 }}
                                transition={{ duration: 0.8, delay: 1.4 }}
                                className="h-px w-32 bg-gradient-to-r from-brand-500/50 via-brand-600/25 to-transparent mt-12 origin-left shadow-sm shadow-brand-500/20"
                            />
                        </div>

                        {/* Right Column - Featured Recipe Carousel */}
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 1.0, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
                            className="hidden lg:flex justify-center items-center"
                        >
                            <FeaturedRecipeCarousel />
                        </motion.div>
                    </div>
                </div>


            </section>
        </div>
    );
}
