'use client';

import React from 'react';
import { motion } from 'framer-motion';

const IMAGES = [
    { src: "https://images.pexels.com/photos/4004457/pexels-photo-4004457.jpeg?auto=compress&cs=tinysrgb&w=800", alt: "Flower Bath" },
    { src: "https://images.pexels.com/photos/3757952/pexels-photo-3757952.jpeg?auto=compress&cs=tinysrgb&w=800", alt: "Massage Detail" },
    { src: "https://images.pexels.com/photos/6663364/pexels-photo-6663364.jpeg?auto=compress&cs=tinysrgb&w=800", alt: "Couple Setup" },
    { src: "https://images.pexels.com/photos/6663595/pexels-photo-6663595.jpeg?auto=compress&cs=tinysrgb&w=800", alt: "Oils" },
    { src: "https://images.pexels.com/photos/5038166/pexels-photo-5038166.jpeg?auto=compress&cs=tinysrgb&w=800", alt: "Facial" },
];

export default function GalleryPage() {
    return (
        <div className="min-h-screen bg-background pb-24">
            {/* Mobile Header */}
            <div className="pt-14 pb-4 px-6 bg-surface/90 backdrop-blur-md sticky top-0 z-30 border-b border-border/60">
                <h1 className="font-serif text-3xl text-primary">Atmosphere</h1>
            </div>

            {/* Mobile Masonry / Feed */}
            <div className="px-4 py-6 flex flex-col gap-6">
                {IMAGES.map((img, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1, duration: 0.8 }}
                        className="rounded-3xl overflow-hidden bg-surface p-2 shadow-soft border border-border/80"
                    >
                        <div className="overflow-hidden rounded-2xl relative aspect-[4/5]">
                            <img
                                src={img.src}
                                alt={img.alt}
                                loading="lazy"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
