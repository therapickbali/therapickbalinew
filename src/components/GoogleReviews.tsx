'use client';

import React, { useEffect, useState } from 'react';
import { Star, User, Quote, ChevronLeft, ChevronRight } from 'lucide-react';

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
    const [activeIdx, setActiveIdx] = useState(0);

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
                    <div className="w-12 h-12 rounded-full border-t-2 border-primary animate-spin"></div>
                    <div className="text-primary/50 text-sm font-serif">Loading Reviews...</div>
                </div>
            </div>
        );
    }

    if (!data || !data.reviews || data.reviews.length === 0) {
        return null;
    }

    const nextReview = () => {
        setActiveIdx((prev) => (prev + 1) % data.reviews.length);
    };

    const prevReview = () => {
        setActiveIdx((prev) => (prev - 1 + data.reviews.length) % data.reviews.length);
    };

    const review = data.reviews[activeIdx];

    return (
        <section className="py-24 bg-surface relative overflow-hidden">
            <div className="max-w-4xl mx-auto px-4 md:px-8 relative z-10">
                
                <div className="text-center mb-16">
                    <h2 className="font-serif text-3xl md:text-5xl text-primary mb-4">What Our Guests Say</h2>
                    <div className="flex items-center justify-center gap-3">
                        <div className="flex text-yellow-500">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} className="w-5 h-5 fill-current" />
                            ))}
                        </div>
                        <span className="font-bold text-primary">{data.rating} / 5</span>
                        <span className="text-text-muted text-sm">({data.userRatingCount} Google Reviews)</span>
                    </div>
                </div>

                <div className="relative">
                    {/* Decorative quotes */}
                    <Quote className="absolute -top-6 -left-6 md:-top-10 md:-left-10 w-20 h-20 text-primary/5 -z-10 rotate-180" />
                    <Quote className="absolute -bottom-6 -right-6 md:-bottom-10 md:-right-10 w-20 h-20 text-primary/5 -z-10" />
                    
                    <div className="bg-white rounded-[32px] p-8 md:p-12 shadow-sm border border-border/50 text-center min-h-[300px] flex flex-col justify-center relative transition-all">
                        <div className="mb-8">
                            <div className="flex justify-center mb-6">
                                <div className="flex gap-1 text-yellow-500">
                                    {[...Array(review.rating)].map((_, i) => (
                                        <Star key={i} className="w-5 h-5 fill-current" />
                                    ))}
                                </div>
                            </div>
                            <p className="text-lg md:text-2xl text-primary leading-relaxed font-serif italic max-w-2xl mx-auto line-clamp-6">
                                "{review.text}"
                            </p>
                        </div>
                        
                        <div className="flex flex-col items-center justify-center mt-auto">
                            {review.authorPhotoUri ? (
                                <img src={review.authorPhotoUri} alt={review.authorName} className="w-12 h-12 rounded-full mb-3 shadow-sm border border-border/50" />
                            ) : (
                                <div className="w-12 h-12 rounded-full bg-surface text-primary flex items-center justify-center mb-3 shadow-sm border border-border/50">
                                    <User className="w-5 h-5" />
                                </div>
                            )}
                            <h4 className="font-bold text-primary text-sm">{review.authorName}</h4>
                            <span className="text-xs text-text-muted mt-1">{review.relativePublishTimeDescription}</span>
                        </div>
                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex justify-center gap-4 mt-8">
                        <button 
                            onClick={prevReview}
                            className="w-12 h-12 rounded-full bg-white border border-border/50 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all shadow-sm"
                            aria-label="Previous Review"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button 
                            onClick={nextReview}
                            className="w-12 h-12 rounded-full bg-white border border-border/50 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all shadow-sm"
                            aria-label="Next Review"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>

            </div>
        </section>
    );
}
