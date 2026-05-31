'use client';

import React, { useEffect, useState } from 'react';
import { Star, User } from 'lucide-react';

interface Review {
    id: string;
    authorName: string;
    authorPhotoUri: string;
    rating: number;
    text: string;
    relativePublishTimeDescription: string;
    publishTime: string;
}

interface ReviewsData {
    rating: number;
    userRatingCount: number;
    reviews: Review[];
}

export default function GoogleReviews() {
    const [data, setData] = useState<ReviewsData | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const res = await fetch('/api/reviews');
                if (res.ok) {
                    const result = await res.json();
                    setData(result);
                }
            } catch (error) {
                console.error("Failed to load reviews:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchReviews();
    }, []);

    if (isLoading) {
        return (
            <div className="py-24 flex justify-center items-center">
                <div className="animate-pulse flex flex-col items-center gap-4">
                    <div className="w-10 h-10 rounded-full border-2 border-t-primary border-transparent animate-spin"></div>
                    <div className="text-text-muted text-sm font-sans tracking-wide">Loading Guest Experiences...</div>
                </div>
            </div>
        );
    }

    if (!data || !data.reviews || data.reviews.length === 0) {
        return null;
    }

    return (
        <section className="py-20 md:py-28 bg-[#F5F5F7] overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                
                {/* Apple-style minimalist header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                    <div>
                        <h2 className="font-sans font-semibold text-3xl md:text-5xl tracking-tight text-primary mb-3">
                            Guest Experiences.
                        </h2>
                        <p className="text-text-muted text-lg font-sans max-w-xl">
                            Discover why our guests consider us the pinnacle of relaxation in Bali.
                        </p>
                    </div>
                    
                    {/* Overall Rating Pill */}
                    <div className="flex items-center gap-3 bg-white px-5 py-3 rounded-full shadow-sm w-fit border border-black/[0.04]">
                        <div className="flex gap-0.5">
                            <Star className="w-4 h-4 fill-[#F5A623] text-[#F5A623]" />
                        </div>
                        <span className="font-semibold text-primary font-sans">{data.rating}</span>
                        <span className="text-text-muted text-sm font-sans">({data.userRatingCount} Reviews)</span>
                    </div>
                </div>

                {/* Horizontal Scroll Container */}
                <div className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-12 pt-4 -mx-4 px-4 md:-mx-8 md:px-8 no-scrollbar" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                    {data.reviews.map((review) => (
                        <div 
                            key={review.id} 
                            className="bg-white rounded-3xl p-8 shadow-soft shrink-0 w-[85vw] md:w-[420px] snap-center flex flex-col justify-between border border-black/[0.04] transition-transform duration-300 hover:scale-[1.01]"
                        >
                            <div>
                                <div className="flex gap-1 mb-6">
                                    {[...Array(review.rating)].map((_, i) => (
                                        <Star key={i} className="w-4 h-4 fill-[#F5A623] text-[#F5A623]" />
                                    ))}
                                </div>
                                <p className="text-lg text-primary leading-relaxed font-sans mb-8">
                                    "{review.text}"
                                </p>
                            </div>
                            
                            <div className="flex items-center gap-4 mt-auto pt-6 border-t border-black/[0.04]">
                                {review.authorPhotoUri ? (
                                    <img 
                                        src={review.authorPhotoUri} 
                                        alt={review.authorName} 
                                        className="w-12 h-12 rounded-full object-cover shadow-sm bg-[#F5F5F7]" 
                                        loading="lazy"
                                    />
                                ) : (
                                    <div className="w-12 h-12 rounded-full bg-[#F5F5F7] text-text-muted flex items-center justify-center shadow-sm">
                                        <User className="w-5 h-5" />
                                    </div>
                                )}
                                <div className="flex flex-col">
                                    <h4 className="font-semibold text-primary text-base font-sans">{review.authorName}</h4>
                                    <span className="text-sm text-text-muted font-sans">{review.relativePublishTimeDescription}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
}
