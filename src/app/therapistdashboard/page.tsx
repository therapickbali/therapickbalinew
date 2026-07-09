'use client';

import React, { useState, useEffect } from 'react';
import { Home, User, Clock, Camera, Save, CheckCircle2, LogOut, Download, Smartphone, CalendarCheck, Share, PlusSquare, X, AlertTriangle, MapPin, Navigation } from 'lucide-react';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Therapist } from '@/context/SpaContext';

type Tab = 'home' | 'location' | 'booking' | 'profile';


const MapContainer = dynamic(
    () => import('react-leaflet').then((mod) => mod.MapContainer),
    { ssr: false }
);
const TileLayer = dynamic(
    () => import('react-leaflet').then((mod) => mod.TileLayer),
    { ssr: false }
);
const Marker = dynamic(
    () => import('react-leaflet').then((mod) => mod.Marker),
    { ssr: false }
);

// Fix Leaflet Default Icon Issue
if (typeof window !== 'undefined') {
    const L = require('leaflet');
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
        iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png').default?.src || 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: require('leaflet/dist/images/marker-icon.png').default?.src || 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: require('leaflet/dist/images/marker-shadow.png').default?.src || 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    });
}

export default function TherapistDashboard() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<Tab>('home');
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);
    const [isPending, setIsPending] = useState(false);
    const [therapistId, setTherapistId] = useState<string | null>(null);
    const [showInstallPopup, setShowInstallPopup] = useState(false);
    const [locationLoading, setLocationLoading] = useState(false);
    const [showSamsungWarning, setShowSamsungWarning] = useState(false);
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

    useEffect(() => {
        const handleBeforeInstallPrompt = (e: any) => {
            // e.preventDefault(); // Removed to allow automatic Chrome prompt
            setDeferredPrompt(e);
        };
        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    }, []);

    
    const handleBroadcastLocation = () => {
        if (!navigator.geolocation) {
            alert('Geolocation is not supported by your browser.');
            return;
        }
        
        setLocationLoading(true);
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                setProfile(prev => ({ ...prev, latitude, longitude }));
                
                if (therapistId) {
                    await supabase.from('therapists').update({ latitude, longitude }).eq('id', therapistId);
                }
                setLocationLoading(false);
                setSaved(true);
                setTimeout(() => setSaved(false), 3000);
            },
            (error) => {
                console.error('Geolocation error:', error);
                alert('Unable to retrieve your location. Please check your device permissions.');
                setLocationLoading(false);
            },
            { enableHighAccuracy: true }
        );
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
            alert('To install the app on Android, tap the menu (three dots) in your browser and select "Add to Home screen" or "Install app".');
        }
    };
    
    // Status State
    const [status, setStatus] = useState<'Online' | 'Busy' | 'Off'>('Online');
    const [availableAt, setAvailableAt] = useState('');
    
    // Auto-set current time when busy is clicked
    useEffect(() => {
        if (status === 'Busy' && !availableAt) {
            const now = new Date();
            setAvailableAt(now.toTimeString().substring(0, 5));
        }
    }, [status, availableAt]);

    // Auto-switch to Online when time passes
    useEffect(() => {
        if (status === 'Busy' && availableAt && therapistId) {
            const interval = setInterval(() => {
                const now = new Date();
                const currentTime = now.toTimeString().substring(0, 5);
                if (currentTime >= availableAt) {
                    setStatus('Online');
                    setAvailableAt('');
                    supabase.from('therapists')
                        .update({ online_status: 'Online', available_at: null })
                        .eq('id', therapistId)
                        .then();
                }
            }, 10000);
            return () => clearInterval(interval);
        }
    }, [status, availableAt, therapistId]);
    
    // Schedule State
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [scheduleTimes, setScheduleTimes] = useState<Record<string, string>>({});
    
    const currentScheduleTime = scheduleTimes[selectedDate] || '09:00';

    const handleTimeChange = (time: string) => {
        setScheduleTimes(prev => ({ ...prev, [selectedDate]: time }));
    };

    // Profile State
    const [profile, setProfile] = useState<{name: string, bio: string, location: string, avatar: string, latitude?: number, longitude?: number}>({
        name: '',
        location: '',
        bio: '',
        avatar: ''
    });

    const [saved, setSaved] = useState(false);

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
                if (therapistData.online_status) {
                    setStatus(therapistData.online_status);
                }
                if (therapistData.available_at) {
                    setAvailableAt(therapistData.available_at);
                }
                setProfile({
                        latitude: therapistData.latitude,
                        longitude: therapistData.longitude,
                    name: therapistData.name,
                    location: therapistData.location || '',
                    bio: therapistData.bio,
                    avatar: therapistData.image_url || ''
                });
            }
            setIsCheckingAuth(false);
        }
        checkAuthAndStatus();
    }, [router]);

    const handleSave = async () => {
        if (!therapistId) return;
        try {
            const updatePayload: any = { 
                online_status: status,
                name: profile.name,
                location: profile.location,
                bio: profile.bio,
                image_url: profile.avatar
            };
            if (status === 'Busy') {
                updatePayload.available_at = availableAt;
            } else {
                updatePayload.available_at = null;
            }
            
            await supabase.from('therapists').update(updatePayload).eq('id', therapistId);
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        } catch (error) {
            console.error(error);
        }
    };

    const resizeImage = (file: File): Promise<string> => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    let { width, height } = img;
                    const MAX_WIDTH = 600;
                    const MAX_HEIGHT = 600;
                    
                    if (width > height && width > MAX_WIDTH) {
                        height *= MAX_WIDTH / width;
                        width = MAX_WIDTH;
                    } else if (height > MAX_HEIGHT) {
                        width *= MAX_HEIGHT / height;
                        height = MAX_HEIGHT;
                    }
                    
                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx?.drawImage(img, 0, 0, width, height);
                    resolve(canvas.toDataURL('image/jpeg', 0.8));
                };
                img.src = e.target?.result as string;
            };
            reader.readAsDataURL(file);
        });
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        try {
            const resizedBase64 = await resizeImage(file);
            setProfile({ ...profile, avatar: resizedBase64 });
        } catch (error) {
            console.error('Error resizing image:', error);
            alert('Failed to process image. Please try another.');
        }
    };

    // Render Home Tab
    const renderHome = () => (
        <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-col gap-6"
        >
            <div className="bg-[#1C1C1E]/80 backdrop-blur-[60px] border border-white/[0.08] shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] rounded-[32px] p-6 text-center shadow-[0_8px_32px_rgba(0,0,0,0.37)]">
                <h2 className="font-serif text-3xl text-white font-medium">Your Status</h2>
                <p className="text-sm text-white/70 mt-1">Set your real-time availability</p>
            </div>

            <div className="flex flex-col gap-4">
                {/* Online Button */}
                <button
                    onClick={() => setStatus('Online')}
                    className={`relative overflow-hidden rounded-[24px] p-6 text-left transition-all duration-300 ${status === 'Online' ? 'bg-green-500/10 border-green-500/30 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] scale-[1.02]' : 'bg-white/5 border-white/10 shadow-sm border hover:bg-white/10'} backdrop-blur-xl`}
                >
                    <div className="relative z-10 flex items-center justify-between">
                        <div>
                            <h3 className={`font-semibold text-lg text-white`}>READY TO ACCEPT JOBS</h3>
                            <p className={`text-xs mt-1 font-medium ${status === 'Online' ? 'text-white/90' : 'text-white/50'}`}>You will appear online immediately</p>
                        </div>
                        <div className={`w-4 h-4 rounded-full border-4 ${status === 'Online' ? 'border-white bg-[#34C759] shadow-[0_0_12px_rgba(52,199,89,0.8)]' : 'border-white/20 bg-transparent'}`} />
                    </div>
                </button>

                {/* Handling Customer Button */}
                <button
                    onClick={() => setStatus('Busy')}
                    className={`relative overflow-hidden rounded-[24px] p-6 text-left transition-all duration-300 ${status === 'Busy' ? 'bg-orange-500/10 border-orange-500/30 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] scale-[1.02]' : 'bg-white/5 border-white/10 shadow-sm border hover:bg-white/10'} backdrop-blur-xl`}
                >
                    <div className="relative z-10 flex items-center justify-between">
                        <div>
                            <h3 className={`font-semibold text-lg text-white`}>HANDLING CUSTOMER</h3>
                            <p className={`text-xs mt-1 font-medium ${status === 'Busy' ? 'text-white/90' : 'text-white/50'}`}>You are currently busy</p>
                        </div>
                        <div className={`w-4 h-4 rounded-full border-4 ${status === 'Busy' ? 'border-white bg-[#FF9500]' : 'border-white/20 bg-transparent'}`} />
                    </div>
                </button>

                {/* Handling Customer Time Picker Add-on */}
                <AnimatePresence>
                    {status === 'Busy' && (
                        <motion.div 
                            initial={{ opacity: 0, height: 0, marginTop: -10 }}
                            animate={{ opacity: 1, height: 'auto', marginTop: 0 }}
                            exit={{ opacity: 0, height: 0, marginTop: -10 }}
                            className="bg-[#1C1C1E]/60 backdrop-blur-3xl border border-white/5 rounded-2xl p-5 shadow-lg overflow-hidden"
                        >
                            <label className="text-xs font-medium text-amber-100 uppercase tracking-widest block mb-3">When will you be ready?</label>
                            <div className="flex items-center gap-3 bg-white/10 rounded-2xl p-2 border border-amber-200/20 shadow-inner">
                                <Clock className="w-5 h-5 text-amber-300 ml-2" />
                                <input 
                                    type="time" 
                                    value={availableAt} 
                                    onChange={e => setAvailableAt(e.target.value)} 
                                    className="flex-1 bg-transparent border-none focus:outline-none text-white font-bold text-lg py-2 [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert"
                                />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Offline Button */}
                <button
                    onClick={() => setStatus('Off')}
                    className={`relative overflow-hidden rounded-[24px] p-6 text-left transition-all duration-300 ${status === 'Off' ? 'bg-red-500/10 border-red-500/30 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] scale-[1.02]' : 'bg-white/5 border-white/10 shadow-sm border hover:bg-white/10'} backdrop-blur-xl`}
                >
                    <div className="relative z-10 flex items-center justify-between">
                        <div>
                            <h3 className={`font-semibold text-lg text-white`}>OFFLINE</h3>
                            <p className={`text-xs mt-1 font-medium ${status === 'Off' ? 'text-white/90' : 'text-white/50'}`}>You will not appear in the app</p>
                        </div>
                        <div className={`w-4 h-4 rounded-full border-4 ${status === 'Off' ? 'border-white bg-[#FF3B30]' : 'border-white/20 bg-transparent'}`} />
                    </div>
                </button>
            </div>
            
            <div className="fixed bottom-[104px] left-1/2 -translate-x-1/2 w-[calc(100%-40px)] max-w-[408px] z-40">
                <button 
                    onClick={handleSave}
                    className="w-full bg-[#0A84FF] text-white rounded-full py-4 font-semibold text-[17px] tracking-wide shadow-[0_8px_32px_rgba(10,132,255,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 border border-[#0A84FF]/50"
                >
                    {saved ? <><CheckCircle2 className="w-5 h-5" /> Saved Successfully</> : <><Save className="w-5 h-5" /> Update Status</>}
                </button>
            </div>
        </motion.div>
    );

    // Render Booking Tab
    const renderBooking = () => (
        <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-col gap-6"
        >
            <div className="bg-[#1C1C1E]/80 backdrop-blur-[60px] border border-white/[0.08] shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] rounded-[32px] p-6 text-center shadow-[0_8px_32px_rgba(0,0,0,0.37)]">
                <h2 className="font-serif text-3xl text-white font-medium">Live Bookings</h2>
                <p className="text-sm text-white/70 mt-1">Manage real-time requests</p>
            </div>
            
            <div className="bg-[#1C1C1E]/80 backdrop-blur-[60px] border border-white/[0.08] shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] rounded-[32px] p-8 text-center flex flex-col items-center justify-center min-h-[300px]">
                <CalendarCheck className="w-12 h-12 text-white/30 mb-4" />
                <h3 className="text-white font-bold text-lg">No Active Requests</h3>
                <p className="text-white/50 text-sm mt-2">When a customer books you in real-time, it will appear here.</p>
            </div>
        </motion.div>
    );


    // Render Location Tab
    const renderLocation = () => {
        const centerLat = profile.latitude || -8.409518;
        const centerLng = profile.longitude || 115.188919;
        
        return (
            <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-col"
            >
                <div className="h-[450px] w-full rounded-3xl overflow-hidden shadow-inner border border-white/5 bg-black/20 mb-6 relative z-0">
                    {typeof window !== 'undefined' && (
                        <MapContainer center={[centerLat, centerLng]} zoom={profile.latitude ? 15 : 10} style={{ height: '100%', width: '100%', zIndex: 0 }} attributionControl={false}>
                            <TileLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            {profile.latitude && profile.longitude && (
                                <Marker position={[profile.latitude, profile.longitude]} />
                            )}
                        </MapContainer>
                    )}
                </div>
                
                <button 
                    onClick={handleBroadcastLocation}
                    disabled={locationLoading}
                    className="w-full bg-[#34C759] text-white rounded-full py-4 font-semibold text-[17px] tracking-wide shadow-[0_8px_32px_rgba(52,199,89,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 border border-[#34C759]/50 disabled:opacity-50 disabled:scale-100"
                >
                    {locationLoading ? (
                        <span className="animate-pulse">Finding GPS Location...</span>
                    ) : profile.latitude ? (
                        <><Navigation className="w-5 h-5 fill-current" /> Update Live Location</>
                    ) : (
                        <><Navigation className="w-5 h-5" /> Start Broadcasting</>
                    )}
                </button>
                {saved && <p className="text-[#34C759] text-sm mt-3 text-center flex items-center justify-center gap-1 font-medium"><CheckCircle2 className="w-4 h-4" /> Location Broadcasted!</p>}
            </motion.div>
        );
    };

    // Render Profile Tab
    const renderProfile = () => (
        <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-col gap-6"
        >
            <div className="bg-[#1C1C1E]/80 backdrop-blur-[60px] border border-white/[0.08] shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] rounded-[32px] p-6 shadow-[0_8px_32px_rgba(0,0,0,0.37)] flex flex-col items-center">
                
                {/* Avatar Uploader */}
                <div className="relative mb-8 group cursor-pointer">
                    <div className="w-28 h-28 rounded-full bg-[#1C1C1E]/80 border border-white/10 shadow-lg flex items-center justify-center overflow-hidden relative backdrop-blur-md">
                        {profile.avatar ? (
                            <img src={profile.avatar} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            <User className="w-12 h-12 text-white/50" />
                        )}
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Camera className="w-8 h-8 text-white" />
                        </div>
                        <input 
                            type="file" 
                            accept="image/*" 
                            onChange={handleImageUpload}
                            className="absolute inset-0 opacity-0 cursor-pointer z-10"
                        />
                    </div>
                </div>

                {/* Form Fields */}
                <div className="w-full space-y-4">
                    <div>
                        <label className="text-[10px] font-bold text-white/60 uppercase tracking-widest ml-4 block mb-1">Full Name</label>
                        <input 
                            type="text" 
                            value={profile.name}
                            onChange={(e) => setProfile({...profile, name: e.target.value})}
                            className="w-full bg-[#2C2C2E]/80 border border-transparent rounded-xl py-3.5 px-4 text-[17px] font-medium text-white focus:outline-none focus:bg-[#3A3A3C] transition-all shadow-inner"
                        />
                    </div>
                    <div>
                        <label className="text-[10px] font-bold text-white/60 uppercase tracking-widest ml-4 block mb-1">Bio</label>
                        <textarea 
                            value={profile.bio}
                            onChange={(e) => setProfile({...profile, bio: e.target.value})}
                            rows={3}
                            className="w-full bg-[#2C2C2E]/80 border border-transparent rounded-xl py-3.5 px-4 text-[17px] font-medium text-white focus:outline-none focus:bg-[#3A3A3C] transition-all shadow-inner resize-none text-[17px]"
                        />
                    </div>
                    <div>
                        <label className="text-[10px] font-bold text-white/60 uppercase tracking-widest ml-4 block mb-1">Base Location</label>
                        <select 
                            value={profile.location}
                            onChange={(e) => setProfile({...profile, location: e.target.value})}
                            className="w-full bg-[#2C2C2E]/80 border border-transparent rounded-xl py-3.5 px-4 text-[17px] font-medium text-white focus:outline-none focus:bg-[#3A3A3C] transition-all shadow-inner appearance-none text-[17px] [&>option]:text-black"
                        >
                            <option value="Ubud">Ubud</option>
                            <option value="Canggu">Canggu</option>
                            <option value="Seminyak">Seminyak</option>
                        </select>
                    </div>
                </div>
                
            <div className="mt-6 w-full z-40 pb-6">
                <button 
                    onClick={handleSave}
                    className="w-full bg-[#0A84FF] text-white rounded-full py-4 font-semibold text-[17px] tracking-wide shadow-[0_8px_32px_rgba(10,132,255,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 border border-[#0A84FF]/50"
                >
                    {saved ? <><CheckCircle2 className="w-5 h-5" /> Profile Updated</> : <><Save className="w-5 h-5" /> Update Profile</>}
                </button>
            </div>
            </div>

            {/* App Installation Section */}
            <div className="bg-[#1C1C1E]/80 backdrop-blur-[60px] border border-white/[0.08] shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] rounded-[32px] p-6 shadow-[0_8px_32px_rgba(0,0,0,0.37)]">
                <h3 className="text-xs font-medium text-white/60 uppercase tracking-widest mb-4">Install Therapist App</h3>
                <div className="space-y-3">
                    <button onClick={handleAndroidInstall} className="w-full bg-[#34C759] text-white border border-[#34C759]/50 font-medium rounded-2xl py-3.5 px-4 font-bold shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2">
                        <Download className="w-5 h-5" /> Download for Android
                    </button>
                    <button className="w-full bg-white/5 text-white border border-white/20 rounded-2xl py-3.5 px-4 font-bold shadow-sm hover:bg-white/10 active:scale-[0.98] transition-all flex items-center justify-center gap-2" onClick={() => setShowInstallPopup(true)}>
                        <Smartphone className="w-5 h-5" /> Add to iPhone (PWA)
                    </button>
                </div>
            </div>

            <button 
                onClick={handleLogout}
                className="mt-2 w-full bg-red-500/10 border border-red-500/30 text-red-400 rounded-2xl py-4 font-bold shadow-sm hover:bg-red-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
                <LogOut className="w-4 h-4" /> Sign Out
            </button>
        </motion.div>
    );

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/therapist-login');
    };

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
                    <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Clock className="w-8 h-8 text-white/70" />
                    </div>
                    <h2 className="font-serif text-3xl text-white font-medium mb-3">Pending Approval</h2>
                    <p className="text-white/60 text-sm mb-8">
                        Your application has been received and is currently being reviewed by our team. We will reach out to you via WhatsApp for verification soon.
                    </p>
                    <button 
                        onClick={handleLogout}
                        className="w-full bg-white/5 border border-white/20 text-white rounded-2xl py-3.5 text-sm font-semibold hover:bg-white/10 transition-colors"
                    >
                        Sign Out
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black font-sans text-white relative overflow-hidden pb-32">
            {/* Minimal App Background Gradients - Adjusted for Dark Mode */}
            <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-white/5 rounded-full blur-[100px] pointer-events-none fixed" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[70%] h-[70%] bg-white/5 rounded-full blur-[120px] pointer-events-none fixed" />

            <main className="max-w-md mx-auto px-5 pt-12 pb-48 relative z-10 min-h-screen">
                <AnimatePresence mode="wait">
                    {activeTab === 'home' && <motion.div key="home">{renderHome()}</motion.div>}
                    {activeTab === 'booking' && <motion.div key="booking">{renderBooking()}</motion.div>}
                    {activeTab === 'location' && <motion.div key="location">{renderLocation()}</motion.div>}
                    {activeTab === 'profile' && <motion.div key="profile">{renderProfile()}</motion.div>}
                </AnimatePresence>
            </main>

            {/* Floating Bottom Navbar */}
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-40px)] max-w-sm z-50">
                <div className="bg-[#1C1C1E]/80 backdrop-blur-[60px] border border-white/[0.08] shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] rounded-[32px] flex items-center justify-between p-2 px-3">
                    
                    <button 
                        onClick={() => setActiveTab('home')}
                        className={`flex-1 flex flex-col items-center justify-center py-2 transition-all ${activeTab === 'home' ? 'text-white scale-110' : 'text-white/40 hover:text-white/70'}`}
                    >
                        <Home className="w-5 h-5 mb-1" strokeWidth={activeTab === 'home' ? 2.5 : 2} />
                        <span className="text-[9px] font-bold tracking-widest uppercase">Home</span>
                    </button>
                    
                    <button 
                        onClick={() => setActiveTab('booking')}
                        className={`flex-1 flex flex-col items-center justify-center py-2 transition-all ${activeTab === 'booking' ? 'text-white scale-110' : 'text-white/40 hover:text-white/70'}`}
                    >
                        <CalendarCheck className="w-5 h-5 mb-1" strokeWidth={activeTab === 'booking' ? 2.5 : 2} />
                        <span className="text-[9px] font-bold tracking-widest uppercase">Live</span>
                    </button>

                    <button 
                        onClick={() => setActiveTab('location')}
                        className={`flex-1 flex flex-col items-center justify-center py-2 transition-all ${activeTab === 'location' ? 'text-white scale-110' : 'text-white/40 hover:text-white/70'}`}
                    >
                        <MapPin className="w-5 h-5 mb-1" strokeWidth={activeTab === 'location' ? 2.5 : 2} />
                        <span className="text-[9px] font-bold tracking-widest uppercase">Location</span>
                    </button>
                    
                    <button 
                        onClick={() => setActiveTab('profile')}
                        className={`flex-1 flex flex-col items-center justify-center py-2 transition-all ${activeTab === 'profile' ? 'text-white scale-110' : 'text-white/40 hover:text-white/70'}`}
                    >
                        <User className="w-5 h-5 mb-1" strokeWidth={activeTab === 'profile' ? 2.5 : 2} />
                        <span className="text-[9px] font-bold tracking-widest uppercase">Profile</span>
                    </button>

                </div>
            </div>

            {/* Install PWA iOS Popup */}
            <AnimatePresence>
                {showInstallPopup && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            className="relative w-full max-w-sm bg-white/10 backdrop-blur-[40px] border border-white/40 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8)] rounded-3xl p-6 sm:p-8 overflow-hidden"
                        >
                            <button 
                                onClick={() => setShowInstallPopup(false)}
                                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/10 text-white/70 hover:text-white hover:bg-white/20 transition-all"
                            >
                                <X className="w-5 h-5" />
                            </button>
                            
                            <div className="w-16 h-16 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-500 flex items-center justify-center mx-auto mb-6 shadow-sm">
                                <Smartphone className="w-8 h-8" />
                            </div>
                            
                            <h3 className="font-serif text-xl text-white mb-2 text-center">Install on iPhone</h3>
                            <p className="text-sm text-white/70 mb-6 text-center leading-relaxed">
                                Install the Therapick Dashboard on your iPhone for quick access.
                            </p>
                            
                            <div className="space-y-4 mb-8 bg-black/20 rounded-2xl p-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                                        <Share className="w-5 h-5 text-white" />
                                    </div>
                                    <p className="text-sm text-white/90">
                                        <span className="font-bold text-white">Step 1:</span> Tap the <strong className="text-blue-400">Share</strong> icon at the bottom of Safari.
                                    </p>
                                </div>
                                <div className="h-px w-full bg-white/10" />
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                                        <PlusSquare className="w-5 h-5 text-white" />
                                    </div>
                                    <p className="text-sm text-white/90">
                                        <span className="font-bold text-white">Step 2:</span> Tap <strong className="text-blue-400">Add to Home Screen</strong>.
                                    </p>
                                </div>
                            </div>
                            
                            <button 
                                onClick={() => setShowInstallPopup(false)}
                                className="w-full bg-[#292831] text-white px-6 py-4 rounded-2xl text-sm font-bold shadow-md hover:bg-[#292831]/90 active:scale-95 transition-all"
                            >
                                GOT IT
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Samsung Internet Warning Popup */}
            <AnimatePresence>
                {showSamsungWarning && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[130] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            className="relative w-full max-w-sm bg-white/10 backdrop-blur-[40px] border border-white/40 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8)] rounded-3xl p-6 sm:p-8 overflow-hidden"
                        >
                            <button 
                                onClick={() => setShowSamsungWarning(false)}
                                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/10 text-white/70 hover:text-white hover:bg-white/20 transition-all"
                            >
                                <X className="w-5 h-5" />
                            </button>
                            
                            <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center mx-auto mb-6 shadow-sm">
                                <AlertTriangle className="w-8 h-8" />
                            </div>
                            
                            <h3 className="font-serif text-xl text-white mb-2 text-center">Samsung Browser Detected</h3>
                            <p className="text-sm text-white/70 mb-6 text-center leading-relaxed">
                                Samsung's app installer often shows a <strong className="text-red-400">"Built for older version of Android"</strong> warning due to their outdated installation service. 
                            </p>
                            <p className="text-sm text-white/90 mb-8 text-center bg-black/20 p-4 rounded-xl border border-white/5">
                                For a fast, secure, and warning-free installation, please open <strong className="text-green-400">www.booktherapick.com</strong> in <strong className="text-white font-bold tracking-wide">Google Chrome</strong> instead.
                            </p>
                            
                            <div className="flex gap-3">
                                <button 
                                    onClick={async () => {
                                        setShowSamsungWarning(false);
                                        if (deferredPrompt) {
                                            deferredPrompt.prompt();
                                            const { outcome } = await deferredPrompt.userChoice;
                                            if (outcome === 'accepted') {
                                                setDeferredPrompt(null);
                                            }
                                        }
                                    }}
                                    className="flex-1 bg-white/5 border border-white/10 text-white/80 px-4 py-4 rounded-2xl text-sm font-bold shadow-sm hover:bg-white/10 hover:text-white active:scale-95 transition-all"
                                >
                                    Try Anyway
                                </button>
                                <button 
                                    onClick={() => setShowSamsungWarning(false)}
                                    className="flex-[1.5] bg-[#34C759] text-white border border-[#34C759]/50 font-medium px-4 py-4 rounded-2xl text-sm font-bold shadow-md hover:bg-[#3DDC84]/90 active:scale-95 transition-all"
                                >
                                    Use Chrome
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
