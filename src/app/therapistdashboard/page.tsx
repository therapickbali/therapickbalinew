'use client';

import React, { useState } from 'react';
import { Home, Calendar, User, Clock, Camera, Save, CheckCircle2, ChevronRight, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

type Tab = 'home' | 'schedule' | 'profile';

export default function TherapistDashboard() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<Tab>('home');
    
    // Status State
    const [status, setStatus] = useState<'Online' | 'Busy' | 'Off'>('Online');
    const [availableAt, setAvailableAt] = useState('');
    
    // Schedule State
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [availableTimes, setAvailableTimes] = useState<string[]>([]);
    
    // Profile State
    const [profile, setProfile] = useState({
        name: 'Dewi K.',
        location: 'Ubud',
        specialty: 'Traditional Balinese Massage',
        avatar: ''
    });

    const [saved, setSaved] = useState(false);

    const timeSlots = [
        '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
        '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
        '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
        '18:00', '18:30', '19:00', '19:30', '20:00'
    ];

    const toggleTimeSlot = (time: string) => {
        if (availableTimes.includes(time)) {
            setAvailableTimes(availableTimes.filter(t => t !== time));
        } else {
            setAvailableTimes([...availableTimes, time].sort());
        }
    };

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
            <div className="text-center mb-4">
                <h2 className="font-serif text-3xl text-primary font-medium">Your Status</h2>
                <p className="text-sm text-text-muted mt-1">Set your real-time availability</p>
            </div>

            <div className="flex flex-col gap-4">
                {/* Online Button */}
                <button
                    onClick={() => setStatus('Online')}
                    className={`relative overflow-hidden rounded-[24px] p-6 text-left transition-all duration-300 ${status === 'Online' ? 'bg-primary border-transparent shadow-[0_20px_40px_rgb(0,0,0,0.15)] scale-[1.02]' : 'bg-white/40 border-white/60 shadow-sm border hover:bg-white/60'} backdrop-blur-xl`}
                >
                    <div className="relative z-10 flex items-center justify-between">
                        <div>
                            <h3 className={`font-bold text-lg ${status === 'Online' ? 'text-white' : 'text-primary'}`}>READY TO ACCEPT JOBS</h3>
                            <p className={`text-xs mt-1 font-medium ${status === 'Online' ? 'text-white/80' : 'text-text-muted'}`}>You will appear online immediately</p>
                        </div>
                        <div className={`w-4 h-4 rounded-full border-4 ${status === 'Online' ? 'border-white bg-green-400 shadow-[0_0_12px_rgba(74,222,128,1)]' : 'border-border/50 bg-transparent'}`} />
                    </div>
                </button>

                {/* Handling Customer Button */}
                <button
                    onClick={() => setStatus('Busy')}
                    className={`relative overflow-hidden rounded-[24px] p-6 text-left transition-all duration-300 ${status === 'Busy' ? 'bg-amber-500 border-transparent shadow-[0_20px_40px_rgba(245,158,11,0.2)] scale-[1.02]' : 'bg-white/40 border-white/60 shadow-sm border hover:bg-white/60'} backdrop-blur-xl`}
                >
                    <div className="relative z-10 flex items-center justify-between">
                        <div>
                            <h3 className={`font-bold text-lg ${status === 'Busy' ? 'text-white' : 'text-primary'}`}>HANDLING CUSTOMER</h3>
                            <p className={`text-xs mt-1 font-medium ${status === 'Busy' ? 'text-white/80' : 'text-text-muted'}`}>You are currently busy</p>
                        </div>
                        <div className={`w-4 h-4 rounded-full border-4 ${status === 'Busy' ? 'border-white bg-amber-200' : 'border-border/50 bg-transparent'}`} />
                    </div>
                </button>

                {/* Handling Customer Time Picker Add-on */}
                <AnimatePresence>
                    {status === 'Busy' && (
                        <motion.div 
                            initial={{ opacity: 0, height: 0, marginTop: -10 }}
                            animate={{ opacity: 1, height: 'auto', marginTop: 0 }}
                            exit={{ opacity: 0, height: 0, marginTop: -10 }}
                            className="bg-amber-50/80 backdrop-blur-xl border border-amber-200 rounded-[24px] p-5 shadow-sm overflow-hidden"
                        >
                            <label className="text-xs font-bold text-amber-800 uppercase tracking-widest block mb-3">When will you be ready?</label>
                            <div className="flex items-center gap-3 bg-white rounded-2xl p-2 border border-amber-200/50 shadow-inner">
                                <Clock className="w-5 h-5 text-amber-500 ml-2" />
                                <input 
                                    type="time" 
                                    value={availableAt} 
                                    onChange={e => setAvailableAt(e.target.value)} 
                                    className="flex-1 bg-transparent border-none focus:outline-none text-amber-900 font-bold text-lg py-2"
                                />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Offline Button */}
                <button
                    onClick={() => setStatus('Off')}
                    className={`relative overflow-hidden rounded-[24px] p-6 text-left transition-all duration-300 ${status === 'Off' ? 'bg-[#292831] border-transparent shadow-[0_20px_40px_rgb(0,0,0,0.15)] scale-[1.02]' : 'bg-white/40 border-white/60 shadow-sm border hover:bg-white/60'} backdrop-blur-xl`}
                >
                    <div className="relative z-10 flex items-center justify-between">
                        <div>
                            <h3 className={`font-bold text-lg ${status === 'Off' ? 'text-white' : 'text-primary'}`}>OFFLINE</h3>
                            <p className={`text-xs mt-1 font-medium ${status === 'Off' ? 'text-white/60' : 'text-text-muted'}`}>You will not appear in the app</p>
                        </div>
                        <div className={`w-4 h-4 rounded-full border-4 ${status === 'Off' ? 'border-white bg-red-400' : 'border-border/50 bg-transparent'}`} />
                    </div>
                </button>
            </div>
            
            <button 
                onClick={handleSave}
                className="mt-4 w-full bg-primary text-white rounded-2xl py-4 font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
                {saved ? <><CheckCircle2 className="w-5 h-5" /> Saved Successfully</> : <><Save className="w-5 h-5" /> Update Status</>}
            </button>
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
            <div className="text-center mb-2">
                <h2 className="font-serif text-3xl text-primary font-medium">Your Schedule</h2>
                <p className="text-sm text-text-muted mt-1">Set future availability</p>
            </div>

            <div className="bg-white/40 backdrop-blur-xl border border-white/60 rounded-[24px] p-5 shadow-[inset_0_1px_1px_rgba(255,255,255,1),0_8px_32px_rgba(0,0,0,0.04)]">
                <label className="text-xs font-bold text-text-muted uppercase tracking-widest block mb-3">Select Date</label>
                <div className="flex items-center gap-3 bg-white rounded-2xl p-2 border border-border/50 shadow-sm">
                    <Calendar className="w-5 h-5 text-primary/50 ml-2" />
                    <input 
                        type="date" 
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="flex-1 bg-transparent border-none focus:outline-none text-primary font-bold py-2"
                    />
                </div>
            </div>

            <div className="bg-white/40 backdrop-blur-xl border border-white/60 rounded-[32px] p-6 shadow-[inset_0_1px_1px_rgba(255,255,255,1),0_8px_32px_rgba(0,0,0,0.04)]">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xs font-bold text-text-muted uppercase tracking-widest">Time Slots</h3>
                    <span className="text-xs font-bold bg-primary/10 text-primary px-3 py-1 rounded-full">{availableTimes.length} active</span>
                </div>
                
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 sm:gap-3">
                    {timeSlots.map(time => {
                        const isSelected = availableTimes.includes(time);
                        return (
                            <button
                                key={time}
                                onClick={() => toggleTimeSlot(time)}
                                className={`py-3 rounded-xl text-sm font-semibold transition-all duration-300 border ${isSelected ? 'bg-primary text-white border-primary shadow-md scale-[1.05] z-10' : 'bg-surface/50 text-text-muted border-border/50 hover:border-primary/40'}`}
                            >
                                {time}
                            </button>
                        );
                    })}
                </div>
            </div>
            
            <button 
                onClick={handleSave}
                className="w-full bg-[#292831] text-white rounded-2xl py-4 font-bold shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
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
            <div className="text-center mb-2">
                <h2 className="font-serif text-3xl text-primary font-medium">Your Profile</h2>
                <p className="text-sm text-text-muted mt-1">Manage your identity</p>
            </div>

            <div className="bg-white/40 backdrop-blur-xl border border-white/60 rounded-[32px] p-6 shadow-[inset_0_1px_1px_rgba(255,255,255,1),0_8px_32px_rgba(0,0,0,0.04)] flex flex-col items-center">
                
                {/* Avatar Uploader (UI Only) */}
                <div className="relative mb-8 group cursor-pointer">
                    <div className="w-28 h-28 rounded-full bg-surface border-4 border-white shadow-lg flex items-center justify-center overflow-hidden relative">
                        {profile.avatar ? (
                            <img src={profile.avatar} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            <User className="w-12 h-12 text-text-muted/50" />
                        )}
                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Camera className="w-8 h-8 text-white" />
                        </div>
                    </div>
                </div>

                {/* Form Fields */}
                <div className="w-full space-y-4">
                    <div>
                        <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest ml-4 block mb-1">Full Name</label>
                        <input 
                            type="text" 
                            value={profile.name}
                            onChange={(e) => setProfile({...profile, name: e.target.value})}
                            className="w-full bg-white/60 border border-white/60 rounded-2xl py-3.5 px-4 text-sm font-semibold text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-sm"
                        />
                    </div>
                    <div>
                        <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest ml-4 block mb-1">Primary Specialty</label>
                        <input 
                            type="text" 
                            value={profile.specialty}
                            onChange={(e) => setProfile({...profile, specialty: e.target.value})}
                            className="w-full bg-white/60 border border-white/60 rounded-2xl py-3.5 px-4 text-sm font-semibold text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-sm"
                        />
                    </div>
                    <div>
                        <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest ml-4 block mb-1">Base Location</label>
                        <select 
                            value={profile.location}
                            onChange={(e) => setProfile({...profile, location: e.target.value})}
                            className="w-full bg-white/60 border border-white/60 rounded-2xl py-3.5 px-4 text-sm font-semibold text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-sm appearance-none"
                        >
                            <option value="Ubud">Ubud</option>
                            <option value="Canggu">Canggu</option>
                            <option value="Seminyak">Seminyak</option>
                        </select>
                    </div>
                </div>
            </div>

            <button 
                onClick={handleSave}
                className="w-full bg-primary text-white rounded-2xl py-4 font-bold shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
                {saved ? <><CheckCircle2 className="w-5 h-5" /> Profile Updated</> : <><Save className="w-5 h-5" /> Update Profile</>}
            </button>

            <button 
                onClick={() => router.push('/')}
                className="mt-4 w-full bg-white/40 border border-border/50 text-red-500 rounded-2xl py-4 font-bold shadow-sm hover:bg-white/60 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
                <LogOut className="w-4 h-4" /> Sign Out
            </button>
        </motion.div>
    );

    return (
        <div className="min-h-screen bg-[#FDFDFD] font-sans text-text relative overflow-hidden pb-32">
            {/* Minimal App Background Gradients */}
            <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-[#E8E8E6] rounded-full blur-[100px] opacity-40 mix-blend-multiply pointer-events-none fixed" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[70%] h-[70%] bg-[#D5D5D1] rounded-full blur-[120px] opacity-30 mix-blend-multiply pointer-events-none fixed" />

            <main className="max-w-md mx-auto px-5 pt-12 relative z-10 min-h-screen">
                <AnimatePresence mode="wait">
                    {activeTab === 'home' && <motion.div key="home">{renderHome()}</motion.div>}
                    {activeTab === 'schedule' && <motion.div key="schedule">{renderSchedule()}</motion.div>}
                    {activeTab === 'profile' && <motion.div key="profile">{renderProfile()}</motion.div>}
                </AnimatePresence>
            </main>

            {/* Floating Bottom Navbar */}
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-40px)] max-w-sm z-50">
                <div className="bg-white/60 saturate-[1.5] backdrop-blur-[40px] border border-white/80 shadow-[inset_0_1px_1px_rgba(255,255,255,1),0_20px_40px_rgba(0,0,0,0.1)] rounded-full flex items-center justify-between p-2 px-4">
                    
                    <button 
                        onClick={() => setActiveTab('home')}
                        className={`flex-1 flex flex-col items-center justify-center py-2 transition-all ${activeTab === 'home' ? 'text-primary scale-110' : 'text-text-muted hover:text-primary/70'}`}
                    >
                        <Home className="w-5 h-5 mb-1" strokeWidth={activeTab === 'home' ? 2.5 : 2} />
                        <span className="text-[9px] font-bold tracking-widest uppercase">Home</span>
                    </button>
                    
                    <button 
                        onClick={() => setActiveTab('schedule')}
                        className={`flex-1 flex flex-col items-center justify-center py-2 transition-all ${activeTab === 'schedule' ? 'text-primary scale-110' : 'text-text-muted hover:text-primary/70'}`}
                    >
                        <Calendar className="w-5 h-5 mb-1" strokeWidth={activeTab === 'schedule' ? 2.5 : 2} />
                        <span className="text-[9px] font-bold tracking-widest uppercase">Schedule</span>
                    </button>
                    
                    <button 
                        onClick={() => setActiveTab('profile')}
                        className={`flex-1 flex flex-col items-center justify-center py-2 transition-all ${activeTab === 'profile' ? 'text-primary scale-110' : 'text-text-muted hover:text-primary/70'}`}
                    >
                        <User className="w-5 h-5 mb-1" strokeWidth={activeTab === 'profile' ? 2.5 : 2} />
                        <span className="text-[9px] font-bold tracking-widest uppercase">Profile</span>
                    </button>

                </div>
            </div>
        </div>
    );
}
