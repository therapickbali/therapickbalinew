
import React from 'react';
import { Link } from 'react-router-dom';
import { WHATSAPP_NUMBER } from '../constants';

const Footer: React.FC = () => {
  return (
    <footer className="bg-secondary text-white pt-16 pb-10 border-t border-white/10">
      <div className="max-w-[1400px] mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="md:col-span-2">
            <span className="font-serif text-4xl font-light block mb-6 tracking-tight">ELEXOIR<span className="text-primary italic">.</span></span>
            <p className="text-white/50 text-sm font-light max-w-xs leading-relaxed">
                The essence of Bali, brought to your doorstep. Professional mobile spa services for the discerning traveler.
            </p>
        </div>
        <div>
            <h4 className="text-[9px] font-sans font-semibold uppercase tracking-[0.4em] mb-6 text-primary">Explore</h4>
            <ul className="space-y-4 text-sm font-light text-white/50">
                <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
                <li><Link to="/prices" className="hover:text-white transition-colors">Treatments</Link></li>
                <li><Link to="/about" className="hover:text-white transition-colors">Our Story</Link></li>
            </ul>
        </div>
        <div>
            <h4 className="text-[9px] font-sans font-semibold uppercase tracking-[0.4em] mb-6 text-primary">Connect</h4>
            <ul className="space-y-4 text-sm font-light text-white/50">
                <li>+{WHATSAPP_NUMBER}</li>
                <li>book@elexoirbali.com</li>
            </ul>
        </div>
      </div>
      <div className="max-w-[1400px] mx-auto px-6 mt-16 pt-8 border-t border-white/10 text-[9px] font-sans font-semibold text-white/30 uppercase tracking-[0.4em] flex justify-between">
        <p>&copy; {new Date().getFullYear()} Elexoir.</p>
        <p>Privacy Policy</p>
      </div>
    </footer>
  );
};

export default Footer;
