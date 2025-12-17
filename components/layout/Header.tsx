'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useUser, UserButton } from '@clerk/nextjs';
import { ChevronLeft } from 'lucide-react';

const navLinks = [
    { href: '/explore', label: 'Explore' },
    { href: '/about', label: 'About' },
    { href: '/dashboard', label: 'Me' },
];

export function Header() {
    const pathname = usePathname();
    const { scrollY } = useScroll();
    const [hasScrolled, setHasScrolled] = useState(false);
    const [hideNav, setHideNav] = useState(false);
    const { isSignedIn } = useUser();
    const [lastScrollTime, setLastScrollTime] = useState(Date.now());
    const [isAtTop, setIsAtTop] = useState(true);

    // Check if we are on a recipe details page (e.g. /explore/RECIPE_ID)
    const isRecipePage = pathname?.startsWith('/explore/') && pathname.split('/').length > 2;

    useMotionValueEvent(scrollY, "change", (latest) => {
        const previous = scrollY.getPrevious() ?? 0;
        setLastScrollTime(Date.now());
        const atTop = latest < 100;
        setIsAtTop(atTop);

        if (atTop) {
            setHideNav(false);
        } else {
            if (latest > previous && latest > 100) {
                setHideNav(true);
            } else {
                setHideNav(false);
            }
        }
        setHasScrolled(latest > 20);
    });

    useEffect(() => {
        if (isAtTop) return;
        const interval = setInterval(() => {
            if (!hideNav && Date.now() - lastScrollTime > 3000) {
                setHideNav(true);
            }
        }, 500);
        return () => clearInterval(interval);
    }, [hideNav, lastScrollTime, isAtTop]);

    return (
        <motion.header
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="fixed top-0 left-0 right-0 z-50 bg-transparent"
        >
            <div className="container mx-auto max-w-7xl px-6">
                <nav className="flex items-center justify-between h-16">
                    {/* Left Section: Back Button + Logo */}
                    <div className="flex items-center gap-4">
                        {isRecipePage && (
                            <Link
                                href="/explore"
                                className="flex items-center justify-center w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors border border-white/5"
                                title="Back to Explore"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </Link>
                        )}

                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-2 group">
                            <div className="w-8 h-8 relative">
                                <Image
                                    src="/icon.png"
                                    alt="Platera"
                                    width={32}
                                    height={32}
                                    className="w-full h-full object-contain transition-transform duration-200 group-hover:scale-110"
                                />
                            </div>
                            <span className="text-lg font-semibold text-white tracking-widest hidden sm:block" style={{ fontFamily: 'Playfair Display, serif', letterSpacing: '0.15em' }}>
                                Platera
                            </span>
                        </Link>
                    </div>

                    {/* Center Navigation with Dark Background */}
                    <motion.div
                        className="relative px-6 py-2.5 rounded-full"
                        animate={{
                            backgroundColor: (hideNav || isAtTop) ? 'rgba(0, 0, 0, 0)' : 'rgba(0, 0, 0, 0.75)',
                            backdropFilter: (hideNav || isAtTop) ? 'blur(0px)' : 'blur(12px)',
                        }}
                        transition={{
                            duration: 0.3,
                            ease: [0.25, 0.1, 0.25, 1.0]
                        }}
                    >
                        <div className="flex items-center gap-8">
                            {navLinks.map((link, index) => {
                                const isActive = pathname === link.href;

                                return (
                                    <motion.div
                                        key={link.href}
                                        animate={{
                                            opacity: hideNav ? 0 : 1,
                                            y: hideNav ? -8 : 0,
                                            filter: hideNav ? 'blur(4px)' : 'blur(0px)',
                                        }}
                                        transition={{
                                            duration: 0.25,
                                            delay: hideNav ? index * 0.02 : (2 - index) * 0.04,
                                            ease: [0.25, 0.1, 0.25, 1.0],
                                            filter: { duration: 0.2 }
                                        }}
                                        style={{
                                            willChange: 'opacity, transform, filter'
                                        }}
                                    >
                                        <Link
                                            href={link.href}
                                            className="relative group hidden md:block"
                                        >
                                            <motion.span
                                                className={`text-sm font-medium transition-colors duration-200 ${isActive
                                                    ? 'text-white'
                                                    : 'text-stone-400 hover:text-white'
                                                    }`}
                                                animate={{
                                                    letterSpacing: hideNav ? '0.1em' : '0em',
                                                }}
                                                transition={{
                                                    duration: 0.25,
                                                    ease: [0.25, 0.1, 0.25, 1.0]
                                                }}
                                            >
                                                {link.label}
                                            </motion.span>
                                            {isActive && (
                                                <motion.div
                                                    layoutId="active-nav"
                                                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-brand-500"
                                                    animate={{
                                                        opacity: hideNav ? 0 : 1,
                                                        scaleX: hideNav ? 0.5 : 1,
                                                    }}
                                                    transition={{
                                                        duration: 0.2,
                                                        ease: [0.25, 0.1, 0.25, 1.0]
                                                    }}
                                                />
                                            )}
                                        </Link>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </motion.div>

                    {/* Auth */}
                    <div className="flex items-center">
                        {isSignedIn ? (
                            <UserButton
                                afterSignOutUrl="/"
                                appearance={{
                                    elements: {
                                        avatarBox: "w-8 h-8",
                                        userButtonPopoverCard: "bg-stone-950 border border-stone-800",
                                        userButtonPopoverActionButton: "hover:bg-stone-900 text-stone-300",
                                        userButtonPopoverActionButtonIcon: "text-stone-400",
                                        userButtonPopoverFooter: "hidden"
                                    }
                                }}
                            />
                        ) : (
                            <Link href="/sign-in">
                                <button className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white text-sm font-medium rounded-md transition-colors duration-200">
                                    Sign In
                                </button>
                            </Link>
                        )}
                    </div>
                </nav>
            </div>
        </motion.header>
    );
}
