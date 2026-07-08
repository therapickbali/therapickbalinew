'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Mail, Lock, User, MapPin, ChevronRight, Eye, EyeOff, Phone, FileText, Upload } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import TopNav from '@/components/TopNav';

export default function TherapistLogin() {
    const router = useRouter();
    const [isLogin, setIsLogin] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        location: '',
        whatsapp: '',
        bio: '',
        image: null as File | null
    });
    const [showPassword, setShowPassword] = useState(false);

    const resizeImage = (file: File): Promise<string> => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const MAX_WIDTH = 400;
                    const MAX_HEIGHT = 400;
                    let width = img.width;
                    let height = img.height;

                    if (width > height) {
                        if (width > MAX_WIDTH) {
                            height *= MAX_WIDTH / width;
                            width = MAX_WIDTH;
                        }
                    } else {
                        if (height > MAX_HEIGHT) {
                            width *= MAX_HEIGHT / height;
                            height = MAX_HEIGHT;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx?.drawImage(img, 0, 0, width, height);
                    resolve(canvas.toDataURL('image/webp', 0.8));
                };
                img.src = e.target?.result as string;
            };
            reader.readAsDataURL(file);
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            if (isLogin) {
                const { error } = await supabase.auth.signInWithPassword({
                    email: formData.email,
                    password: formData.password,
                });
                
                if (error) throw error;
                router.push('/therapistdashboard');
                
            } else {
                // 1. Sign Up the User
                const { data: authData, error: authError } = await supabase.auth.signUp({
                    email: formData.email,
                    password: formData.password,
                });

                if (authError) throw authError;

                if (authData.user) {
                    let image_url = '';
                    if (formData.image) {
                        image_url = await resizeImage(formData.image);
                    }

                    // 2. Insert into therapists table as pending
                    const { error: dbError } = await supabase.from('therapists').insert([{
                        id: authData.user.id,
                        name: formData.name,
                        whatsapp: formData.whatsapp,
                        location: formData.location,
                        bio: formData.bio,
                        email: formData.email,
                        image_url: image_url,
                        brand: 'Therapick Bali',
                        is_active: false
                    }]);

                    if (dbError) throw dbError;

                    alert("Application submitted successfully! Please wait for admin approval before logging in.");
                    setIsLogin(true);
                }
            }
        } catch (err: any) {
            alert(err.message || "An error occurred.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-black selection:bg-white/10 relative overflow-hidden flex flex-col">

            {/* Custom App-like Back Button */}
            <div className="absolute top-6 left-4 z-50">
                <button 
                    onClick={() => router.push('/')}
                    className="w-10 h-10 bg-white/10 backdrop-blur-[40px] border border-white/40 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8)] rounded-full flex items-center justify-center text-white shadow-sm hover:bg-white/60 transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                </button>
            </div>

            {/* Minimal Background Gradients */}
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#E8E8E6] rounded-full blur-[100px] opacity-40 mix-blend-multiply pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-[#D5D5D1] rounded-full blur-[120px] opacity-30 mix-blend-multiply pointer-events-none" />

            <TopNav />

            <div className="flex-1 flex items-center justify-center relative z-10 px-4 pt-24 pb-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className="w-full max-w-md"
                >

                    {/* Main Card */}
                    <div className="bg-white/10 backdrop-blur-[40px] border border-white/40 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8)] rounded-[32px] p-6 sm:p-8">
                        
                        {/* Toggle */}
                        <div className="flex p-1 bg-surface/50 border border-white/20/50 rounded-2xl mb-8 relative">
                            <motion.div
                                className="absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white/20 rounded-xl shadow-sm"
                                animate={{ left: isLogin ? '4px' : 'calc(50%)' }}
                                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                            />
                            <button
                                type="button"
                                onClick={() => setIsLogin(true)}
                                className={`flex-1 py-2.5 text-sm font-bold z-10 transition-colors ${isLogin ? 'text-white' : 'text-white/90-muted hover:text-white/70'}`}
                            >
                                Log In
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsLogin(false)}
                                className={`flex-1 py-2.5 text-sm font-bold z-10 transition-colors ${!isLogin ? 'text-white' : 'text-white/90-muted hover:text-white/70'}`}
                            >
                                Sign Up
                            </button>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="relative">
                            <AnimatePresence mode="popLayout" initial={false}>
                                <motion.div
                                    key={isLogin ? 'login' : 'signup'}
                                    initial={{ opacity: 0, x: isLogin ? -20 : 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: isLogin ? 20 : -20 }}
                                    transition={{ duration: 0.3 }}
                                    className="space-y-4"
                                >
                                    {!isLogin && (
                                        <div className="space-y-4">
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                    <User className="h-5 w-5 text-white/90-muted/50" />
                                                </div>
                                                <input
                                                    type="text"
                                                    value={formData.name}
                                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                                    className="w-full bg-white/5 border border-white/20 rounded-2xl py-3.5 pl-12 pr-4 text-sm text-white placeholder:text-white/90-muted focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all appearance-none"
                                                    placeholder="Full Name"
                                                />
                                            </div>

                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                    <Phone className="h-5 w-5 text-white/90-muted/50" />
                                                </div>
                                                <input
                                                    type="tel"
                                                    value={formData.whatsapp}
                                                    onChange={(e) => setFormData({...formData, whatsapp: e.target.value})}
                                                    className="w-full bg-white/5 border border-white/20 rounded-2xl py-3.5 pl-12 pr-4 text-sm text-white placeholder:text-white/90-muted focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all appearance-none"
                                                    placeholder="WhatsApp Number"
                                                />
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="relative">
                                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                        <MapPin className="h-5 w-5 text-white/90-muted/50" />
                                                    </div>
                                                    <select
                                                        value={formData.location}
                                                        onChange={(e) => setFormData({...formData, location: e.target.value})}
                                                        className="w-full bg-white/5 border border-white/20 rounded-2xl py-3.5 pl-12 pr-4 text-sm text-white placeholder:text-white/90-muted focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all appearance-none"
                                                    >
                                                        <option value="" disabled>Location</option>
                                                        <option value="Ubud">Ubud</option>
                                                        <option value="Canggu">Canggu</option>
                                                        <option value="Seminyak">Seminyak</option>
                                                    </select>
                                                </div>
                                                <div className="relative">
                                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                        <Upload className="h-5 w-5 text-white/90-muted/50" />
                                                    </div>
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={(e) => setFormData({...formData, image: e.target.files?.[0] || null})}
                                                        className="w-full bg-white/5 border border-white/20 rounded-2xl py-3.5 pl-12 pr-4 text-sm text-white/90-muted file:mr-2 file:py-1 file:px-2 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-white/10 file:text-white hover:file:bg-white/20 transition-all cursor-pointer"
                                                    />
                                                </div>
                                            </div>

                                            <div className="relative">
                                                <div className="absolute top-3.5 left-4 pointer-events-none">
                                                    <FileText className="h-5 w-5 text-white/90-muted/50" />
                                                </div>
                                                <textarea
                                                    value={formData.bio}
                                                    onChange={(e) => setFormData({...formData, bio: e.target.value})}
                                                    className="w-full bg-white/5 border border-white/20 rounded-2xl py-3.5 pl-12 pr-4 text-sm text-white placeholder:text-white/90-muted focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all min-h-[100px] resize-y appearance-none"
                                                    placeholder="Short Bio"
                                                />
                                            </div>
                                        </div>
                                    )}

                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Mail className="h-5 w-5 text-white/90-muted/50" />
                                        </div>
                                        <input
                                            type="email"
                                            
                                            value={formData.email}
                                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                                            className="w-full bg-white/5 border border-white/20 rounded-2xl py-3.5 pl-12 pr-4 text-sm text-white placeholder:text-white/90-muted focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all appearance-none"
                                            placeholder="Email Address"
                                        />
                                    </div>

                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Lock className="h-5 w-5 text-white/90-muted/50" />
                                        </div>
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            value={formData.password}
                                            onChange={(e) => setFormData({...formData, password: e.target.value})}
                                            className="w-full bg-white/5 border border-white/20 rounded-2xl py-3.5 pl-12 pr-12 text-sm text-white placeholder:text-white/90-muted focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all appearance-none"
                                            placeholder="Password"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute inset-y-0 right-0 pr-4 flex items-center text-white/90-muted/50 hover:text-white/80 transition-colors"
                                        >
                                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </button>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full group bg-[#292831] text-white rounded-2xl py-4 px-6 text-sm font-bold shadow-md hover:bg-[#292831]/90 active:scale-[0.98] transition-all flex items-center justify-center mt-6 disabled:opacity-70"
                                    >
                                        {isLoading ? (
                                            <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                        ) : (
                                            <>
                                                {isLogin ? 'Access Dashboard' : 'Submit Application'}
                                                <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                            </>
                                        )}
                                    </button>
                                </motion.div>
                            </AnimatePresence>
                        </form>
                    </div>
                </motion.div>
            </div>
        </main>
    );
}
