'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { pageVariants } from '@/lib/animations';

interface PageTransitionProps {
    children: ReactNode;
}

/**
 * Wraps page content with elegant fade-in animation
 */
export function PageTransition({ children }: PageTransitionProps) {
    return (
        <motion.div
            initial="initial"
            animate="animate"
            exit="exit"
            variants={pageVariants}
        >
            {children}
        </motion.div>
    );
}
