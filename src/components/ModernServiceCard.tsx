import React from 'react';
import { motion } from 'framer-motion';
import { ServiceItem } from '@/lib/types';
import { parseServiceOptions } from '@/lib/constants';
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
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            onClick={() => onView(service)}
            className="group relative flex flex-col cursor-pointer w-full bg-transparent transition-all duration-500"
        >
            {/* Image Container */}
            <div className="relative aspect-[4/5] w-full overflow-hidden mb-4">
                <img
                    src={service.image}
                    alt={`${service.name} - Home Massage Ubud Bali`}
                    className="w-full h-full object-cover transition-transform duration-[2s] ease-out group-hover:scale-105"
                />
            </div>

            {/* Content Section - Extremely Minimal */}
            <div className="flex flex-col px-1">
                <h3 className="font-sans font-medium text-sm text-secondary tracking-wide mb-1 transition-colors group-hover:text-text-muted">
                    {service.name}
                </h3>
                <div className="flex items-center gap-2">
                    <p className="text-[10px] font-sans font-semibold uppercase tracking-[0.1em] text-text-muted">
                        {startingPrice} IDR
                    </p>
                    <span className="text-[8px] text-border/80">•</span>
                    <p className="text-[10px] font-sans font-light text-text-muted/80">
                        {durationDisplay}
                    </p>
                </div>
            </div>
        </motion.div>
    );
};

export default ModernServiceCard;
