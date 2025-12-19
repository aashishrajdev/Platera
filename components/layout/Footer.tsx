'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Instagram, Linkedin, Youtube } from 'lucide-react';

const footerLinks = [
    { href: '/explore', label: 'Explore' },
    { href: '/about', label: 'About' },
    { href: '/create', label: 'Add a Recipe' },
    { href: '/privacy-policy', label: 'Privacy Policy' },
    { href: '/terms', label: 'Terms' },
];

export function Footer() {
    return (
        <footer className="border-t border-stone-900/50 bg-black">
            <div className="container mx-auto max-w-7xl px-6 py-12">
                {/* Main Footer Content */}
                <div className="flex flex-col items-center text-center space-y-8">
                    {/* Brand Mark & Name */}
                    <Link href="/" className="group flex flex-col items-center gap-1">
                        <div className="w-10 h-10 opacity-60 group-hover:opacity-100 transition-opacity duration-200">
                            <Image
                                src="/icon.png"
                                alt="Platera"
                                width={40}
                                height={40}
                                className="w-full h-full object-contain"
                            />
                        </div>
                        <span className="text-sm font-display font-semibold text-brand-500 opacity-60 group-hover:opacity-100 transition-opacity duration-200" style={{ fontFamily: 'Playfair Display, serif' }}>
                            P L A T E R A
                        </span>
                    </Link>

                    {/* Brand Statement */}
                    <p className="text-stone-500 text-sm max-w-md leading-relaxed">
                        Recipes worth your time, shared by people who care about good food.
                    </p>

                    {/* Navigation Links */}
                    <nav className="flex items-center gap-6">
                        {footerLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="text-sm text-stone-600 hover:text-stone-400 transition-colors duration-200"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>

                    {/* Social Media Links - Editorial style */}
                    <div className="flex items-center justify-center gap-5 pt-2">
                        <a
                            href="https://www.instagram.com/platera_recipes/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-stone-600 hover:text-brand-500 opacity-80 hover:opacity-100 hover:-translate-y-0.5 transition-all duration-200"
                            aria-label="Instagram"
                        >
                            <Instagram className="w-4 h-4" strokeWidth={1.5} />
                        </a>
                        <a
                            href="https://linkedin.com/company/platera-app"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-stone-600 hover:text-brand-500 opacity-80 hover:opacity-100 hover:-translate-y-0.5 transition-all duration-200"
                            aria-label="LinkedIn"
                        >
                            <Linkedin className="w-4 h-4" strokeWidth={1.5} />
                        </a>
                        <a
                            href="https://youtube.com/@platera"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-stone-600 hover:text-brand-500 opacity-80 hover:opacity-100 hover:-translate-y-0.5 transition-all duration-200"
                            aria-label="YouTube"
                        >
                            <Youtube className="w-4 h-4" strokeWidth={1.5} />
                        </a>
                    </div>

                    {/* Divider */}
                    <div className="w-16 h-px bg-stone-900" />

                    {/* Signature Line */}
                    <p className="text-xs text-stone-700">
                        © 2025 Platera. Designed & built with taste.
                    </p>
                </div>
            </div>
        </footer>
    );
}
