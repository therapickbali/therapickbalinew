'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Mail, Lock, User, MapPin, Sparkles, ChevronRight, UserCircle2 } from 'lucide-react';
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
        speciality: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        
        // Simulate network request
        setTimeout(() => {
            setIsLoading(false);
            router.push('/therapistdashboard');
        }, 1500);
    };

    return (
        <main className="min-h-screen bg-[#FDFDFD] selection:bg-primary/10 relative overflow-hidden flex flex-col">

            {/* Custom App-like Back Button */}
            <div className="absolute top-6 left-4 z-50">
                <button 
                    onClick={() => router.push('/')}
                    className="w-10 h-10 bg-white/40 backdrop-blur-md rounded-full flex items-center justify-center text-primary shadow-sm hover:bg-white/60 transition-colors"
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
                    {/* Header */}
                    <div className="text-center mb-10">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="w-16 h-16 rounded-full bg-white border border-border/50 shadow-sm flex items-center justify-center mx-auto mb-6"
                        >
                            <UserCircle2 className="w-8 h-8 text-primary/80" />
                        </motion.div>
                        <h1 className="font-serif text-3xl md:text-4xl text-primary mb-3">Therapist Portal</h1>
                        <p className="text-text-muted text-sm px-4">
                            {isLogin 
                                ? "Welcome back. Access your schedule and manage your sessions." 
                                : "Join our elite network of professional therapists in Bali."}
                        </p>
                    </div>

                    {/* Main Card */}
                    <div className="bg-white/40 backdrop-blur-[40px] border border-white/60 rounded-[32px] p-6 sm:p-8 shadow-[inset_0_1px_1px_rgba(255,255,255,1),0_24px_48px_-12px_rgba(0,0,0,0.05)]">
                        
                        {/* Toggle */}
                        <div className="flex p-1 bg-surface/50 border border-border/50 rounded-2xl mb-8 relative">
                            <motion.div
                                className="absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white rounded-xl shadow-sm"
                                animate={{ left: isLogin ? '4px' : 'calc(50%)' }}
                                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                            />
                            <button
                                type="button"
                                onClick={() => setIsLogin(true)}
                                className={`flex-1 py-2.5 text-sm font-bold z-10 transition-colors ${isLogin ? 'text-primary' : 'text-text-muted hover:text-primary/70'}`}
                            >
                                Log In
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsLogin(false)}
                                className={`flex-1 py-2.5 text-sm font-bold z-10 transition-colors ${!isLogin ? 'text-primary' : 'text-text-muted hover:text-primary/70'}`}
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
                                                    <User className="h-5 w-5 text-text-muted/50" />
                                                </div>
                                                <input
                                                    type="text"
                                                    
                                                    value={formData.name}
                                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                                    className="w-full bg-white/50 border border-border/50 rounded-2xl py-3.5 pl-12 pr-4 text-sm text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all"
                                                    placeholder="Full Name"
                                                />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="relative">
                                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                        <MapPin className="h-5 w-5 text-text-muted/50" />
                                                    </div>
                                                    <select
                                                        
                                                        value={formData.location}
                                                        onChange={(e) => setFormData({...formData, location: e.target.value})}
                                                        className="w-full bg-white/50 border border-border/50 rounded-2xl py-3.5 pl-12 pr-4 text-sm text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all appearance-none"
                                                    >
                                                        <option value="" disabled>Location</option>
                                                        <option value="Ubud">Ubud</option>
                                                        <option value="Canggu">Canggu</option>
                                                        <option value="Seminyak">Seminyak</option>
                                                    </select>
                                                </div>
                                                <div className="relative">
                                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                        <Sparkles className="h-5 w-5 text-text-muted/50" />
                                                    </div>
                                                    <input
                                                        type="text"
                                                        
                                                        value={formData.speciality}
                                                        onChange={(e) => setFormData({...formData, speciality: e.target.value})}
                                                        className="w-full bg-white/50 border border-border/50 rounded-2xl py-3.5 pl-12 pr-4 text-sm text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all"
                                                        placeholder="Specialty"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Mail className="h-5 w-5 text-text-muted/50" />
                                        </div>
                                        <input
                                            type="email"
                                            
                                            value={formData.email}
                                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                                            className="w-full bg-white/50 border border-border/50 rounded-2xl py-3.5 pl-12 pr-4 text-sm text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all"
                                            placeholder="Email Address"
                                        />
                                    </div>

                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Lock className="h-5 w-5 text-text-muted/50" />
                                        </div>
                                        <input
                                            type="password"
                                            
                                            value={formData.password}
                                            onChange={(e) => setFormData({...formData, password: e.target.value})}
                                            className="w-full bg-white/50 border border-border/50 rounded-2xl py-3.5 pl-12 pr-4 text-sm text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all"
                                            placeholder="Password"
                                        />
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
