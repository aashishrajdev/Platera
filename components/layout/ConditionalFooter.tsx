'use client';

import { usePathname } from 'next/navigation';
import { Footer } from './Footer';

export function ConditionalFooter() {
    const pathname = usePathname();
    const isHomepage = pathname === '/';

    // Don't show footer on homepage
    if (isHomepage) {
        return null;
    }

    return <Footer />;
}
