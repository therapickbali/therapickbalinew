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

type SpaContextType = {
    treatments: Treatment[];
    setTreatments: React.Dispatch<React.SetStateAction<Treatment[]>>;
    campaign: Campaign | null;
    setCampaign: (c: Campaign | null) => void;
    products: Product[];
    setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
    cartItems: CartItem[];
    addToCart: (product: Product, quantity: number) => void;
    updateCartQuantity: (productId: string, quantity: number) => void;
    removeFromCart: (productId: string) => void;
    clearCart: () => void;
    savedProducts: string[];
    toggleSavedProduct: (productId: string) => void;
};



const SpaContext = createContext<SpaContextType | undefined>(undefined);

export function SpaProvider({ children }: { children: ReactNode }) {
    const [treatments, setTreatments] = useState<Treatment[]>([]);
    const [campaign, setCampaign] = useState<Campaign | null>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [savedProducts, setSavedProducts] = useState<string[]>([]);

    useEffect(() => {
        async function loadData() {
            try {
                const [treatmentsRes, productsRes, campaignsRes] = await Promise.all([
                    supabase.from('treatments').select('*').eq('is_published', true),
                    supabase.from('products').select('*').eq('is_published', true),
                    supabase.from('campaigns').select('*').eq('is_published', true)
                ]);

                if (treatmentsRes.data && treatmentsRes.data.length > 0) setTreatments(treatmentsRes.data);
                if (productsRes.data && productsRes.data.length > 0) setProducts(productsRes.data);
                if (campaignsRes.data && campaignsRes.data.length > 0) setCampaign(campaignsRes.data[0]);
            } catch (error) {
                console.error("Error fetching data from Supabase:", error);
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
            cartItems, addToCart, updateCartQuantity, removeFromCart, clearCart,
            savedProducts, toggleSavedProduct
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
