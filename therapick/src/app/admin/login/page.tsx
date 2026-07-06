'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Mail, ArrowRight, ChevronLeft, User, Phone, MapPin, Upload, FileText, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';

export default function AdminLogin() {
    const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            if (res.ok) {
                router.push('/admin');
                router.refresh();
            } else {
                const data = await res.json();
                setError(data.error || 'Invalid credentials');
            }
        } catch (err) {
            setError('Something went wrong. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white flex flex-col font-sans sm:items-center sm:justify-center">
            <div className="w-full max-w-md mx-auto flex flex-col min-h-screen sm:min-h-[800px] sm:h-[800px] sm:relative">
                {/* Header Area */}
                <div className="px-6 pt-12 pb-6 flex-shrink-0">
                    {/* Back Button */}
                    <Link href="/" className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#111111] border border-white/5 hover:bg-[#1A1A1A] transition-colors">
                        <ChevronLeft className="w-5 h-5 text-white/70" />
                    </Link>
                </div>

                {/* Form Container */}
                <div className="w-full bg-[#111111] sm:rounded-[40px] rounded-t-[40px] border border-white/5 p-6 flex flex-col flex-1 shadow-2xl">
                    {/* Tabs */}
                    <div className="flex bg-black border border-white/5 rounded-2xl p-1.5 mb-8 mt-2">
                        <button
                            type="button"
                            onClick={() => setActiveTab('login')}
                            className={`flex-1 py-3.5 text-[15px] font-semibold rounded-xl transition-all ${
                                activeTab === 'login' ? 'bg-[#2A2A2A] text-white shadow-sm' : 'text-white/40 hover:text-white/80'
                            }`}
                        >
                            Log In
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab('signup')}
                            className={`flex-1 py-3.5 text-[15px] font-semibold rounded-xl transition-all ${
                                activeTab === 'signup' ? 'bg-[#2A2A2A] text-white shadow-sm' : 'text-white/40 hover:text-white/80'
                            }`}
                        >
                            Sign Up
                        </button>
                    </div>

                    {error && activeTab === 'login' && (
                        <div className="bg-red-500/10 text-red-400 p-3 rounded-xl text-sm mb-6 text-center border border-red-500/20">
                            {error}
                        </div>
                    )}

                    {activeTab === 'login' ? (
                        <form onSubmit={handleLogin} className="space-y-4 flex flex-col flex-1">
                            <div className="relative">
                                <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-white/30" />
                                </div>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-[#1A1A1A] border border-transparent focus:border-white/10 rounded-2xl h-[60px] pl-14 pr-4 text-[15px] text-white placeholder:text-white/30 focus:outline-none transition-all"
                                    placeholder="Email Address"
                                    required
                                />
                            </div>

                            <div className="relative">
                                <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-white/30" />
                                </div>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-[#1A1A1A] border border-transparent focus:border-white/10 rounded-2xl h-[60px] pl-14 pr-14 text-[15px] text-white placeholder:text-white/30 focus:outline-none transition-all"
                                    placeholder="Password"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-5 flex items-center text-white/30 hover:text-white/60 transition-colors"
                                >
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>

                            <div className="flex-1"></div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full h-[60px] bg-[#222222] hover:bg-[#2A2A2A] text-white rounded-2xl text-[15px] font-semibold flex items-center justify-center gap-2 transition-all disabled:opacity-70 mt-8 mb-6"
                            >
                                {isLoading ? 'Authenticating...' : 'Access Dashboard'}
                                {!isLoading && <ArrowRight className="w-4 h-4 ml-1" />}
                            </button>
                        </form>
                    ) : (
                        <form className="space-y-4 flex flex-col flex-1">
                            <div className="relative">
                                <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                                    <User className="h-5 w-5 text-white/30" />
                                </div>
                                <input
                                    type="text"
                                    className="w-full bg-[#1A1A1A] border border-transparent focus:border-white/10 rounded-2xl h-[60px] pl-14 pr-4 text-[15px] text-white placeholder:text-white/30 focus:outline-none transition-all"
                                    placeholder="Full Name"
                                    required
                                />
                            </div>

                            <div className="relative">
                                <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                                    <Phone className="h-5 w-5 text-white/30" />
                                </div>
                                <input
                                    type="tel"
                                    className="w-full bg-[#1A1A1A] border border-transparent focus:border-white/10 rounded-2xl h-[60px] pl-14 pr-4 text-[15px] text-white placeholder:text-white/30 focus:outline-none transition-all"
                                    placeholder="WhatsApp Number"
                                    required
                                />
                            </div>

                            <div className="flex gap-3">
                                <div className="relative flex-[1.5]">
                                    <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                                        <MapPin className="h-5 w-5 text-white/30" />
                                    </div>
                                    <input
                                        type="text"
                                        className="w-full bg-[#1A1A1A] border border-transparent focus:border-white/10 rounded-2xl h-[60px] pl-14 pr-4 text-[15px] text-white placeholder:text-white/30 focus:outline-none transition-all"
                                        placeholder="Location"
                                        required
                                    />
                                </div>
                                <div className="relative flex-1">
                                    <input
                                        type="file"
                                        id="file-upload"
                                        className="hidden"
                                    />
                                    <label
                                        htmlFor="file-upload"
                                        className="w-full bg-[#2A2A2A] hover:bg-[#333333] border border-transparent rounded-2xl h-[60px] flex items-center justify-center gap-2 cursor-pointer transition-all px-2"
                                    >
                                        <Upload className="h-4 w-4 text-white/60" />
                                        <span className="text-[13px] font-medium text-white/80 whitespace-nowrap">Choose File</span>
                                    </label>
                                </div>
                            </div>

                            <div className="relative">
                                <div className="absolute top-5 left-5 flex pointer-events-none">
                                    <FileText className="h-5 w-5 text-white/30" />
                                </div>
                                <textarea
                                    className="w-full bg-[#1A1A1A] border border-transparent focus:border-white/10 rounded-2xl h-[120px] pl-14 pr-4 pt-5 text-[15px] text-white placeholder:text-white/30 focus:outline-none transition-all resize-none"
                                    placeholder="Short Bio"
                                    required
                                />
                            </div>
                            
                            <div className="flex-1"></div>

                            <button
                                type="button"
                                className="w-full h-[60px] bg-[#222222] hover:bg-[#2A2A2A] text-white rounded-2xl text-[15px] font-semibold flex items-center justify-center gap-2 transition-all mt-8 mb-6"
                            >
                                Submit Application
                                <ArrowRight className="w-4 h-4 ml-1" />
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
