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
    campaign: Campaign | null;
    setCampaign: (c: Campaign | null) => void;
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

const SpaContext = createContext<SpaContextType | undefined>(undefined);

export function SpaProvider({ children }: { children: ReactNode }) {
    const [treatments] = useState<Treatment[]>(INITIAL_TREATMENTS);
    const [campaign, setCampaign] = useState<Campaign | null>(INITIAL_CAMPAIGN);

    return (
        <SpaContext.Provider value={{ treatments, campaign, setCampaign }}>
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
