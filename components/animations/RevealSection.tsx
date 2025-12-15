'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, ReactNode } from 'react';
import { sectionVariants, viewportConfig } from '@/lib/animations';

interface RevealSectionProps {
    children: ReactNode;
    className?: string;
    delay?: number;
}

/**
 * Section that reveals on scroll
 * Premium intersection-based animation
 */
export function RevealSection({ children, className = '', delay = 0 }: RevealSectionProps) {
    const ref = useRef(null);
    const isInView = useInView(ref, viewportConfig);

    return (
        <motion.div
            ref={ref}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            variants={sectionVariants}
            transition={{ delay }}
            className={className}
        >
            {children}
        </motion.div>
    );
}
