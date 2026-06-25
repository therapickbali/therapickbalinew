
import React from 'react';
import { Link } from 'react-router-dom';
import { WHATSAPP_NUMBER } from '../constants';

const Footer: React.FC = () => {
  return (
    <footer className="bg-surface text-primary pt-32 pb-16">
      <div className="max-w-[1400px] mx-auto px-6">

        {/* Massive Let's Talk CTA */}
        <div className="flex flex-col items-center text-center mb-28 relative">
          <div className="inline-block px-4 py-2 border border-border text-[10px] font-sans font-medium tracking-[0.2em] uppercase mb-12 text-text-muted">
            Available For Reservations
          </div>
          <h2 className="font-serif font-light text-5xl md:text-[90px] lg:text-[120px] text-primary leading-[1] tracking-[-0.02em] mb-8 cursor-default">
            Let's <span className="italic text-text-muted">Connect</span>
          </h2>
          <p className="text-base md:text-lg font-light max-w-xl text-text-muted mb-12 leading-relaxed">
            Allow us to bring the sanctuary to you. Experience the pinnacle of mobile spa serenity.
          </p>
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}`}
            className="bg-transparent border border-primary text-primary flex items-center gap-4 hover:bg-primary hover:text-white uppercase tracking-[0.2em] text-[11px] font-medium px-12 py-5 transition-colors duration-500 overflow-hidden group"
          >
            <span className="relative z-10">Book Your Session</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="relative z-10 group-hover:translate-x-1 transition-transform"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
          </a>
        </div>

        {/* Bottom Links Grid */}
        <div className="border-t border-border pt-12 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-[10px] font-sans font-light tracking-wide text-text-muted">
            &copy; {new Date().getFullYear()} Therapick Bali. All rights reserved.
          </div>

          <div className="flex gap-8 text-[9px] font-medium tracking-[0.2em] uppercase">
            <Link to="/" className="text-text-muted hover:text-secondary transition-colors">Home</Link>
            <Link to="/prices" className="text-text-muted hover:text-secondary transition-colors">Treatments</Link>
            <Link to="/about" className="text-text-muted hover:text-secondary transition-colors">Story</Link>
          </div>
        </div>
      </div>
    </footer>
  );};

export default Footer;
