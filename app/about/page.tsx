'use client';

import { motion } from 'framer-motion';
import { ChefHat, Users, Award } from 'lucide-react';
import Link from 'next/link';

export default function About() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-zinc-950 via-neutral-950 to-stone-950">
            {/* Hero Section */}
            <section className="border-b border-stone-800/50 pt-24 pb-20">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="max-w-4xl mx-auto text-center"
                    >
                        {/* Badge */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-stone-900/60 border border-stone-700/30 backdrop-blur-sm mb-8"
                        >
                            <ChefHat className="w-4 h-4 text-brand-500" />
                            <span className="text-sm text-stone-400 font-medium">About Platera</span>
                        </motion.div>

                        {/* Main Heading */}
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight"
                        >
                            Recipes That
                            <span className="block mt-2 bg-gradient-to-r from-brand-500 to-brand-600 bg-clip-text text-transparent">
                                Deserve Your Time
                            </span>
                        </motion.h1>

                        {/* Opening Statement */}
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.6 }}
                            className="text-xl md:text-2xl text-stone-300 font-light max-w-2xl mx-auto leading-relaxed"
                        >
                            We believe cooking is personal. Every recipe you save, every dish you make, says something about who you are and what matters to you.
                        </motion.p>
                    </motion.div>
                </div>
            </section>

            {/* Purpose Section */}
            <section className="py-20 border-b border-stone-800/50">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            viewport={{ once: true }}
                            className="space-y-8"
                        >
                            <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">Why This Exists</h2>

                            <p className="text-lg text-stone-300 leading-relaxed">
                                Most recipe sites overwhelm you. Too many options. Too many distractions. Too much noise between you and what you came for.
                            </p>

                            <p className="text-lg text-stone-300 leading-relaxed">
                                Platera is different. This is a place for recipes that have been tested, refined, and shared by people who actually cook. No fluff. No endless scroll. Just good food, clearly explained.
                            </p>

                            <p className="text-lg text-stone-300 leading-relaxed">
                                We built this because we wanted a space that respects your time and intelligence. A place where quality matters more than quantity.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Principles Section */}
            <section className="py-20 border-b border-stone-800/50">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            viewport={{ once: true }}
                            className="text-4xl md:text-5xl font-bold text-white mb-12 text-center"
                        >
                            What We Stand For
                        </motion.h2>

                        <div className="grid md:grid-cols-3 gap-8">
                            {[
                                {
                                    icon: ChefHat,
                                    title: 'Taste First',
                                    description: 'If it doesn\'t taste good, it doesn\'t belong here. Simple as that.'
                                },
                                {
                                    icon: Users,
                                    title: 'Real People',
                                    description: 'These recipes come from home cooks, not content farms. You can tell the difference.'
                                },
                                {
                                    icon: Award,
                                    title: 'Honest Work',
                                    description: 'We don\'t pretend everything is easy. Good cooking takes effort, and that\'s okay.'
                                }
                            ].map((principle, index) => (
                                <motion.div
                                    key={principle.title}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: index * 0.1 }}
                                    viewport={{ once: true }}
                                    className="group p-8 rounded-2xl bg-gradient-to-b from-stone-900/50 to-stone-950/50 border border-stone-800/50 hover:border-brand-600/30 transition-all duration-500"
                                >
                                    <div className="w-14 h-14 rounded-xl bg-brand-600/10 flex items-center justify-center mb-6 group-hover:bg-brand-600/20 transition-colors duration-500">
                                        <principle.icon className="w-7 h-7 text-brand-500" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-white mb-3">{principle.title}</h3>
                                    <p className="text-stone-400 leading-relaxed">{principle.description}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Community Section */}
            <section className="py-20 border-b border-stone-800/50">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            viewport={{ once: true }}
                            className="space-y-6"
                        >
                            <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">For the Cooks</h2>

                            <p className="text-lg text-stone-300 leading-relaxed">
                                This platform is for anyone who cares about what they cook and why. Whether you're experimenting with a new cuisine, perfecting an old family recipe, or just trying to make dinner happen on a Tuesday night.
                            </p>

                            <p className="text-lg text-stone-300 leading-relaxed">
                                If you take cooking seriously without taking yourself too seriously, you'll fit right in here.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Closing Section */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="max-w-3xl mx-auto text-center"
                    >
                        <p className="text-2xl md:text-3xl font-light text-stone-200 leading-relaxed mb-12">
                            Good food connects us. Let's keep it that way.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link href="/explore">
                                <motion.div
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="group relative px-8 py-4 rounded-xl font-medium overflow-hidden transition-all duration-500"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-br from-brand-500 via-brand-600 to-brand-700" />
                                    <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-transparent" />
                                    <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-all duration-500" />
                                    <span className="relative flex items-center gap-2 text-stone-100">
                                        Explore Creations
                                    </span>
                                </motion.div>
                            </Link>
                            <Link href="/dashboard">
                                <motion.div
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="relative px-8 py-4 rounded-xl font-medium overflow-hidden backdrop-blur-md transition-all duration-500 group"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-b from-stone-900/50 to-stone-950/70" />
                                    <div className="absolute inset-0 border border-stone-700/40 group-hover:border-brand-600/40 rounded-xl transition-colors duration-500" />
                                    <span className="relative text-stone-300 group-hover:text-stone-100 transition-colors duration-300">
                                        Add a Recipe
                                    </span>
                                </motion.div>
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
