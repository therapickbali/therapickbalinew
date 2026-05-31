'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Store } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function TopNav() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Hide TopNav on admin and store routes
    if (pathname?.startsWith('/admin') || pathname?.startsWith('/store')) {
        return null;
    }
    const navItems = [
        { href: '/', label: 'HOME' },
        { href: '/store', label: 'STORE' },
        { href: '/rituals', label: 'TREATMENT' },
        { href: '/review', label: 'REVIEW' },
        { href: '/contact', label: 'CONTACT' },
    ];

    // Scroll listener for dynamic navbar
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        handleScroll();
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div 
            className={`fixed z-50 w-full flex justify-center transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]
                ${isScrolled ? 'top-4 px-4 md:top-6 md:px-0' : 'top-0 px-0'}
            `}
        >
            <header 
                className={`flex items-center justify-between relative transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] w-full
                    ${isScrolled 
                        ? 'bg-white/60 saturate-[1.8] backdrop-blur-[24px] border border-white/60 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.06)] px-4 py-2 md:bg-white/80 md:border-white/80 md:max-w-[800px]' 
                        : 'bg-transparent border-transparent shadow-none rounded-none px-4 py-4 md:py-8 md:px-12 max-w-7xl'}
                `} 
                ref={dropdownRef}
            >
                
                {/* Brand / Store (Left) */}
                <Link href="/store" className="flex items-center gap-2 bg-white/20 backdrop-blur-md border border-white/30 shadow-sm rounded-full pl-3 pr-4 h-9 transition-colors hover:bg-white/30 text-primary shrink-0">
                    <Store size={16} strokeWidth={2.5} />
                    <span className="text-[10px] md:text-[11px] font-bold tracking-widest uppercase mt-0.5">
                        STORE
                    </span>
                </Link>

                {/* Location (Center) */}
                <div className="absolute left-1/2 -translate-x-1/2 flex items-center cursor-pointer group">
                    <span className="text-[9px] md:text-[11px] font-bold uppercase tracking-[0.15em] text-primary">
                        BALI, INDONESIA
                    </span>
                </div>

                {/* Desktop Inline Links (Hidden on mobile OR when scrolled on desktop) */}
                <nav className={`hidden ${!isScrolled ? 'md:flex' : 'md:hidden'} items-center gap-8`}>
                    {navItems.map((item) => {
                        const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
                        return (
                            <Link 
                                key={item.href}
                                href={item.href} 
                                className={`text-[13px] font-semibold tracking-wider transition-colors ${
                                    isActive ? 'text-primary' : 'text-primary/60 hover:text-primary'
                                }`}
                            >
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                {/* Dropdown Toggle Button (Visible on mobile ALWAYS, Visible on desktop ONLY WHEN SCROLLED) */}
                <button 
                    onClick={() => setIsOpen(!isOpen)}
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-primary transition-colors hover:bg-black/5 shrink-0 ${!isScrolled ? 'md:hidden' : 'md:flex'}`}
                    aria-label="Toggle Navigation"
                >
                    {isOpen ? <X size={18} /> : <Menu size={18} />}
                </button>

                {/* Dropdown Menu */}
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: -10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            className={`absolute top-[120%] right-0 w-48 shadow-[0_20px_40px_rgb(0,0,0,0.08)] overflow-hidden flex flex-col p-2 bg-white/95 backdrop-blur-3xl border border-border/30 rounded-2xl z-50`}
                        >
                            {navItems.map((item) => {
                                const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
                                return (
                                    <Link 
                                        key={item.href}
                                        href={item.href}
                                        onClick={() => setIsOpen(false)}
                                        className={`px-4 py-3 rounded-xl text-xs font-bold tracking-wider transition-colors ${
                                            isActive 
                                                ? 'bg-surface text-primary' 
                                                : 'text-text-muted hover:bg-surface/50 hover:text-primary'
                                        }`}
                                    >
                                        {item.label}
                                    </Link>
                                );
                            })}
                        </motion.div>
                    )}
                </AnimatePresence>

            </header>
        </div>
    );
}
