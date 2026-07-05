'use client';

import React, { useState, useEffect } from 'react';
import { Home, Calendar, User, Clock, Camera, Save, CheckCircle2, LogOut, Download, Smartphone, CalendarCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import FloatingCalendar from '@/components/FloatingCalendar';

type Tab = 'home' | 'schedule' | 'booking' | 'profile';

export default function TherapistDashboard() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<Tab>('home');
    
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
    
    // Schedule State
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [scheduleTimes, setScheduleTimes] = useState<Record<string, string>>({});
    
    const currentScheduleTime = scheduleTimes[selectedDate] || '09:00';

    const handleTimeChange = (time: string) => {
        setScheduleTimes(prev => ({ ...prev, [selectedDate]: time }));
    };

    // Profile State
    const [profile, setProfile] = useState({
        name: 'Dewi K.',
        location: 'Ubud',
        bio: 'Professional therapist with 5 years of experience in Traditional Balinese Massage.',
        avatar: ''
    });

    const [saved, setSaved] = useState(false);

    const handleSave = () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    // Render Home Tab
    const renderHome = () => (
        <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-col gap-6"
        >
            <div className="bg-white/10 backdrop-blur-[40px] border border-white/40 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8)] rounded-[32px] p-6 text-center shadow-[0_8px_32px_rgba(0,0,0,0.37)]">
                <h2 className="font-serif text-3xl text-white font-medium">Your Status</h2>
                <p className="text-sm text-white/70 mt-1">Set your real-time availability</p>
            </div>

            <div className="flex flex-col gap-4">
                {/* Online Button */}
                <button
                    onClick={() => setStatus('Online')}
                    className={`relative overflow-hidden rounded-[24px] p-6 text-left transition-all duration-300 ${status === 'Online' ? 'bg-white/20 border-white/40 shadow-[0_8px_32px_rgba(255,255,255,0.1)] scale-[1.02]' : 'bg-white/5 border-white/10 shadow-sm border hover:bg-white/10'} backdrop-blur-xl`}
                >
                    <div className="relative z-10 flex items-center justify-between">
                        <div>
                            <h3 className={`font-bold text-lg text-white`}>READY TO ACCEPT JOBS</h3>
                            <p className={`text-xs mt-1 font-medium ${status === 'Online' ? 'text-white/90' : 'text-white/50'}`}>You will appear online immediately</p>
                        </div>
                        <div className={`w-4 h-4 rounded-full border-4 ${status === 'Online' ? 'border-white bg-green-400 shadow-[0_0_12px_rgba(74,222,128,1)]' : 'border-white/20 bg-transparent'}`} />
                    </div>
                </button>

                {/* Handling Customer Button */}
                <button
                    onClick={() => setStatus('Busy')}
                    className={`relative overflow-hidden rounded-[24px] p-6 text-left transition-all duration-300 ${status === 'Busy' ? 'bg-amber-500/80 border-amber-300/50 shadow-[0_8px_32px_rgba(245,158,11,0.3)] scale-[1.02]' : 'bg-white/5 border-white/10 shadow-sm border hover:bg-white/10'} backdrop-blur-xl`}
                >
                    <div className="relative z-10 flex items-center justify-between">
                        <div>
                            <h3 className={`font-bold text-lg text-white`}>HANDLING CUSTOMER</h3>
                            <p className={`text-xs mt-1 font-medium ${status === 'Busy' ? 'text-white/90' : 'text-white/50'}`}>You are currently busy</p>
                        </div>
                        <div className={`w-4 h-4 rounded-full border-4 ${status === 'Busy' ? 'border-white bg-amber-200' : 'border-white/20 bg-transparent'}`} />
                    </div>
                </button>

                {/* Handling Customer Time Picker Add-on */}
                <AnimatePresence>
                    {status === 'Busy' && (
                        <motion.div 
                            initial={{ opacity: 0, height: 0, marginTop: -10 }}
                            animate={{ opacity: 1, height: 'auto', marginTop: 0 }}
                            exit={{ opacity: 0, height: 0, marginTop: -10 }}
                            className="bg-amber-500/20 backdrop-blur-xl border border-amber-300/30 rounded-[24px] p-5 shadow-lg overflow-hidden"
                        >
                            <label className="text-xs font-bold text-amber-100 uppercase tracking-widest block mb-3">When will you be ready?</label>
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
                    className={`relative overflow-hidden rounded-[24px] p-6 text-left transition-all duration-300 ${status === 'Off' ? 'bg-red-500/40 border-red-400/50 shadow-[0_8px_32px_rgba(239,68,68,0.2)] scale-[1.02]' : 'bg-white/5 border-white/10 shadow-sm border hover:bg-white/10'} backdrop-blur-xl`}
                >
                    <div className="relative z-10 flex items-center justify-between">
                        <div>
                            <h3 className={`font-bold text-lg text-white`}>OFFLINE</h3>
                            <p className={`text-xs mt-1 font-medium ${status === 'Off' ? 'text-white/90' : 'text-white/50'}`}>You will not appear in the app</p>
                        </div>
                        <div className={`w-4 h-4 rounded-full border-4 ${status === 'Off' ? 'border-white bg-red-400' : 'border-white/20 bg-transparent'}`} />
                    </div>
                </button>
            </div>
            
            <button 
                onClick={handleSave}
                className="mt-4 w-full bg-white text-black rounded-2xl py-4 font-bold shadow-[0_8px_32px_rgba(255,255,255,0.2)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
                {saved ? <><CheckCircle2 className="w-5 h-5" /> Saved Successfully</> : <><Save className="w-5 h-5" /> Update Status</>}
            </button>
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
            <div className="bg-white/10 backdrop-blur-[40px] border border-white/40 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8)] rounded-[32px] p-6 text-center shadow-[0_8px_32px_rgba(0,0,0,0.37)]">
                <h2 className="font-serif text-3xl text-white font-medium">Live Bookings</h2>
                <p className="text-sm text-white/70 mt-1">Manage real-time requests</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-[40px] border border-white/40 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8)] rounded-[32px] p-8 text-center flex flex-col items-center justify-center min-h-[300px]">
                <CalendarCheck className="w-12 h-12 text-white/30 mb-4" />
                <h3 className="text-white font-bold text-lg">No Active Requests</h3>
                <p className="text-white/50 text-sm mt-2">When a customer books you in real-time, it will appear here.</p>
            </div>
        </motion.div>
    );

    // Render Schedule Tab
    const renderSchedule = () => (
        <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-col gap-6"
        >
            <div className="bg-white/10 backdrop-blur-[40px] border border-white/40 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8)] rounded-[32px] p-6 text-center shadow-[0_8px_32px_rgba(0,0,0,0.37)]">
                <h2 className="font-serif text-3xl text-white font-medium">Your Schedule</h2>
                <p className="text-sm text-white/70 mt-1">Set future availability</p>
            </div>

            {/* Floating Calendar */}
            <div className="relative mt-8">
                {/* Floating Time Setter Above Date */}
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 z-20 bg-white/10 backdrop-blur-[40px] border border-white/40 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8)] text-white px-5 py-2.5 rounded-[20px] shadow-[0_8px_32px_rgba(0,0,0,0.5)] flex flex-col items-center min-w-[160px]">
                    <span className="text-[10px] font-bold text-white/80 uppercase tracking-widest mb-1">{new Date(selectedDate).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                    <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-white/90" />
                        <input 
                            type="time" 
                            value={currentScheduleTime}
                            onChange={(e) => handleTimeChange(e.target.value)}
                            className="bg-transparent border-none focus:outline-none text-white font-bold text-lg [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert cursor-pointer"
                        />
                    </div>
                </div>

                <div className="pt-6">
                    <FloatingCalendar 
                        value={selectedDate} 
                        onChange={(date) => setSelectedDate(date)} 
                    />
                </div>
            </div>
            
            <button 
                onClick={handleSave}
                className="w-full bg-white text-black rounded-2xl py-4 font-bold shadow-[0_8px_32px_rgba(255,255,255,0.2)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
                {saved ? <><CheckCircle2 className="w-5 h-5" /> Schedule Saved</> : <><Save className="w-5 h-5" /> Save Schedule</>}
            </button>
        </motion.div>
    );

    // Render Profile Tab
    const renderProfile = () => (
        <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-col gap-6"
        >
            <div className="bg-white/10 backdrop-blur-[40px] border border-white/40 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8)] rounded-[32px] p-6 text-center shadow-[0_8px_32px_rgba(0,0,0,0.37)]">
                <h2 className="font-serif text-3xl text-white font-medium">Your Profile</h2>
                <p className="text-sm text-white/70 mt-1">Manage your identity & app</p>
            </div>

            <div className="bg-white/10 backdrop-blur-[40px] border border-white/40 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8)] rounded-[32px] p-6 shadow-[0_8px_32px_rgba(0,0,0,0.37)] flex flex-col items-center">
                
                {/* Avatar Uploader (UI Only) */}
                <div className="relative mb-8 group cursor-pointer">
                    <div className="w-28 h-28 rounded-full bg-white/5 border-4 border-white/20 shadow-lg flex items-center justify-center overflow-hidden relative backdrop-blur-md">
                        {profile.avatar ? (
                            <img src={profile.avatar} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            <User className="w-12 h-12 text-white/50" />
                        )}
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Camera className="w-8 h-8 text-white" />
                        </div>
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
                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 px-4 text-sm font-semibold text-white focus:outline-none focus:border-white/30 transition-all shadow-inner"
                        />
                    </div>
                    <div>
                        <label className="text-[10px] font-bold text-white/60 uppercase tracking-widest ml-4 block mb-1">Bio</label>
                        <textarea 
                            value={profile.bio}
                            onChange={(e) => setProfile({...profile, bio: e.target.value})}
                            rows={3}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 px-4 text-sm font-semibold text-white focus:outline-none focus:border-white/30 transition-all shadow-inner resize-none"
                        />
                    </div>
                    <div>
                        <label className="text-[10px] font-bold text-white/60 uppercase tracking-widest ml-4 block mb-1">Base Location</label>
                        <select 
                            value={profile.location}
                            onChange={(e) => setProfile({...profile, location: e.target.value})}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 px-4 text-sm font-semibold text-white focus:outline-none focus:border-white/30 transition-all shadow-inner appearance-none [&>option]:text-black"
                        >
                            <option value="Ubud">Ubud</option>
                            <option value="Canggu">Canggu</option>
                            <option value="Seminyak">Seminyak</option>
                        </select>
                    </div>
                </div>
                
                <button 
                    onClick={handleSave}
                    className="mt-6 w-full bg-white text-black rounded-2xl py-4 font-bold shadow-[0_8px_32px_rgba(255,255,255,0.2)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                    {saved ? <><CheckCircle2 className="w-5 h-5" /> Profile Updated</> : <><Save className="w-5 h-5" /> Update Profile</>}
                </button>
            </div>

            {/* App Installation Section */}
            <div className="bg-white/10 backdrop-blur-[40px] border border-white/40 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8)] rounded-[32px] p-6 shadow-[0_8px_32px_rgba(0,0,0,0.37)]">
                <h3 className="text-xs font-bold text-white/60 uppercase tracking-widest mb-4">Install Therapist App</h3>
                <div className="space-y-3">
                    <button className="w-full bg-[#3DDC84] text-black rounded-2xl py-3.5 px-4 font-bold shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2">
                        <Download className="w-5 h-5" /> Download for Android
                    </button>
                    <button className="w-full bg-white/5 text-white border border-white/20 rounded-2xl py-3.5 px-4 font-bold shadow-sm hover:bg-white/10 active:scale-[0.98] transition-all flex items-center justify-center gap-2" onClick={() => alert("To install on iPhone: Tap the 'Share' icon at the bottom of Safari, then tap 'Add to Home Screen'.")}>
                        <Smartphone className="w-5 h-5" /> Add to iPhone (PWA)
                    </button>
                </div>
            </div>

            <button 
                onClick={() => router.push('/')}
                className="mt-2 w-full bg-red-500/10 border border-red-500/30 text-red-400 rounded-2xl py-4 font-bold shadow-sm hover:bg-red-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
                <LogOut className="w-4 h-4" /> Sign Out
            </button>
        </motion.div>
    );

    return (
        <div className="min-h-screen bg-black font-sans text-white relative overflow-hidden pb-32">
            {/* Minimal App Background Gradients - Adjusted for Dark Mode */}
            <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-white/5 rounded-full blur-[100px] pointer-events-none fixed" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[70%] h-[70%] bg-white/5 rounded-full blur-[120px] pointer-events-none fixed" />

            <main className="max-w-md mx-auto px-5 pt-12 relative z-10 min-h-screen">
                <AnimatePresence mode="wait">
                    {activeTab === 'home' && <motion.div key="home">{renderHome()}</motion.div>}
                    {activeTab === 'booking' && <motion.div key="booking">{renderBooking()}</motion.div>}
                    {activeTab === 'schedule' && <motion.div key="schedule">{renderSchedule()}</motion.div>}
                    {activeTab === 'profile' && <motion.div key="profile">{renderProfile()}</motion.div>}
                </AnimatePresence>
            </main>

            {/* Floating Bottom Navbar */}
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-40px)] max-w-sm z-50">
                <div className="bg-white/10 backdrop-blur-[40px] border border-white/40 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8)] rounded-[32px] flex items-center justify-between p-2 px-3">
                    
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
                        onClick={() => setActiveTab('schedule')}
                        className={`flex-1 flex flex-col items-center justify-center py-2 transition-all ${activeTab === 'schedule' ? 'text-white scale-110' : 'text-white/40 hover:text-white/70'}`}
                    >
                        <Calendar className="w-5 h-5 mb-1" strokeWidth={activeTab === 'schedule' ? 2.5 : 2} />
                        <span className="text-[9px] font-bold tracking-widest uppercase">Schedule</span>
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
        </div>
    );
}
