'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Save, User, ArrowLeft, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function TherapistDashboard() {
    const [selectedTherapist, setSelectedTherapist] = useState('');
    const [selectedDate, setSelectedDate] = useState('');
    const [availableTimes, setAvailableTimes] = useState<string[]>([]);
    const [status, setStatus] = useState('Online');
    const [saved, setSaved] = useState(false);

    // Mock data for therapists
    const therapists = [
        { id: 't1', name: 'Sarah J.', location: 'Seminyak' },
        { id: 't2', name: 'Dewi K.', location: 'Ubud' },
        { id: 't3', name: 'Wayan M.', location: 'Canggu' },
        { id: 't4', name: 'Ketut A.', location: 'Ubud' },
        { id: 't5', name: 'Made B.', location: 'Uluwatu' },
    ];

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
        // Here you would normally push to Supabase real-time database
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    return (
        <div className="min-h-screen bg-[#FDFBF7] font-sans text-text">
            {/* Header */}
            <header className="bg-white border-b border-border/50 sticky top-0 z-50">
                <div className="max-w-5xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/" className="w-10 h-10 rounded-full bg-surface flex items-center justify-center hover:bg-border transition-colors">
                            <ArrowLeft className="w-5 h-5 text-primary" />
                        </Link>
                        <div>
                            <h1 className="font-serif text-2xl text-primary font-medium tracking-tight">Therapist Dashboard</h1>
                            <p className="text-xs text-text-muted">Manage your real-time availability</p>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-5xl mx-auto px-6 py-12">
                <div className="grid md:grid-cols-[320px_1fr] gap-8">
                    
                    {/* Sidebar / Setup */}
                    <div className="space-y-8">
                        <div className="bg-white p-6 rounded-[24px] border border-border/50 shadow-sm">
                            <h3 className="text-xs font-bold text-text-muted uppercase tracking-widest mb-4 flex items-center gap-2">
                                <User className="w-4 h-4" /> Identity
                            </h3>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-primary">Select Profile</label>
                                <div className="relative">
                                    <select 
                                        value={selectedTherapist}
                                        onChange={(e) => setSelectedTherapist(e.target.value)}
                                        className="w-full bg-surface border border-border/50 rounded-xl px-4 py-3.5 text-sm text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all appearance-none"
                                    >
                                        <option value="" disabled>Choose your profile...</option>
                                        {therapists.map(t => (
                                            <option key={t.id} value={t.id}>{t.name} ({t.location})</option>
                                        ))}
                                    </select>
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary/50"><path d="m6 9 6 6 6-6"/></svg>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-[24px] border border-border/50 shadow-sm">
                            <h3 className="text-xs font-bold text-text-muted uppercase tracking-widest mb-4 flex items-center gap-2">
                                <Calendar className="w-4 h-4" /> Date Selection
                            </h3>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-primary">Working Date</label>
                                <input 
                                    type="date"
                                    value={selectedDate}
                                    onChange={(e) => setSelectedDate(e.target.value)}
                                    className="w-full bg-surface border border-border/50 rounded-xl px-4 py-3.5 text-sm text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Main Workspace */}
                    <div className="bg-white p-6 md:p-10 rounded-[32px] border border-border/50 shadow-soft min-h-[500px] flex flex-col relative overflow-hidden">
                        
                        {/* Decorative background blur */}
                        <div className="absolute top-[-10%] right-[-5%] w-64 h-64 bg-[#D2F34C]/20 blur-[80px] rounded-full z-0 pointer-events-none opacity-60" />

                        <div className="relative z-10 flex-1 flex flex-col">
                            <h3 className="text-xs font-bold text-text-muted uppercase tracking-widest mb-8 flex items-center gap-2">
                                <Clock className="w-4 h-4" /> Set Available Times
                            </h3>

                            {!selectedTherapist || !selectedDate ? (
                                <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
                                    <div className="w-20 h-20 bg-surface rounded-full flex items-center justify-center text-border mb-6">
                                        <Clock className="w-8 h-8 text-primary/40" />
                                    </div>
                                    <h4 className="font-serif text-2xl text-primary mb-3">Almost ready!</h4>
                                    <p className="text-sm text-text-muted max-w-sm leading-relaxed">Please select your therapist profile and a specific date from the sidebar to begin managing your availability.</p>
                                </div>
                            ) : (
                                <div className="flex-1 flex flex-col">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-6 border-b border-border/40 gap-6">
                                        <div>
                                            <p className="text-lg font-serif font-bold text-primary">Time Slots & Status for {selectedDate}</p>
                                            <p className="text-sm text-text-muted mt-1">Manage your current working status and time slots.</p>
                                        </div>
                                        <div className="flex flex-col items-end gap-3">
                                            <div className="flex bg-surface rounded-full p-1 border border-border/50 shadow-inner">
                                                {['Online', 'Busy', 'Off'].map(s => (
                                                    <button 
                                                        key={s}
                                                        onClick={() => setStatus(s)}
                                                        className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                                                            status === s 
                                                                ? (s === 'Online' ? 'bg-green-500 text-white shadow-sm' : s === 'Busy' ? 'bg-amber-500 text-white shadow-sm' : 'bg-red-500 text-white shadow-sm')
                                                                : 'text-text-muted hover:text-primary hover:bg-black/5'
                                                        }`}
                                                    >
                                                        {s === 'Busy' ? 'Still handle customer' : s === 'Off' ? 'Offline' : s}
                                                    </button>
                                                ))}
                                            </div>
                                            <div className="text-xs font-bold bg-primary/5 border border-primary/20 text-primary px-4 py-2 rounded-full">
                                                {availableTimes.length} slots active
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 mb-10">
                                        {timeSlots.map(time => {
                                            const isSelected = availableTimes.includes(time);
                                            return (
                                                <button
                                                    key={time}
                                                    onClick={() => toggleTimeSlot(time)}
                                                    className={`py-3.5 rounded-xl text-sm font-semibold transition-all duration-300 border ${isSelected ? 'bg-primary text-white border-primary shadow-md scale-[1.02]' : 'bg-surface text-text-muted border-border/50 hover:border-primary/40'}`}
                                                >
                                                    {time}
                                                </button>
                                            );
                                        })}
                                    </div>

                                    <div className="mt-auto pt-8 flex justify-end">
                                        <button 
                                            onClick={handleSave}
                                            className={`px-8 py-4 rounded-xl text-sm font-bold uppercase tracking-widest flex items-center gap-2 transition-all duration-300 ${saved ? 'bg-green-500 text-white shadow-lg shadow-green-500/30' : 'bg-primary text-white shadow-[0_8px_24px_rgb(0,0,0,0.15)] hover:bg-primary/90 hover:scale-[1.02]'}`}
                                        >
                                            {saved ? (
                                                <><CheckCircle2 className="w-5 h-5" /> Update Successful</>
                                            ) : (
                                                <><Save className="w-5 h-5" /> Publish Availability to Supabase</>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
}
