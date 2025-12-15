import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
                // Warm Sepia Primary
                sepia: {
                    50: '#faf8f5',
                    100: '#f1ebe3',
                    200: '#e3d7c8',
                    300: '#d4c2ad',
                    400: '#c5ad92',
                    500: '#a68968',  // Main primary
                    600: '#8b6f50',
                    700: '#6f563f',
                    800: '#4a3828',
                    900: '#2e2218',
                    950: '#1a130c',
                },
                // Premium Amber Accent
                amber: {
                    50: '#fffbeb',
                    100: '#fef3c7',
                    200: '#fde68a',
                    300: '#fcd34d',
                    400: '#f59e0b',  // Main accent
                    500: '#d97706',
                    600: '#b45309',
                    700: '#92400e',
                    800: '#78350f',
                    900: '#451a03',
                },
                // Warm Stone Neutrals
                stone: {
                    50: '#fafaf9',
                    100: '#f5f5f4',
                    200: '#e7e5e4',
                    300: '#d6d3d1',
                    400: '#a8a29e',
                    500: '#78716c',
                    600: '#57534e',
                    700: '#44403c',
                    800: '#292524',  // Main background
                    900: '#1c1917',
                    950: '#0c0a09',
                },
                // Brand Orange - Pure Orange (3-color palette: black, white, orange)
                brand: {
                    50: '#fff7ed',
                    100: '#ffedd5',
                    200: '#fed7aa',
                    300: '#fdba74',
                    400: '#fb923c',
                    500: '#FF6A00',  // Main brand orange - pure vibrant orange
                    600: '#ea580c',
                    700: '#c2410c',
                    800: '#9a3412',
                    900: '#7c2d12',
                    950: '#431407',
                },
                // Keep for backwards compatibility
                primary: {
                    400: '#fb923c',
                    500: '#FF6A00',  // Main brand color - pure orange
                    600: '#ea580c',
                    700: '#c2410c',
                    800: '#9a3412',
                    900: '#7c2d12',
                    950: '#431407',
                },
                // Semantic colors
                emerald: {
                    400: '#34d399',
                    500: '#10b981',
                    600: '#059669',
                    900: '#064e3b',
                },
                rose: {
                    400: '#fb7185',
                    500: '#f43f5e',
                    600: '#e11d48',
                    900: '#881337',
                },
                // Legacy gold
                gold: {
                    400: '#fcd34d',
                    500: '#f59e0b',
                },
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'gradient-warm': 'linear-gradient(to bottom, #292524, #1c1917, #0c0a09)',
            },
            fontFamily: {
                display: ['Cormorant Garamond', 'serif'],
                sans: ['Inter', 'system-ui', 'sans-serif'],
                mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
            },
            boxShadow: {
                'warm': '0 10px 30px rgba(106, 111, 104, 0.15)',
                'amber': '0 8px 24px rgba(245, 158, 11, 0.2)',
                'sepia': '0 4px 16px rgba(166, 137, 104, 0.15)',
            },
        },
    },
    plugins: [],
};

export default config;
