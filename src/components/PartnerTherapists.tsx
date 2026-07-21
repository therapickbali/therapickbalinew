'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Plus, Edit2, Trash2, X, Save, Camera, CheckCircle2, MoreVertical, Power, UserCircle } from 'lucide-react';
import { PartnerTherapist } from '@/context/SpaContext';
import { motion, AnimatePresence } from 'framer-motion';

interface PartnerTherapistsProps {
    partnerId: string;
}

export default function PartnerTherapists({ partnerId }: PartnerTherapistsProps) {
    const [therapists, setTherapists] = useState<PartnerTherapist[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
    
    // Form state
    const [editingId, setEditingId] = useState<string | null>(null);
    const [name, setName] = useState('');
    const [bio, setBio] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        fetchTherapists();
    }, [partnerId]);

    const fetchTherapists = async () => {
        setIsLoading(true);
        setErrorMessage(null);
        const { data, error } = await supabase
            .from('partner_therapists')
            .select('*')
            .eq('partner_id', partnerId)
            .order('created_at', { ascending: false });
            
        if (error) {
            console.error("Error fetching therapists:", error);
            if (error.message.includes('Could not find the table')) {
                setErrorMessage('The "partner_therapists" table has not been created yet in Supabase. Please run the SQL migration from the previous instructions.');
            } else {
                setErrorMessage(error.message);
            }
        } else if (data) {
            setTherapists(data as PartnerTherapist[]);
        }
        setIsLoading(false);
    };

    const handleAddNew = () => {
        setEditingId(null);
        setName('');
        setBio('');
        setImageUrl('');
        setIsEditing(true);
    };

    const handleEdit = (t: PartnerTherapist) => {
        setEditingId(t.id);
        setName(t.name);
        setBio(t.bio || '');
        setImageUrl(t.image_url || '');
        setActiveMenuId(null);
        setIsEditing(true);
    };

    const handleDelete = async (id: string) => {
        setActiveMenuId(null);
        if (confirm('Are you sure you want to remove this therapist?')) {
            const { error } = await supabase.from('partner_therapists').delete().eq('id', id);
            if (error) {
                alert(`Error deleting: ${error.message}`);
                return;
            }
            fetchTherapists();
        }
    };

    const resizeImage = (file: File): Promise<string> => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const MAX_WIDTH = 500;
                    const MAX_HEIGHT = 500;
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

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const resizedUrl = await resizeImage(file);
            setImageUrl(resizedUrl);
        }
    };

    const handleSave = async () => {
        if (!name) {
            alert('Please enter a name.');
            return;
        }

        setIsSaving(true);
        const payload = {
            name,
            bio,
            image_url: imageUrl,
            partner_id: partnerId,
            is_active: true
        };

        let result;
        if (editingId) {
            result = await supabase.from('partner_therapists').update(payload).eq('id', editingId);
        } else {
            result = await supabase.from('partner_therapists').insert([payload]);
        }

        setIsSaving(false);

        if (result.error) {
            alert(`Error saving therapist: ${result.error.message}\nIf this is a table not found error, please execute the SQL script first.`);
            return;
        }

        setIsEditing(false);
        fetchTherapists();
    };

    const handleStatusUpdate = async (id: string, status: string) => {
        const { error } = await supabase.from('partner_therapists').update({ online_status: status }).eq('id', id);
        if (error) {
            alert(`Error updating status: ${error.message}`);
            return;
        }
        fetchTherapists();
    };

    if (isEditing) {
        return (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-6">
                <div className="bg-[#1C1C1E]/80 backdrop-blur-[60px] border border-white/[0.08] shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] rounded-[32px] p-6 shadow-[0_8px_32px_rgba(0,0,0,0.37)]">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="font-serif text-2xl text-white font-medium">{editingId ? 'Edit Profile' : 'New Therapist'}</h2>
                        <button onClick={() => setIsEditing(false)} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 transition-all"><X size={16} /></button>
                    </div>
                    
                    <div className="space-y-6">
                        {/* Avatar Upload */}
                        <div className="flex flex-col items-center justify-center mb-4">
                            <div className="relative group cursor-pointer mb-3">
                                <div className="w-28 h-28 rounded-full overflow-hidden bg-[#2C2C2E] border-2 border-white/10 shadow-lg flex items-center justify-center transition-all group-hover:border-white/30">
                                    {imageUrl ? (
                                        <img src={imageUrl} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        <Camera className="w-10 h-10 text-white/30" />
                                    )}
                                </div>
                                <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
                                    <span className="text-[11px] font-bold text-white uppercase tracking-widest">Change</span>
                                </div>
                                <input 
                                    type="file" 
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                />
                            </div>
                            <span className="text-[10px] text-white/50 uppercase tracking-widest font-semibold">Profile Photo</span>
                        </div>

                        <div>
                            <label className="text-[10px] font-bold text-white/60 uppercase tracking-widest ml-4 block mb-1">Full Name</label>
                            <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Ayu Lestari" className="w-full bg-[#2C2C2E]/80 border border-transparent rounded-2xl py-4 px-5 text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-[#0A84FF]/50 transition-all shadow-inner" />
                        </div>
                        <div>
                            <label className="text-[10px] font-bold text-white/60 uppercase tracking-widest ml-4 block mb-1">Short Bio & Specialities</label>
                            <textarea value={bio} onChange={e => setBio(e.target.value)} rows={3} placeholder="e.g. Specialist in Dubainese Massage with 5 years experience..." className="w-full bg-[#2C2C2E]/80 border border-transparent rounded-2xl py-4 px-5 text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-[#0A84FF]/50 transition-all shadow-inner resize-none" />
                        </div>

                        <button onClick={handleSave} disabled={isSaving} className="w-full mt-2 bg-white text-black rounded-full py-4 font-bold text-[15px] tracking-wide shadow-[0_8px_30px_rgba(255,255,255,0.2)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:hover:scale-100">
                            {isSaving ? (
                                <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                            ) : (
                                <><Save className="w-5 h-5" /> {editingId ? 'Save Changes' : 'Add Therapist'}</>
                            )}
                        </button>
                    </div>
                </div>
            </motion.div>
        );
    }

    return (
        <div className="flex flex-col gap-6 w-full">


            {errorMessage && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-5 rounded-3xl text-sm font-medium leading-relaxed">
                    <div className="font-bold text-red-500 mb-1 uppercase tracking-widest text-[10px]">Database Error</div>
                    {errorMessage}
                </div>
            )}

            {isLoading ? (
                <div className="flex items-center justify-center py-20">
                    <div className="w-8 h-8 border-4 border-white/20 border-t-white rounded-full animate-spin" />
                </div>
            ) : therapists.length === 0 && !errorMessage ? (
                <div className="flex flex-col items-center justify-center py-20 bg-white/5 border border-white/5 rounded-[32px]">
                    <UserCircle className="w-16 h-16 text-white/20 mb-4" />
                    <h3 className="text-white font-medium text-lg mb-1">No Therapists Yet</h3>
                    <p className="text-white/50 text-sm text-center max-w-[200px] mb-6">Add your first therapist to start receiving bookings.</p>
                    <button onClick={handleAddNew} className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-full text-sm font-semibold transition-all">Add Therapist</button>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4 pb-12">
                    {therapists.map(t => {
                        const isOnline = t.online_status === 'READY TO ACCEPT JOBS' || t.online_status === 'Online';
                        const isBusy = t.online_status === 'HANDLING CUSTOMER' || t.online_status === 'Busy';
                        
                        return (
                        <div key={t.id} className="group bg-[#1C1C1E]/80 backdrop-blur-[60px] border border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.15)] rounded-[32px] overflow-hidden flex flex-col relative transition-all hover:border-white/15">
                            {/* Card Header & Profile */}
                            <div className="p-5 flex items-center gap-4 relative">
                                <div className="relative shrink-0">
                                    <div className={`w-20 h-20 rounded-full overflow-hidden bg-[#2C2C2E] border-2 shadow-lg transition-colors duration-500 ${isOnline ? 'border-green-500/50' : isBusy ? 'border-amber-500/50' : 'border-white/10'}`}>
                                        {t.image_url ? (
                                            <img src={t.image_url} alt={t.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-white/40"><UserCircle size={28} /></div>
                                        )}
                                    </div>
                                    <div className={`absolute bottom-0 right-0 w-5 h-5 rounded-full border-4 border-[#1C1C1E] transition-colors duration-500 ${isOnline ? 'bg-green-500' : isBusy ? 'bg-amber-500' : 'bg-white/20'}`} />
                                </div>
                                
                                <div className="flex-1 min-w-0 pr-8">
                                    <h3 className="text-white font-bold text-lg leading-tight mb-1 truncate">{t.name}</h3>
                                    <p className="text-[13px] text-white/60 line-clamp-2 leading-relaxed">{t.bio || 'Professional Therapist'}</p>
                                </div>

                                {/* Menu Dots */}
                                <button 
                                    onClick={() => setActiveMenuId(activeMenuId === t.id ? null : t.id)}
                                    className="absolute top-5 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/5 text-white/60 hover:bg-white/10 hover:text-white transition-colors"
                                >
                                    <MoreVertical size={16} />
                                </button>

                                {/* Dropdown Menu */}
                                <AnimatePresence>
                                    {activeMenuId === t.id && (
                                        <motion.div 
                                            initial={{ opacity: 0, scale: 0.95, y: -10 }} 
                                            animate={{ opacity: 1, scale: 1, y: 0 }} 
                                            exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                            className="absolute top-14 right-4 bg-[#2C2C2E] border border-white/10 rounded-2xl shadow-xl overflow-hidden z-20 min-w-[140px]"
                                        >
                                            <button onClick={() => handleEdit(t)} className="w-full px-4 py-3 text-left text-sm text-white hover:bg-white/10 flex items-center gap-2 transition-colors">
                                                <Edit2 size={14} /> Edit Profile
                                            </button>
                                            <div className="w-full h-px bg-white/5" />
                                            <button onClick={() => handleDelete(t.id)} className="w-full px-4 py-3 text-left text-sm text-red-400 hover:bg-red-500/10 flex items-center gap-2 transition-colors">
                                                <Trash2 size={14} /> Remove
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Status Control Panel */}
                            <div className="bg-black/20 p-4 pt-3 flex items-center justify-between gap-2 border-t border-white/5">
                                <button 
                                    onClick={() => handleStatusUpdate(t.id, 'READY TO ACCEPT JOBS')}
                                    className={`flex-1 py-2.5 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all duration-300 border ${isOnline ? 'bg-green-500/10 border-green-500/30' : 'bg-transparent border-transparent hover:bg-white/5'}`}
                                >
                                    <span className={`text-[9px] font-bold tracking-widest uppercase ${isOnline ? 'text-green-500' : 'text-white/40'}`}>Ready</span>
                                </button>
                                
                                <button 
                                    onClick={() => handleStatusUpdate(t.id, 'HANDLING CUSTOMER')}
                                    className={`flex-1 py-2.5 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all duration-300 border ${isBusy ? 'bg-amber-500/10 border-amber-500/30' : 'bg-transparent border-transparent hover:bg-white/5'}`}
                                >
                                    <span className={`text-[9px] font-bold tracking-widest uppercase ${isBusy ? 'text-amber-500' : 'text-white/40'}`}>Busy</span>
                                </button>

                                <button 
                                    onClick={() => handleStatusUpdate(t.id, 'OFFLINE')}
                                    className={`w-12 h-10 rounded-2xl flex items-center justify-center transition-all duration-300 border ${!isOnline && !isBusy ? 'bg-white/10 border-white/20' : 'bg-transparent border-transparent hover:bg-white/5'}`}
                                >
                                    <Power size={14} className={!isOnline && !isBusy ? 'text-white' : 'text-white/40'} />
                                </button>
                            </div>
                        </div>
                    )})}
                </div>
            )}

            {/* Bottom Add New Section */}
            {!isLoading && therapists.length > 0 && (
                <div className="mt-4 bg-[#1C1C1E]/80 backdrop-blur-[60px] border border-white/[0.08] shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] rounded-[32px] p-6 shadow-[0_8px_32px_rgba(0,0,0,0.37)] flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="text-center sm:text-left">
                        <h3 className="font-serif text-2xl text-white font-medium mb-1">Expand Your Team</h3>
                        <p className="text-xs text-white/60">Add a new therapist to increase your bookings capacity.</p>
                    </div>
                    <button onClick={handleAddNew} className="w-full sm:w-auto bg-[#0A84FF] text-white rounded-full py-3 px-6 font-semibold shadow-lg hover:bg-[#007AFF] active:scale-[0.98] transition-all flex items-center justify-center gap-2">
                        <Plus size={20} /> Add Therapist
                    </button>
                </div>
            )}
        </div>
    );
}
