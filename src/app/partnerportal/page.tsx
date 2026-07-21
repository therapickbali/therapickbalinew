'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Home, User, Save, CheckCircle2, LogOut, Download, Smartphone, Share, PlusSquare, X, AlertTriangle, MapPin, Navigation, List, Plus, Users, PlusCircle, Menu, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import PartnerTreatments from '@/components/PartnerTreatments';
import PartnerTherapists from '@/components/PartnerTherapists';
import PartnerTreatmentForm from '@/components/PartnerTreatmentForm';

type Tab = 'therapists' | 'myspa' | 'treatments' | 'profile' | 'bookings';

export default function PartnerPortal() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<Tab>('therapists');
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);
    const [isPending, setIsPending] = useState(false);
    const [therapistId, setTherapistId] = useState<string | null>(null);
    const [showInstallPopup, setShowInstallPopup] = useState(false);
    const [isTrackingLocation, setIsTrackingLocation] = useState(false);
    const watchId = useRef<number | null>(null);
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    
    // Profile State
    const [profile, setProfile] = useState<{ name: string, brand: string, bio: string, location: string, avatar: string, latitude?: number, longitude?: number }>({
        name: '',
        brand: '',
        location: '',
        bio: '',
        avatar: ''
    });

    const [saved, setSaved] = useState(false);
    const [showSamsungWarning, setShowSamsungWarning] = useState(false);
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

    useEffect(() => {
        const handleBeforeInstallPrompt = (e: any) => {
            setDeferredPrompt(e);
        };
        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    }, []);

    useEffect(() => {
        async function checkAuthAndStatus() {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                router.push('/therapist-login');
                return;
            }

            const { data: therapistData, error } = await supabase
                .from('therapists')
                .select('*')
                .eq('id', session.user.id)
                .single();

            if (error || !therapistData || !therapistData.is_active) {
                setIsPending(true);
            } else {
                setTherapistId(therapistData.id);
                setProfile({
                    latitude: undefined,
                    longitude: undefined,
                    name: therapistData.name,
                    brand: therapistData.brand || '',
                    location: therapistData.location || '',
                    bio: therapistData.bio,
                    avatar: therapistData.image_url || ''
                });
            }
            setIsCheckingAuth(false);
        }
        checkAuthAndStatus();
    }, [router]);

    const handleSaveProfile = async () => {
        if (!therapistId) return;
        try {
            const updatePayload: any = {
                name: profile.name,
                brand: profile.brand,
                location: profile.location,
                bio: profile.bio,
                latitude: profile.latitude,
                longitude: profile.longitude,
            };
            if (profile.avatar && !profile.avatar.startsWith('http')) {
                updatePayload.image_url = profile.avatar;
            }
            const { error } = await supabase.from('therapists').update(updatePayload).eq('id', therapistId);
            if (!error) {
                setSaved(true);
                setTimeout(() => setSaved(false), 2000);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const toggleLocationTracking = () => {
        if (isTrackingLocation) {
            if (watchId.current !== null) {
                navigator.geolocation.clearWatch(watchId.current);
                watchId.current = null;
            }
            setIsTrackingLocation(false);
        } else {
            if (!navigator.geolocation) {
                alert('Geolocation is not supported by your browser');
                return;
            }
            setIsTrackingLocation(true);
            watchId.current = navigator.geolocation.watchPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;
                    setProfile(prev => ({ ...prev, latitude, longitude }));
                    if (therapistId) {
                        await supabase.from('therapists').update({ latitude, longitude }).eq('id', therapistId);
                    }
                },
                (error) => {
                    console.error('Geolocation error:', error);
                    alert('Unable to retrieve your location. Please check your device permissions.');
                    setIsTrackingLocation(false);
                },
                { enableHighAccuracy: true, maximumAge: 10000, timeout: 5000 }
            );
        }
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/therapist-login');
    };

    const handleAndroidInstall = async () => {
        const isSamsungBrowser = navigator.userAgent.match(/SamsungBrowser/i);
        if (isSamsungBrowser) {
            setShowSamsungWarning(true);
            return;
        }
        if (deferredPrompt) {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            if (outcome === 'accepted') {
                setDeferredPrompt(null);
            }
        } else {
            alert('To install the app on Android, tap the menu (three dots) in your browser and select "Add to Home screen".');
        }
    };

    const renderProfile = () => (
        <div className="flex flex-col gap-6 w-full">
            <div className="bg-[#1C1C1E]/80 backdrop-blur-[60px] border border-white/[0.08] shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] rounded-[32px] p-6 shadow-[0_8px_32px_rgba(0,0,0,0.37)]">
                <h3 className="text-xs font-medium text-white/60 uppercase tracking-widest mb-6">Company Profile</h3>
                
                <div className="space-y-4">
                    <div>
                        <label className="text-[10px] font-bold text-white/60 uppercase tracking-widest ml-4 block mb-1">Company / Brand Name</label>
                        <input type="text" value={profile.brand} onChange={e => setProfile({...profile, brand: e.target.value})} className="w-full bg-[#2C2C2E]/80 border border-transparent rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-1 focus:ring-white/20 transition-all shadow-[inset_0_1px_2px_rgba(0,0,0,0.2)]" />
                    </div>
                    <div>
                        <label className="text-[10px] font-bold text-white/60 uppercase tracking-widest ml-4 block mb-1">Contact Person Name</label>
                        <input type="text" value={profile.name} onChange={e => setProfile({...profile, name: e.target.value})} className="w-full bg-[#2C2C2E]/80 border border-transparent rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-1 focus:ring-white/20 transition-all shadow-[inset_0_1px_2px_rgba(0,0,0,0.2)]" />
                    </div>
                    <div>
                        <label className="text-[10px] font-bold text-white/60 uppercase tracking-widest ml-4 block mb-1">Base Location</label>
                        <select value={profile.location} onChange={e => setProfile({...profile, location: e.target.value})} className="w-full bg-[#2C2C2E]/80 border border-transparent rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-1 focus:ring-white/20 transition-all shadow-[inset_0_1px_2px_rgba(0,0,0,0.2)] [&>option]:text-black">
                            <option value="Downtown Dubai">Downtown Dubai</option>
                            <option value="Dubai Marina">Dubai Marina</option>
                            <option value="Jumeirah">Jumeirah</option>
                        </select>
                    </div>
                    <div>
                        <label className="text-[10px] font-bold text-white/60 uppercase tracking-widest ml-4 block mb-1">Company Description</label>
                        <textarea value={profile.bio} onChange={e => setProfile({...profile, bio: e.target.value})} rows={3} className="w-full bg-[#2C2C2E]/80 border border-transparent rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-1 focus:ring-white/20 transition-all shadow-[inset_0_1px_2px_rgba(0,0,0,0.2)] resize-none" />
                    </div>
                </div>

                <div className="mt-8 pt-6 border-t border-white/5 w-full z-40 pb-6">
                    <button onClick={handleSaveProfile} className="w-full bg-[#0A84FF] text-white rounded-xl py-4 font-semibold text-[15px] tracking-wide shadow-lg hover:bg-[#007AFF] active:scale-[0.98] transition-all flex items-center justify-center gap-2">
                        {saved ? <><CheckCircle2 className="w-5 h-5" /> Profile Updated</> : <><Save className="w-5 h-5" /> Update Company Profile</>}
                    </button>
                </div>
            </div>

            <div className="bg-[#1C1C1E]/80 backdrop-blur-[60px] border border-white/[0.08] shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] rounded-[32px] p-6 shadow-[0_8px_32px_rgba(0,0,0,0.37)]">
                <h3 className="text-xs font-medium text-white/60 uppercase tracking-widest mb-4">Install App</h3>
                <div className="space-y-3">
                    <button onClick={handleAndroidInstall} className="w-full bg-[#34C759] text-white border border-[#34C759]/50 font-medium rounded-2xl py-3.5 px-4 font-bold shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2">
                        <Download className="w-5 h-5" /> Download for Android
                    </button>
                    <button className="w-full bg-white/5 text-white border border-white/20 rounded-2xl py-3.5 px-4 font-bold shadow-sm hover:bg-white/10 active:scale-[0.98] transition-all flex items-center justify-center gap-2" onClick={() => setShowInstallPopup(true)}>
                        <Smartphone className="w-5 h-5" /> Add to iPhone (PWA)
                    </button>
                </div>
            </div>

            <button onClick={handleLogout} className="mt-2 w-full bg-red-500/10 border border-red-500/30 text-red-400 rounded-2xl py-4 font-bold shadow-sm hover:bg-red-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2">
                <LogOut className="w-4 h-4" /> Sign Out
            </button>
        </div>
    );

    if (isCheckingAuth) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
            </div>
        );
    }

    if (isPending) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center p-6 text-center">
                <div className="bg-white/10 backdrop-blur-3xl border border-white/20 rounded-[32px] p-8 max-w-md w-full">
                    <h2 className="font-serif text-3xl text-white font-medium mb-3">Pending Approval</h2>
                    <p className="text-white/60 text-sm mb-8">Your application has been received and is currently being reviewed by our team.</p>
                    <button onClick={handleLogout} className="w-full bg-white/5 border border-white/20 text-white rounded-2xl py-3.5 text-sm font-semibold hover:bg-white/10 transition-colors">Sign Out</button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black font-sans text-white relative overflow-hidden md:pb-0 pb-32">
            <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-white/5 rounded-full blur-[100px] pointer-events-none fixed" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[70%] h-[70%] bg-white/5 rounded-full blur-[120px] pointer-events-none fixed" />

            {/* Desktop Sidebar */}
            <div className="hidden md:flex fixed top-0 left-0 h-screen w-64 bg-[#111]/80 backdrop-blur-xl border-r border-white/5 flex-col p-6 z-50">
                <div className="text-xl font-serif text-white mb-12 px-4">Partner Portal</div>
                <nav className="flex flex-col gap-2">
                    <button onClick={() => setActiveTab('therapists')} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'therapists' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white/70 hover:bg-white/5'}`}>
                        <Users className="w-5 h-5" /> <span className="font-medium text-sm tracking-wide">Team</span>
                    </button>
                    <button onClick={() => setActiveTab('bookings')} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'bookings' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white/70 hover:bg-white/5'}`}>
                        <Calendar className="w-5 h-5" /> <span className="font-medium text-sm tracking-wide">Bookings</span>
                    </button>
                    <button onClick={() => setActiveTab('treatments')} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'treatments' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white/70 hover:bg-white/5'}`}>
                        <List className="w-5 h-5" /> <span className="font-medium text-sm tracking-wide">Treatments</span>
                    </button>
                    <button onClick={() => setActiveTab('myspa')} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'myspa' ? 'bg-[#0A84FF]/20 text-[#0A84FF]' : 'text-white/40 hover:text-white/70 hover:bg-white/5'}`}>
                        <PlusCircle className="w-5 h-5" /> <span className="font-medium text-sm tracking-wide">Create New</span>
                    </button>
                    <button onClick={() => setActiveTab('profile')} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'profile' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white/70 hover:bg-white/5'}`}>
                        <User className="w-5 h-5" /> <span className="font-medium text-sm tracking-wide">Profile Settings</span>
                    </button>
                </nav>
                <div className="mt-auto">
                    <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-red-400 hover:bg-red-500/10 w-full">
                        <LogOut className="w-5 h-5" /> <span className="font-medium text-sm tracking-wide">Sign Out</span>
                    </button>
                </div>
            </div>

            <main className="max-w-md mx-auto md:max-w-6xl md:mx-0 md:ml-64 px-5 md:px-12 pt-12 md:pt-16 pb-48 md:pb-12 relative z-10 min-h-screen">
                <AnimatePresence mode="wait">
                    {activeTab === 'therapists' && therapistId && (
                        <motion.div key="therapists" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                            <PartnerTherapists partnerId={therapistId} />
                        </motion.div>
                    )}
                    {activeTab === 'myspa' && therapistId && (
                        <motion.div key="myspa" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                            <PartnerTreatmentForm partnerId={therapistId} onSaveSuccess={() => setActiveTab('treatments')} onCancel={() => setActiveTab('treatments')} />
                        </motion.div>
                    )}
                    {activeTab === 'treatments' && therapistId && (
                        <motion.div key="treatments" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                            <PartnerTreatments therapistId={therapistId} />
                        </motion.div>
                    )}
                    {activeTab === 'bookings' && (
                        <motion.div key="bookings" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                            <div className="flex flex-col gap-6 w-full">
                                <div className="bg-[#1C1C1E]/80 backdrop-blur-[60px] border border-white/[0.08] rounded-[32px] p-8 text-center shadow-[0_8px_32px_rgba(0,0,0,0.37)]">
                                    <Calendar className="w-12 h-12 text-white/20 mx-auto mb-4" />
                                    <h2 className="font-serif text-2xl text-white font-medium mb-2">Bookings</h2>
                                    <p className="text-white/60 text-sm">Your bookings list will appear here soon.</p>
                                </div>
                            </div>
                        </motion.div>
                    )}
                    {activeTab === 'profile' && <motion.div key="profile">{renderProfile()}</motion.div>}
                </AnimatePresence>
            </main>

            {/* Floating Bottom Navbar (Mobile Only) */}
            <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-40px)] max-w-sm z-50">
                <div className="bg-[#1C1C1E]/80 backdrop-blur-[60px] border border-white/[0.08] shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] rounded-[32px] flex items-center justify-between p-2 px-3 relative">
                    <button onClick={() => { setActiveTab('therapists'); setShowMobileMenu(false); }} className={`flex-1 flex flex-col items-center justify-center py-2 transition-all ${activeTab === 'therapists' ? 'text-white scale-110' : 'text-white/40 hover:text-white/70'}`}>
                        <Users className="w-5 h-5 mb-1" strokeWidth={activeTab === 'therapists' ? 2.5 : 2} />
                        <span className="text-[9px] font-bold tracking-widest uppercase">Team</span>
                    </button>
                    
                    <button onClick={() => { setActiveTab('bookings'); setShowMobileMenu(false); }} className={`flex-1 flex flex-col items-center justify-center py-2 transition-all ${activeTab === 'bookings' ? 'text-white scale-110' : 'text-white/40 hover:text-white/70'}`}>
                        <Calendar className="w-5 h-5 mb-1" strokeWidth={activeTab === 'bookings' ? 2.5 : 2} />
                        <span className="text-[9px] font-bold tracking-widest uppercase">Bookings</span>
                    </button>
                    
                    <button onClick={() => { setActiveTab('myspa'); setShowMobileMenu(false); }} className={`flex-1 flex flex-col items-center justify-center py-2 transition-all ${activeTab === 'myspa' ? 'text-[#0A84FF] scale-110' : 'text-white/40 hover:text-white/70'}`}>
                        <PlusCircle className="w-5 h-5 mb-1" strokeWidth={activeTab === 'myspa' ? 2.5 : 2} />
                        <span className="text-[9px] font-bold tracking-widest uppercase">Create</span>
                    </button>
                    
                    <button onClick={() => setShowMobileMenu(!showMobileMenu)} className={`flex-1 flex flex-col items-center justify-center py-2 transition-all ${showMobileMenu || activeTab === 'profile' || activeTab === 'treatments' ? 'text-white scale-110' : 'text-white/40 hover:text-white/70'}`}>
                        <Menu className="w-5 h-5 mb-1" strokeWidth={(showMobileMenu || activeTab === 'profile' || activeTab === 'treatments') ? 2.5 : 2} />
                        <span className="text-[9px] font-bold tracking-widest uppercase">More</span>
                    </button>

                    {/* Mobile Dropdown Menu */}
                    <AnimatePresence>
                        {showMobileMenu && (
                            <motion.div 
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                className="absolute bottom-[110%] right-0 w-48 bg-[#2C2C2E] border border-white/10 shadow-2xl rounded-2xl overflow-hidden py-2"
                            >
                                <button 
                                    onClick={() => { setActiveTab('treatments'); setShowMobileMenu(false); }}
                                    className={`w-full px-4 py-3 flex items-center gap-3 text-sm transition-colors ${activeTab === 'treatments' ? 'text-white bg-white/10' : 'text-white/70 hover:bg-white/5'}`}
                                >
                                    <List className="w-4 h-4" /> Treatments
                                </button>
                                <button 
                                    onClick={() => { setActiveTab('profile'); setShowMobileMenu(false); }}
                                    className={`w-full px-4 py-3 flex items-center gap-3 text-sm transition-colors ${activeTab === 'profile' ? 'text-white bg-white/10' : 'text-white/70 hover:bg-white/5'}`}
                                >
                                    <User className="w-4 h-4" /> Profile
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
            
            {/* Simple Install Popup Logic preserved... */}
            <AnimatePresence>
                {showInstallPopup && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
                        <motion.div initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }} className="relative w-full max-w-sm bg-[#1C1C1E] border border-white/10 rounded-3xl p-6 overflow-hidden">
                            <button onClick={() => setShowInstallPopup(false)} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 text-white/70"><X className="w-5 h-5" /></button>
                            <h3 className="font-serif text-xl text-white mb-6 text-center mt-4">Install on iPhone</h3>
                            <div className="space-y-4 mb-8">
                                <p className="text-sm text-white/90">1. Tap the Share icon below</p>
                                <p className="text-sm text-white/90">2. Tap Add to Home Screen</p>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
