'use client';

import React, { useState, useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Store, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function TopNav() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const navItems = [
        { href: '/', label: 'HOME' },
        { href: '/store', label: 'STORE' },
        { href: '/rituals', label: 'TREATMENT' },
        { href: '/philosophy', label: 'PHILOSOPHY' },
        { href: '/why-choose-us', label: 'WHY CHOOSE US' },
        { href: '/service-areas', label: 'SERVICE AREAS' },
        { href: '/faq', label: 'FAQ' },
        { href: '/contact', label: 'CONTACT' },
        { href: '/therapist-login', label: 'PARTNER PORTAL' },
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

    // Hide TopNav on admin and store routes
    if (
        pathname?.startsWith('/admin') || 
        pathname?.startsWith('/store') || 
        pathname?.startsWith('/therapist-login') || 
        pathname?.startsWith('/partnerportal')
    ) {
        return null;
    }

    return (
        <div className="fixed top-0 md:top-6 left-0 right-0 z-50 flex justify-center pointer-events-none md:px-4">
            <header 
                className={`pointer-events-auto flex items-center justify-between relative transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] border will-change-auto
                    ${isScrolled 
                        ? 'translate-y-4 md:translate-y-0 w-[calc(100%-32px)] md:w-full max-w-6xl bg-white/10 backdrop-blur-[40px] border-white/40 shadow-[0_8px_32px_0_rgba(0,0,0,0.1),inset_0_1px_1px_rgba(255,255,255,1)] rounded-[32px] md:rounded-full px-4 py-2 md:py-3' 
                        : 'translate-y-0 md:translate-y-0 w-full max-w-7xl md:max-w-6xl bg-transparent border-transparent shadow-none rounded-none px-4 py-4 md:py-3'}
                `} 
                ref={dropdownRef}
                style={{ transformOrigin: 'top center' }}
            >
                {/* Brand / Store (Left) */}
                <a href="/store" className="flex items-center gap-2 bg-[#111111] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-full pl-3 pr-4 h-9 transition-colors hover:bg-white/30 text-white shrink-0">
                    <Store size={16} strokeWidth={2.5} />
                    <span className="text-[10px] md:text-[11px] font-bold tracking-widest uppercase mt-0.5">
                        STORE
                    </span>
                </a>

                {/* Logo (Center) - Absolute positioned to not stretch navbar height */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-auto mt-0 md:mt-1">
                    <a href="/" className="flex items-center justify-center h-20 md:h-32 w-48 md:w-80 transition-transform hover:scale-105">
                        <img 
                            src="/logo.png" 
                            alt="Therapick Logo" 
                            className="w-full h-full object-contain invert brightness-0"
                        />
                    </a>
                </div>

                {/* Dropdown Toggle Button (Visible everywhere) */}
                <button 
                    onClick={() => setIsOpen(!isOpen)}
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-white transition-colors hover:bg-black/5 shrink-0 ml-auto`}
                    aria-label="Toggle Navigation"
                >
                    {isOpen ? <X size={18} /> : <Menu size={18} />}
                </button>

                {/* Dropdown Menu (Mobile & Desktop) */}
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: -10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            className={`absolute top-[120%] right-0 md:right-4 w-48 shadow-[0_20px_40px_rgb(0,0,0,0.08)] overflow-hidden flex flex-col p-2 bg-[#111111] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-2xl z-50`}
                        >
                            {navItems.map((item) => {
                                const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
                                return (
                                    <a 
                                        key={item.href}
                                        href={item.href}
                                        onClick={() => setIsOpen(false)}
                                        className={`px-4 py-3 rounded-xl text-xs font-bold tracking-wider transition-colors ${
                                            item.href === '/therapist-login' 
                                                ? 'bg-white text-black mt-2 text-center' // Standout style for therapist portal
                                                : isActive 
                                                    ? 'bg-white/10 text-white' 
                                                    : 'text-white/90-muted hover:bg-white/5 hover:text-white'
                                        }`}
                                    >
                                        {item.label}
                                    </a>
                                );
                            })}
                        </motion.div>
                    )}
                </AnimatePresence>

            </header>
        </div>
    );
}
