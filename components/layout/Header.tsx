'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { User } from 'lucide-react';
import { useState } from 'react';

const navLinks = [
    { href: '/explore', label: 'Explore' },
    { href: '/dashboard', label: 'Me' },
];

export function Header() {
    const pathname = usePathname();
    const [hidden, setHidden] = useState(false);
    const { scrollY } = useScroll();

    useMotionValueEvent(scrollY, "change", (latest) => {
        const previous = scrollY.getPrevious() ?? 0;
        if (latest > previous && latest > 100) {
            setHidden(true);
        } else {
            setHidden(false);
        }
    });

    return (
        <motion.header
            variants={{
                visible: { y: 0, opacity: 1 },
                hidden: { y: "-100%", opacity: 0 }
            }}
            animate={hidden ? "hidden" : "visible"}
            transition={{
                duration: 0.35,
                ease: [0.16, 1, 0.3, 1]
            }}
            className="fixed top-0 left-0 right-0 z-50 px-4 py-4"
        >
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                    duration: 0.5,
                    ease: [0.16, 1, 0.3, 1],
                    delay: 0.1
                }}
                className="relative bg-gradient-to-b from-zinc-900/95 to-neutral-950/98 backdrop-blur-xl rounded-full shadow-2xl shadow-black/60 border border-brand-600/30"
            >
                <div className="flex items-center justify-between px-3 py-2">
                    {/* Logo - Left Side */}
                    <Link
                        href="/"
                        className="flex items-center gap-2 px-3 hover:opacity-80 transition-opacity"
                    >
                        <motion.div
                            whileHover={{ rotate: 5 }}
                            transition={{ type: "spring", stiffness: 400 }}
                            className="relative"
                        >
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-600 to-brand-700 flex items-center justify-center">
                                <svg
                                    className="w-5 h-5 text-white"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                                    />
                                </svg>
                            </div>
                        </motion.div>
                    </Link>

                    {/* Center Navigation */}
                    <nav className="flex items-center gap-1 px-2">
                        {navLinks.map((link) => {
                            const isActive = pathname === link.href;
                            return (
                                <Link key={link.href} href={link.href}>
                                    <motion.div
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className={`relative px-4 py-2 rounded-full transition-all duration-300 ${isActive
                                            ? 'text-white'
                                            : 'text-stone-400 hover:text-stone-200'
                                            }`}
                                    >
                                        {isActive && (
                                            <motion.div
                                                layoutId="navbar-indicator"
                                                className="absolute inset-0 bg-stone-800/50 rounded-full"
                                                transition={{
                                                    type: 'spring',
                                                    stiffness: 380,
                                                    damping: 30,
                                                }}
                                            />
                                        )}
                                        <span className="relative text-sm font-medium">{link.label}</span>
                                    </motion.div>
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Right Side - Auth */}
                    <div className="flex items-center gap-2 px-2">
                        {/* User Profile Avatar */}
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="relative"
                        >
                            <Link href="/dashboard">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-stone-700 to-stone-800 flex items-center justify-center border border-stone-600/30 hover:border-brand-500/50 transition-colors cursor-pointer">
                                    <User className="w-4 h-4 text-stone-300" />
                                </div>
                            </Link>
                        </motion.div>

                        {/* Sign In Button */}
                        <div className="relative group">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                                className="relative px-6 py-2 text-white text-sm font-semibold rounded-full overflow-hidden group"
                            >
                                {/* Brand burnt orange gradient */}
                                <div className="absolute inset-0 bg-gradient-to-br from-brand-600 via-brand-500 to-brand-600" />

                                {/* Shine overlay */}
                                <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent" />

                                {/* Top highlight */}
                                <div className="absolute inset-0 bg-gradient-to-b from-brand-400/30 to-transparent" />

                                {/* Hover state - brighter */}
                                <div className="absolute inset-0 bg-gradient-to-tr from-brand-500/0 to-transparent group-hover:from-brand-400/20 transition-all duration-500" />

                                {/* Brand glow */}
                                <div className="absolute inset-0 shadow-lg shadow-brand-600/40 group-hover:shadow-xl group-hover:shadow-brand-500/60 rounded-full transition-shadow duration-500" />

                                <span className="relative">Sign In</span>
                            </motion.button>
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.header>
    );
}
