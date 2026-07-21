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
    therapist_id?: string;
    created_at?: string;
    updated_at?: string;
};

export type Therapist = { 
    id: string; 
    name: string; 
    bio: string; 
    image_url: string; 
    rating: number; 
    is_active: boolean; 
    brand: string; 
    whatsapp?: string;
    location?: string;
    email?: string;
    online_status?: 'Online' | 'Busy' | 'Off';
    available_at?: string;
    latitude?: number;
    longitude?: number;
    created_at?: string;
    updated_at?: string;
};

export type PartnerTherapist = {
    id: string;
    partner_id: string;
    name: string;
    bio?: string;
    image_url?: string;
    online_status?: string;
    available_at?: string;
    is_active?: boolean;
    created_at?: string;
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
    treatment_id: string;
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
    cartItems: CartItem[];
    addToCart: (product: Product, quantity: number) => void;
    updateCartQuantity: (productId: string, quantity: number) => void;
    removeFromCart: (productId: string) => void;
    clearCart: () => void;
    savedProducts: string[];
    toggleSavedProduct: (productId: string) => void;
    isLoading: boolean;
    siteBrandFilter: string;
    setSiteBrandFilter: (brand: string) => void;
    therapists: Therapist[];
    setTherapists: React.Dispatch<React.SetStateAction<Therapist[]>>;
    isFetchingTherapists: boolean;
    partnerTherapists: PartnerTherapist[];
    setPartnerTherapists: React.Dispatch<React.SetStateAction<PartnerTherapist[]>>;
};



export function processTherapistStatus(t: Therapist): Therapist {
    const now = new Date();
    const localNow = new Date(now.getTime() - (now.getTimezoneOffset() * 60000));
    const todayStr = localNow.toISOString().split('T')[0];
    const currentTimeStr = now.toTimeString().split(' ')[0].substring(0, 5);

    let finalStatus = t.online_status;
    let finalAvailableAt = t.available_at;

    // Auto-reset to Online if the status was updated on a previous calendar day
    if (t.updated_at) {
        const updatedDate = new Date(t.updated_at);
        const localUpdated = new Date(updatedDate.getTime() - (now.getTimezoneOffset() * 60000));
        const updatedDateStr = localUpdated.toISOString().split('T')[0];

        if (updatedDateStr < todayStr) {
            finalStatus = 'Online';
            finalAvailableAt = undefined;
        }
    }

    if (finalStatus === 'Busy' && finalAvailableAt) {
        const parts = finalAvailableAt.split('|');
        const dateStr = parts.length === 2 ? parts[0] : null;
        const timeStr = parts.length === 2 ? parts[1] : finalAvailableAt;
        
        finalAvailableAt = timeStr;

        if (dateStr) {
            if (dateStr < todayStr) {
                finalStatus = 'Online';
                finalAvailableAt = undefined;
            } else if (dateStr === todayStr && currentTimeStr >= timeStr) {
                finalStatus = 'Online';
                finalAvailableAt = undefined;
            }
        } else {
            if (currentTimeStr >= timeStr) {
                finalStatus = 'Online';
                finalAvailableAt = undefined;
            }
        }
    }

    return { ...t, online_status: finalStatus, available_at: finalAvailableAt };
}

const SpaContext = createContext<SpaContextType | undefined>(undefined);

export function SpaProvider({ children }: { children: ReactNode }) {
    const [treatments, setTreatments] = useState<Treatment[]>([]);
    const [campaign, setCampaign] = useState<Campaign | null>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [savedProducts, setSavedProducts] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [siteBrandFilter, setSiteBrandFilter] = useState<string>(process.env.NEXT_PUBLIC_SITE_BRAND || 'elexoir');
    const [therapists, setTherapists] = useState<Therapist[]>([]);
    const [isFetchingTherapists, setIsFetchingTherapists] = useState<boolean>(true);
    const [partnerTherapists, setPartnerTherapists] = useState<PartnerTherapist[]>([]);

    useEffect(() => {
        async function loadData() {
            let hasCache = false;
            try {
                const cachedTreatments = localStorage.getItem('spa_treatments');
                const cachedProducts = localStorage.getItem('spa_products');
                const cachedCampaign = localStorage.getItem('spa_campaign');

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

                if (hasCache) {
                    setIsLoading(false); // Hide skeleton if we have cached data
                }
            } catch (e) {
                console.error("Error reading from localStorage", e);
            }

            try {
                const siteBrand = siteBrandFilter;
                const [treatmentsRes, productsRes, campaignsRes, therapistsRes, partnerTherapistsRes] = await Promise.all([
                    supabase.from('treatments').select('*').eq('is_published', true).order('created_at', { ascending: false }),
                    supabase.from('products').select('*').eq('is_published', true).order('created_at', { ascending: false }),
                    supabase.from('campaigns').select('*').eq('is_published', true).order('created_at', { ascending: false }),
                    supabase.from('therapists').select('*').eq('is_active', true).order('created_at', { ascending: false }),
                    supabase.from('partner_therapists').select('*').order('created_at', { ascending: false })
                ]);

                if (treatmentsRes.data) {
                    setTreatments(treatmentsRes.data);
                    try { localStorage.setItem('spa_treatments', JSON.stringify(treatmentsRes.data)); } catch(e) { console.warn("Cache full"); }
                } else if (treatmentsRes.error) {
                    setTreatments([]);
                    localStorage.removeItem('spa_treatments');
                }

                if (productsRes.data) {
                    setProducts(productsRes.data);
                    try { localStorage.setItem('spa_products', JSON.stringify(productsRes.data)); } catch(e) { console.warn("Cache full"); }
                } else if (productsRes.error) {
                    setProducts([]);
                    localStorage.removeItem('spa_products');
                }

                if (campaignsRes.data && campaignsRes.data.length > 0) {
                    setCampaign(campaignsRes.data[0] as Campaign);
                    localStorage.setItem('spa_campaign', JSON.stringify(campaignsRes.data[0]));
                } else if (campaignsRes.data || campaignsRes.error) {
                    setCampaign(null);
                    localStorage.removeItem('spa_campaign');
                }
                
                if (therapistsRes.data) {
                    const processedTherapists = therapistsRes.data.map(t => processTherapistStatus(t as Therapist));
                    setTherapists(processedTherapists);
                } else if (therapistsRes.error) {
                    setTherapists([]);
                }
                
                if (partnerTherapistsRes.data) {
                    setPartnerTherapists(partnerTherapistsRes.data);
                } else if (partnerTherapistsRes.error) {
                    setPartnerTherapists([]);
                }
                setIsFetchingTherapists(false);

                if (hasCache) {
                    setIsLoading(false);
                }
            } catch (error) {
                console.error("Error fetching data from Supabase:", error);
                // Do not fallback to mock data; just leave it empty.
                setTreatments([]);
            } finally {
                setIsLoading(false);
            }
        }

        loadData();

        // Subscribe to real-time updates for therapists table
        const therapistsSubscription = supabase
            .channel('public:therapists')
            .on(
                'postgres_changes',
                { event: 'UPDATE', schema: 'public', table: 'therapists' },
                (payload) => {
                    setTherapists((currentTherapists) => {
                        return currentTherapists.map((t) => {
                            if (t.id === payload.new.id) {
                                const updatedT = { ...t, ...payload.new } as Therapist;
                                return processTherapistStatus(updatedT);
                            }
                            return t;
                        });
                    });
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(therapistsSubscription);
        };
    }, [siteBrandFilter]);

    useEffect(() => {
        const interval = setInterval(() => {
            setTherapists((current) => {
                let changed = false;
                const next = current.map(t => {
                    const nextT = processTherapistStatus(t);
                    if (nextT.online_status !== t.online_status || nextT.available_at !== t.available_at) {
                        changed = true;
                    }
                    return nextT;
                });
                return changed ? next : current;
            });
        }, 15000);
        return () => clearInterval(interval);
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
            savedProducts, toggleSavedProduct,
            isLoading,
            siteBrandFilter,
            setSiteBrandFilter,
            therapists,
            setTherapists,
            isFetchingTherapists,
            partnerTherapists,
            setPartnerTherapists
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
