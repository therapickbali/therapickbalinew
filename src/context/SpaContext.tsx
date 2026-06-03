'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';

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
    benefits?: string[];
    bgPattern: string;
    is_published?: boolean;
    is_pinned?: boolean;
    pinned_image?: string;
    created_at?: string;
    updated_at?: string;
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
    is_published?: boolean;
    created_at?: string;
    updated_at?: string;
};

export type CartItem = {
    product: Product;
    quantity: number;
};

export type Campaign = {
    id?: string;
    title: string;
    label: string;
    description: string;
    image?: string;
    duration: string; // e.g., "1_month"
    discountPercentage: number;
    selectedTreatments: SelectedCampaignTreatment[];
    is_published?: boolean;
    created_at?: string;
    updated_at?: string;
};

export type TherapistFee = {
    id: string;
    duration: string;
    fee: string;
    created_at?: string;
    updated_at?: string;
};

type SpaContextType = {
    treatments: Treatment[];
    setTreatments: React.Dispatch<React.SetStateAction<Treatment[]>>;
    campaign: Campaign | null;
    setCampaign: (c: Campaign | null) => void;
    products: Product[];
    setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
    therapistFees: TherapistFee[];
    setTherapistFees: React.Dispatch<React.SetStateAction<TherapistFee[]>>;
    cartItems: CartItem[];
    addToCart: (product: Product, quantity: number) => void;
    updateCartQuantity: (productId: string, quantity: number) => void;
    removeFromCart: (productId: string) => void;
    clearCart: () => void;
    savedProducts: string[];
    toggleSavedProduct: (productId: string) => void;
    isLoading: boolean;
};



const SpaContext = createContext<SpaContextType | undefined>(undefined);

export function SpaProvider({ children }: { children: ReactNode }) {
    const [treatments, setTreatments] = useState<Treatment[]>([]);
    const [campaign, setCampaign] = useState<Campaign | null>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [therapistFees, setTherapistFees] = useState<TherapistFee[]>([]);
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [savedProducts, setSavedProducts] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        async function loadData() {
            // Optimistically load from localStorage
            try {
                const cachedTreatments = localStorage.getItem('spa_treatments');
                const cachedProducts = localStorage.getItem('spa_products');
                const cachedCampaign = localStorage.getItem('spa_campaign');
                const cachedFees = localStorage.getItem('spa_fees');

                let hasCache = false;

                if (cachedTreatments) {
                    setTreatments(JSON.parse(cachedTreatments));
                    hasCache = true;
                }
                if (cachedProducts) {
                    setProducts(JSON.parse(cachedProducts));
                    hasCache = true;
                }
                if (cachedCampaign) {
                    setCampaign(JSON.parse(cachedCampaign));
                    hasCache = true;
                }
                if (cachedFees) {
                    setTherapistFees(JSON.parse(cachedFees));
                    hasCache = true;
                }

                if (hasCache) {
                    setIsLoading(false); // Hide skeleton if we have cached data
                }
            } catch (e) {
                console.error("Error reading from localStorage", e);
            }

            try {
                const [treatmentsRes, productsRes, campaignsRes, feesRes] = await Promise.all([
                    supabase.from('treatments').select('*').eq('is_published', true).order('created_at', { ascending: false }),
                    supabase.from('products').select('*').eq('is_published', true).order('created_at', { ascending: false }),
                    supabase.from('campaigns').select('*').eq('is_published', true).order('created_at', { ascending: false }),
                    supabase.from('therapist_fees').select('*').order('created_at', { ascending: false })
                ]);

                if (treatmentsRes.data && treatmentsRes.data.length > 0) {
                    setTreatments(treatmentsRes.data);
                    try { localStorage.setItem('spa_treatments', JSON.stringify(treatmentsRes.data)); } catch(e) { console.warn("Cache full"); }
                }
                if (productsRes.data && productsRes.data.length > 0) {
                    setProducts(productsRes.data);
                    try { localStorage.setItem('spa_products', JSON.stringify(productsRes.data)); } catch(e) { console.warn("Cache full"); }
                }
                if (campaignsRes.data && campaignsRes.data.length > 0) {
                    setCampaign(campaignsRes.data[0]);
                    try { localStorage.setItem('spa_campaign', JSON.stringify(campaignsRes.data[0])); } catch(e) { console.warn("Cache full"); }
                }
                if (feesRes.data && feesRes.data.length > 0) {
                    setTherapistFees(feesRes.data);
                    try { localStorage.setItem('spa_fees', JSON.stringify(feesRes.data)); } catch(e) { console.warn("Cache full"); }
                }
            } catch (error) {
                console.error("Error fetching data from Supabase:", error);
            } finally {
                setIsLoading(false);
            }
        }
        loadData();
    }, []);

    const toggleSavedProduct = (productId: string) => {
        setSavedProducts(prev => 
            prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]
        );
    };

    const addToCart = (product: Product, quantity: number) => {
        setCartItems(prev => {
            const existing = prev.find(item => item.product.id === product.id);
            if (existing) {
                return prev.map(item => item.product.id === product.id ? { ...item, quantity: item.quantity + quantity } : item);
            }
            return [...prev, { product, quantity }];
        });
    };

    const updateCartQuantity = (productId: string, quantity: number) => {
        setCartItems(prev => prev.map(item => item.product.id === productId ? { ...item, quantity } : item));
    };

    const removeFromCart = (productId: string) => {
        setCartItems(prev => prev.filter(item => item.product.id !== productId));
    };

    const clearCart = () => {
        setCartItems([]);
    };

    return (
        <SpaContext.Provider value={{ 
            treatments, setTreatments, campaign, setCampaign, products, setProducts,
            therapistFees, setTherapistFees,
            cartItems, addToCart, updateCartQuantity, removeFromCart, clearCart,
            savedProducts, toggleSavedProduct,
            isLoading
        }}>
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
