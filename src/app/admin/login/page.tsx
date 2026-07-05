'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Mail, ArrowRight } from 'lucide-react';

export default function AdminLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        router.push('/admin');
        router.refresh();
    };

    return (
        <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white/40 backdrop-blur-3xl rounded-[32px] shadow-[0_20px_40px_rgb(0,0,0,0.08)] p-8 border border-white/50">
                <div className="text-center mb-8">
                    <h1 className="font-serif text-3xl text-primary font-medium mb-2">Admin Access</h1>
                    <p className="text-sm text-text-muted">Enter your credentials to continue</p>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm mb-6 text-center border border-red-100">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-5">
                    <div>
                        <label className="block text-xs font-bold tracking-widest uppercase text-primary/70 mb-2 ml-1">Email</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                                <Mail className="h-4 w-4 text-text-muted" />
                            </div>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-white/10 backdrop-blur-[40px] border border-white/40 shadow-[0_8px_32px_0_rgba(0,0,0,0.1),inset_0_1px_1px_rgba(255,255,255,1)] rounded-2xl h-[50px] pl-11 pr-4 text-sm text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                placeholder="admin@example.com"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold tracking-widest uppercase text-primary/70 mb-2 ml-1">Password</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                                <Lock className="h-4 w-4 text-text-muted" />
                            </div>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-white/10 backdrop-blur-[40px] border border-white/40 shadow-[0_8px_32px_0_rgba(0,0,0,0.1),inset_0_1px_1px_rgba(255,255,255,1)] rounded-2xl h-[50px] pl-11 pr-4 text-sm text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full h-[50px] bg-primary text-white rounded-2xl text-sm font-semibold flex items-center justify-center gap-2 hover:bg-primary/90 transition-all disabled:opacity-70 mt-4"
                    >
                        {isLoading ? 'Authenticating...' : 'Sign In'}
                        {!isLoading && <ArrowRight className="w-4 h-4" />}
                    </button>
                </form>
            </div>
        </div>
    );
}
