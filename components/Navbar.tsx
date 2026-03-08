
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
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

  return (
    <>
      <header 
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
            scrolled ? 'py-3 bg-surface/80 backdrop-blur-md shadow-sm' : 'py-6 bg-transparent'
        }`}
      >
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 flex justify-between items-center">
            
            {/* Mobile Menu Trigger */}
            <button onClick={() => setIsOpen(true)} className="md:hidden text-secondary">
                <Menu size={24} strokeWidth={1.5} />
            </button>

            {/* Desktop Left Nav */}
            <nav className="hidden md:flex items-center gap-8">
                {NAV_LINKS.slice(0, 2).map((link) => (
                    <Link 
                        key={link.name} 
                        to={link.path}
                        className={`text-[9px] font-sans font-semibold uppercase tracking-[0.3em] hover:text-primary transition-colors ${location.pathname === link.path ? 'text-primary' : 'text-text-muted'}`}
                    >
                        {link.name}
                    </Link>
                ))}
            </nav>

            {/* Center Logo - Keeping the requested Logo */}
            <Link to="/" className="flex items-center gap-2 group absolute left-1/2 -translate-x-1/2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-primary transition-transform duration-500 group-hover:rotate-180">
                  <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a4.5 4.5 0 110-9 4.5 4.5 0 010 9zM2.25 12a.75.75 0 01.75-.75H5.25a.75.75 0 010 1.5H3a.75.75 0 01-.75-.75zM6.166 17.834a.75.75 0 00-1.06 1.06l1.59 1.591a.75.75 0 101.06-1.061l-1.59-1.59z" />
                </svg>
                <span className="font-sans font-extrabold tracking-tighter text-xl text-secondary">elexoir</span>
            </Link>

            {/* Desktop Right Nav */}
            <nav className="hidden md:flex items-center gap-8">
                {NAV_LINKS.slice(2).map((link) => (
                    <Link 
                        key={link.name} 
                        to={link.path}
                        className={`text-[9px] font-sans font-semibold uppercase tracking-[0.3em] hover:text-primary transition-colors ${location.pathname === link.path ? 'text-primary' : 'text-text-muted'}`}
                    >
                        {link.name}
                    </Link>
                ))}
                <div className="w-[1px] h-4 bg-border"></div>
                <Link to="/prices" className="flex items-center gap-2 text-secondary hover:text-primary transition-colors">
                    <ShoppingBag size={16} strokeWidth={1.5} />
                    <span className="text-[9px] font-sans font-semibold uppercase tracking-[0.3em] hidden lg:inline">Reserve</span>
                </Link>
            </nav>

            {/* Mobile Cart Trigger */}
             <Link 
                to="/prices" 
                className="md:hidden flex items-center justify-center w-10 h-10 rounded-full bg-surface border border-border text-secondary hover:text-primary transition-all shadow-sm active:scale-95"
                aria-label="Reserve"
            >
                <ShoppingBag size={18} strokeWidth={1.5} />
            </Link>

        </div>
      </header>

      {/* Full Screen Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background flex flex-col items-center justify-center"
          >
            <button onClick={() => setIsOpen(false)} className="absolute top-8 right-8 p-2 text-secondary">
                <X size={32} strokeWidth={1} />
            </button>

            <div className="flex flex-col gap-8 text-center">
                {NAV_LINKS.map((link, i) => (
                    <motion.div
                        key={link.name}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                    >
                        <Link 
                            to={link.path} 
                            onClick={() => setIsOpen(false)}
                            className="font-serif text-5xl font-light text-secondary hover:text-primary italic transition-colors"
                        >
                            {link.name}
                        </Link>
                    </motion.div>
                ))}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="mt-8"
                >
                    <a href={GENERATE_WA_LINK()} className="inline-block px-8 py-4 bg-secondary text-background rounded-full font-sans font-semibold text-[10px] uppercase tracking-[0.3em] shadow-md">
                        WhatsApp Concierge
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
