import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ShoppingBag } from 'lucide-react';
import { NAV_LINKS, GENERATE_WA_LINK } from '../constants';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const isHomeTop = location.pathname === '/' && !scrolled;

    return (
        <>
            <header
                className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ease-in-out ${!isHomeTop ? 'py-3.5 bg-background/90 backdrop-blur-md border-b border-border/60' : 'py-6 bg-transparent'
                    }`}
            >
                <div className="max-w-[1600px] mx-auto px-6 md:px-12 flex justify-between items-center">

                    {/* Mobile Menu Trigger */}
                    <button onClick={() => setIsOpen(true)} className={`md:hidden w-10 h-10 flex justify-center items-center transition-all ${isHomeTop ? 'text-white' : 'text-primary'}`}>
                        <Menu size={22} strokeWidth={1.5} />
                    </button>

                    {/* Desktop Left Nav */}
                    <nav className="hidden md:flex items-center gap-12">
                        {NAV_LINKS.slice(0, 2).map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                className={`text-[10px] font-sans font-bold uppercase tracking-[0.25em] transition-colors duration-500 hover:text-white/70 ${isHomeTop ? 'text-white' : (location.pathname === link.path ? 'text-primary' : 'text-text-muted hover:text-primary')}`}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </nav>

                    {/* Center Logo - Elegant Serif */}
                    <Link to="/" className="absolute left-1/2 -translate-x-1/2 group">
                        <h1 className={`font-serif text-[32px] font-normal tracking-[0.08em] uppercase text-center leading-none ${isHomeTop ? 'text-white' : 'text-primary'}`}>
                            Elexoir
                        </h1>
                    </Link>

                    {/* Desktop Right Nav */}
                    <nav className="hidden md:flex items-center gap-12">
                        {NAV_LINKS.slice(2).map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                className={`text-[10px] font-sans font-bold uppercase tracking-[0.25em] transition-colors duration-500 hover:text-white/70 ${isHomeTop ? 'text-white' : (location.pathname === link.path ? 'text-primary' : 'text-text-muted hover:text-primary')}`}
                            >
                                {link.name}
                            </Link>
                        ))}
                        <Link to="/prices" className={`flex items-center gap-2 transition-all duration-500 ml-4 group ${isHomeTop ? 'text-white hover:text-white/70' : 'text-primary hover:text-text-muted'}`}>
                            <span className="text-[10px] font-sans font-bold uppercase tracking-[0.25em] hidden xl:block">Reserve</span>
                            <ShoppingBag size={17} strokeWidth={1.5} />
                        </Link>
                    </nav>

                    <Link
                        to="/prices"
                        className={`md:hidden flex items-center justify-center w-10 h-10 transition-all ${isHomeTop ? 'text-white' : 'text-primary'}`}
                    >
                        <ShoppingBag size={19} strokeWidth={1.5} />
                    </Link>

                </div>
            </header>

            {/* Full Screen Mobile Menu - Formal Black Luxury */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.4 }}
                        className="fixed inset-0 z-[100] bg-primary flex flex-col items-center justify-center p-6 lg:hidden"
                    >
                        <button onClick={() => setIsOpen(false)} className="absolute top-8 right-8 w-14 h-14 flex items-center justify-center text-white transition-all z-10">
                            <X size={28} strokeWidth={1.5} />
                        </button>

                        <div className="flex flex-col gap-10 text-center relative z-10 w-full">
                            {NAV_LINKS.map((link, i) => (
                                <motion.div
                                    key={link.name}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1, duration: 0.6, ease: "easeOut" }}
                                >
                                    <Link
                                        to={link.path}
                                        onClick={() => setIsOpen(false)}
                                        className="font-serif text-5xl text-white hover:text-white/70 transition-colors block font-light tracking-wide italic"
                                    >
                                        {link.name}
                                    </Link>
                                </motion.div>
                            ))}

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4, duration: 0.6 }}
                                className="mt-12"
                            >
                                <a href={GENERATE_WA_LINK()} className="inline-block px-12 py-5 border border-white text-white font-sans font-medium text-[11px] uppercase tracking-[0.2em] hover:bg-white hover:text-primary transition-all text-center">
                                    Book via WhatsApp
                                </a>
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Navbar;
