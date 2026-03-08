
import React from 'react';
import { motion } from 'framer-motion';
import { ServiceItem } from '../types';
import { parseServiceOptions } from '../constants';
import { Clock, ArrowRight } from 'lucide-react';

interface Props {
    service: ServiceItem;
    onView: (service: ServiceItem) => void;
    domRef?: (el: HTMLDivElement | null) => void;
}

const ModernServiceCard: React.FC<Props> = ({ service, onView, domRef }) => {
    const options = parseServiceOptions(service);
    const startingPrice = options[0].price.replace('IDR', '').trim();
    const durationDisplay = options[0].duration.toUpperCase();

    return (
        <motion.div 
            ref={domRef}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            onClick={() => onView(service)}
            className="group relative flex flex-col cursor-pointer w-full bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-stone-100"
        >
            {/* Image Container */}
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-100">
                <img 
                    src={service.image} 
                    alt={`${service.name} - Home Massage Ubud Bali`}
                    className="w-full h-full object-cover transition-transform duration-[2s] ease-out group-hover:scale-105 will-change-transform"
                />
                
                {/* Subtle Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/10 transition-opacity duration-500"></div>
                
                {/* Category Tag */}
                <div className="absolute top-4 left-4">
                    <span className="px-4 py-2 bg-white/95 backdrop-blur-md text-secondary text-[8px] font-sans font-semibold uppercase tracking-[0.3em] rounded-full shadow-sm">
                        {service.category}
                    </span>
                </div>

                {/* Price Tag (Property Style) */}
                <div className="absolute bottom-4 left-4">
                    <span className="text-white font-serif text-3xl font-light drop-shadow-md">
                        {startingPrice} <span className="text-[10px] font-sans font-semibold uppercase tracking-[0.2em] opacity-80 ml-1">IDR</span>
                    </span>
                </div>
            </div>

            {/* Content Section */}
            <div className="flex flex-col flex-grow p-6 md:p-8">
                <div className="flex justify-between items-start mb-3">
                    <h3 className="font-serif text-3xl font-light text-secondary leading-tight group-hover:text-primary transition-colors duration-500">
                        {service.name}
                    </h3>
                </div>

                <p className="text-sm text-stone-500 font-light leading-relaxed mb-8 line-clamp-2">
                    {service.description.split('Benefits:')[0]}
                </p>

                <div className="mt-auto flex items-center justify-between border-t border-stone-100/50 pt-5">
                    <div className="flex items-center gap-2 text-[9px] font-sans font-semibold uppercase tracking-[0.3em] text-stone-400">
                        <Clock size={12} className="text-stone-300" />
                        <span>{durationDisplay}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[9px] font-sans font-semibold uppercase tracking-[0.3em] text-primary bg-primary/5 px-5 py-2.5 rounded-full group-hover:bg-primary group-hover:text-white transition-colors duration-500">
                        <span>View Details</span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default ModernServiceCard;
