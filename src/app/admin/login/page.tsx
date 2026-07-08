'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Mail, ArrowRight } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function AdminLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                setError(error.message);
                setIsLoading(false);
            } else {
                router.push('/admin');
                router.refresh();
            }
        } catch (err: any) {
            setError(err.message || 'An error occurred during login.');
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white/40 backdrop-blur-3xl rounded-[32px] shadow-[0_20px_40px_rgb(0,0,0,0.08)] p-8 border border-white/50">
                <div className="text-center mb-8">
                    <h1 className="font-serif text-3xl text-white font-medium mb-2">Admin Access</h1>
                    <p className="text-sm text-white/90-muted">Enter your credentials to continue</p>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm mb-6 text-center border border-red-100">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-5">
                    <div>
                        <label className="block text-xs font-bold tracking-widest uppercase text-white/70 mb-2 ml-1">Email</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                                <Mail className="h-4 w-4 text-white/90-muted" />
                            </div>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-white/5 border border-white/20 rounded-2xl h-[50px] pl-11 pr-4 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-white/40 transition-all appearance-none"
                                placeholder="admin@example.com"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold tracking-widest uppercase text-white/70 mb-2 ml-1">Password</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                                <Lock className="h-4 w-4 text-white/90-muted" />
                            </div>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-white/5 border border-white/20 rounded-2xl h-[50px] pl-11 pr-4 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-white/40 transition-all appearance-none"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full h-[50px] bg-white text-black rounded-2xl text-sm font-semibold flex items-center justify-center gap-2 hover:bg-white/90 transition-all disabled:opacity-70 mt-4"
                    >
                        {isLoading ? 'Authenticating...' : 'Sign In'}
                        {!isLoading && <ArrowRight className="w-4 h-4" />}
                    </button>
                </form>
            </div>
        </div>
    );
}
