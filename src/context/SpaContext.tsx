'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define structures
export type TreatmentOption = {
    duration: string; // e.g. "60 Min", "90 Min"
    price: string;    // e.g. "450,000"
};

export type Treatment = {
    id: string;
    title: string;
    category: string;
    desc: string;
    options: TreatmentOption[];
    bgPattern: string;
};

export type SelectedCampaignTreatment = {
    treatmentId: string;
    durations: string[]; // which durations are discounted
};

export type Product = {
    id: string;
    title: string;
    category: string;
    price: string;
    image: string;
    description: string;
    stock: number;
    howToUse?: string;
    ingredients?: string;
};

export type Campaign = {
    title: string;
    label: string;
    description: string;
    duration: string; // e.g., "1_month"
    discountPercentage: number;
    selectedTreatments: SelectedCampaignTreatment[];
};

type SpaContextType = {
    treatments: Treatment[];
    setTreatments: React.Dispatch<React.SetStateAction<Treatment[]>>;
    campaign: Campaign | null;
    setCampaign: (c: Campaign | null) => void;
    products: Product[];
    setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
};

// Initial static treatments
const INITIAL_TREATMENTS: Treatment[] = [
    { 
        id: 't1',
        title: 'Deep Tissue Flow', 
        category: 'Massage', 
        desc: 'Relieve deep-seated tension with firm pressure and focused strokes. Ideal for muscle recovery.',
        bgPattern: 'from-secondary/10 via-white to-white',
        options: [
            { duration: '60 Min', price: '350,000' },
            { duration: '90 Min', price: '450,000' }
        ]
    },
    { 
        id: 't2',
        title: 'Radiance Facial', 
        category: 'Facial', 
        desc: 'Restore your natural glow with organic botanical extracts, gentle exfoliation, and a restorative mask.',
        bgPattern: 'from-accent/10 via-white to-white',
        options: [
            { duration: '60 Min', price: '350,000' }
        ]
    },
    { 
        id: 't3',
        title: 'Couples Retreat', 
        category: 'Package', 
        desc: 'A synchronized full-body massage experience designed for ultimate shared relaxation and harmony.',
        bgPattern: 'from-primary/5 via-white to-white',
        options: [
            { duration: '120 Min', price: '1,200,000' }
        ]
    },
];

const INITIAL_CAMPAIGN: Campaign = {
    title: 'Summer Retreat',
    label: 'Limited Offer',
    description: 'Rejuvenate your mind and body with our exclusive summer packages. Enjoy special discounts on signature treatments.',
    duration: '1_month',
    discountPercentage: 20,
    selectedTreatments: [
        { treatmentId: 't2', durations: ['60 Min'] },
        { treatmentId: 't3', durations: ['120 Min'] }
    ]
};

const INITIAL_PRODUCTS: Product[] = [
    {
        id: 'p1',
        title: 'Signature Massage Oil',
        category: 'Oils',
        price: '350,000',
        image: 'https://images.pexels.com/photos/6724391/pexels-photo-6724391.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop',
        description: 'A deeply nourishing blend of cold-pressed coconut oil, ylang-ylang, and sweet orange. Calms the mind and softens the skin.',
        stock: 10,
        howToUse: 'Warm a few drops in your palms and massage gently into the skin using sweeping motions. Best applied after a warm bath.',
        ingredients: 'Cold-pressed Coconut Oil, Ylang-ylang Extract, Sweet Orange Essential Oil, Vitamin E.'
    },
    {
        id: 'p2',
        title: 'Serenity Aromatherapy Candle',
        category: 'Home Fragrance',
        price: '280,000',
        image: 'https://images.pexels.com/photos/1012558/pexels-photo-1012558.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop',
        description: 'Hand-poured soy wax candle infused with pure lavender and chamomile essential oils. Burns for up to 40 hours.',
        stock: 5,
        howToUse: 'Trim the wick to 1/4 inch before each use. Burn for no longer than 4 hours at a time.',
        ingredients: '100% Natural Soy Wax, Pure Lavender Essential Oil, Chamomile Essential Oil, Cotton Wick.'
    },
    {
        id: 'p3',
        title: 'Exfoliating Coffee Scrub',
        category: 'Body Care',
        price: '220,000',
        image: 'https://images.pexels.com/photos/4465831/pexels-photo-4465831.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop',
        description: 'Locally sourced organic Balinese coffee blended with sea salt and nourishing oils to rejuvenate your skin.',
        stock: 20,
        howToUse: 'Gently scrub over damp skin in circular motions, focusing on rough areas. Rinse thoroughly with warm water.',
        ingredients: 'Organic Balinese Coffee Grounds, Sea Salt, Sweet Almond Oil, Jojoba Oil.'
    }
];

const SpaContext = createContext<SpaContextType | undefined>(undefined);

export function SpaProvider({ children }: { children: ReactNode }) {
    const [treatments, setTreatments] = useState<Treatment[]>(INITIAL_TREATMENTS);
    const [campaign, setCampaign] = useState<Campaign | null>(INITIAL_CAMPAIGN);
    const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);

    return (
        <SpaContext.Provider value={{ treatments, setTreatments, campaign, setCampaign, products, setProducts }}>
            {children}
        </SpaContext.Provider>
    );
}

export function useSpa() {
    const context = useContext(SpaContext);
    if (context === undefined) {
        throw new Error('useSpa must be used within a SpaProvider');
    }
    return context;
}
