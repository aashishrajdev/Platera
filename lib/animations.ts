/**
 * Premium Animation System for Platera
 * 
 * Elegant, subtle animations that enhance the luxury experience
 * without being excessive or playful.
 */

import { Variants } from 'framer-motion';

/**
 * Easing curves for premium feel
 */
export const ease = {
    smooth: [0.25, 0.1, 0.25, 1],      // Smooth, refined
    elegant: [0.4, 0, 0.2, 1],          // Material design easing
    spring: { type: 'spring', stiffness: 100, damping: 15 }, // Soft spring
} as const;

/**
 * Duration standards (in seconds)
 */
export const duration = {
    instant: 0.15,
    fast: 0.3,
    normal: 0.5,
    slow: 0.7,
    slower: 1,
} as const;

/**
 * Page-level animations
 */
export const pageVariants: Variants = {
    initial: {
        opacity: 0,
        y: 20,
    },
    animate: {
        opacity: 1,
        y: 0,
        transition: {
            duration: duration.normal,
            ease: ease.elegant,
        },
    },
    exit: {
        opacity: 0,
        y: -20,
        transition: {
            duration: duration.fast,
            ease: ease.elegant,
        },
    },
};

/**
 * Section reveal on scroll
 */
export const sectionVariants: Variants = {
    hidden: {
        opacity: 0,
        y: 40,
    },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: duration.slow,
            ease: ease.elegant,
        },
    },
};

/**
 * Staggered children animation
 */
export const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2,
        },
    },
};

export const itemVariants: Variants = {
    hidden: {
        opacity: 0,
        y: 20,
    },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: duration.normal,
            ease: ease.elegant,
        },
    },
};

/**
 * Card hover animations
 */
export const cardHoverVariants = {
    rest: {
        y: 0,
        scale: 1,
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    },
    hover: {
        y: -8,
        scale: 1.01,
        boxShadow: '0 20px 40px rgba(245, 158, 11, 0.2)', // Amber glow
        transition: {
            duration: duration.fast,
            ease: ease.elegant,
        },
    },
};

/**
 * Button micro-interactions
 */
export const buttonVariants = {
    rest: {
        scale: 1,
    },
    hover: {
        scale: 1.02,
        transition: {
            duration: duration.instant,
            ease: ease.elegant,
        },
    },
    tap: {
        scale: 0.98,
        transition: {
            duration: duration.instant,
            ease: ease.elegant,
        },
    },
};

/**
 * Shimmer effect for loading states
 */
export const shimmerVariants: Variants = {
    initial: {
        backgroundPosition: '-200% 0',
    },
    animate: {
        backgroundPosition: '200% 0',
        transition: {
            duration: 2,
            repeat: Infinity,
            ease: 'linear',
        },
    },
};

/**
 * Fade in/out
 */
export const fadeVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            duration: duration.normal,
            ease: ease.elegant,
        },
    },
};

/**
 * Scale in
 */
export const scaleVariants: Variants = {
    hidden: {
        opacity: 0,
        scale: 0.9,
    },
    visible: {
        opacity: 1,
        scale: 1,
        transition: {
            duration: duration.normal,
            ease: ease.elegant,
        },
    },
};

/**
 * Slide in from side
 */
export const slideVariants: Variants = {
    left: {
        hidden: { opacity: 0, x: -40 },
        visible: {
            opacity: 1,
            x: 0,
            transition: {
                duration: duration.normal,
                ease: ease.elegant,
            },
        },
    },
    right: {
        hidden: { opacity: 0, x: 40 },
        visible: {
            opacity: 1,
            x: 0,
            transition: {
                duration: duration.normal,
                ease: ease.elegant,
            },
        },
    },
};

/**
 * Glow effect on hover
 */
export const glowVariants = {
    rest: {
        boxShadow: '0 0 0 rgba(245, 158, 11, 0)',
    },
    hover: {
        boxShadow: '0 0 20px rgba(245, 158, 11, 0.3)',
        transition: {
            duration: duration.fast,
            ease: ease.elegant,
        },
    },
};

/**
 * Viewport animation configuration
 * For intersection-based animations
 */
export const viewportConfig = {
    once: true,            // Animate only once
    amount: 0.3,          // Trigger when 30% visible
    margin: '-50px',      // Start slightly before element enters
};
