'use client';

import React, { useState, useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Store } from 'lucide-react';
export default function TopNav() {
    const pathname = usePathname();


    const navItems = [
        { href: '/', label: 'HOME' },
        { href: '/store', label: 'STORE' },
        { href: '/rituals', label: 'TREATMENT' },
        { href: '/review', label: 'REVIEW' },
        { href: '/contact', label: 'CONTACT' },
    ];



    // Hide TopNav on admin and store routes
    if (pathname?.startsWith('/admin') || pathname?.startsWith('/store')) {
        return null;
    }

    return (
        <div className="fixed top-4 md:top-6 left-0 right-0 z-50 flex justify-center pointer-events-none px-4">
            <header 
                className={`pointer-events-auto flex items-center justify-between relative transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] border will-change-auto
                    w-full md:w-[800px] bg-white/70 saturate-[1.8] backdrop-blur-xl border-white/60 rounded-[32px] md:rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.08)] px-4 py-2
                `} 
                style={{ transformOrigin: 'top center' }}
            >
                
                {/* Brand / Store (Left) */}
                <a href="/store" className="flex items-center gap-2 bg-white/20 backdrop-blur-md border border-white/30 shadow-sm rounded-full pl-3 pr-4 h-9 transition-colors hover:bg-white/30 text-primary shrink-0">
                    <Store size={16} strokeWidth={2.5} />
                    <span className="text-[10px] md:text-[11px] font-bold tracking-widest uppercase mt-0.5">
                        STORE
                    </span>
                </a>

                {/* Location (Center) */}
                <div className="absolute left-1/2 -translate-x-1/2 flex items-center cursor-pointer group hidden md:flex">
                    <span className="text-[9px] md:text-[11px] font-bold uppercase tracking-[0.15em] text-primary">
                        BALI, INDONESIA
                    </span>
                </div>

                {/* Desktop Inline Links */}
                <nav className={`flex items-center gap-4 md:gap-8 overflow-x-auto no-scrollbar pl-4 md:pl-0`}>
                    {navItems.map((item) => {
                        const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
                        return (
                            <a 
                                key={item.href}
                                href={item.href} 
                                className={`text-[11px] md:text-[13px] font-semibold tracking-wider transition-colors whitespace-nowrap ${
                                    isActive ? 'text-primary' : 'text-primary/60 hover:text-primary'
                                }`}
                            >
                                {item.label}
                            </a>
                        );
                    })}
                </nav>

            </header>
        </div>
    );
}
