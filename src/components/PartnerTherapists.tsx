'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Plus, Edit2, Trash2, X, Save, Camera, CheckCircle2 } from 'lucide-react';
import { PartnerTherapist } from '@/context/SpaContext';

interface PartnerTherapistsProps {
    partnerId: string;
}

export default function PartnerTherapists({ partnerId }: PartnerTherapistsProps) {
    const [therapists, setTherapists] = useState<PartnerTherapist[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    
    // Form state
    const [editingId, setEditingId] = useState<string | null>(null);
    const [name, setName] = useState('');
    const [bio, setBio] = useState('');
    const [imageUrl, setImageUrl] = useState('');

    useEffect(() => {
        fetchTherapists();
    }, [partnerId]);

    const fetchTherapists = async () => {
        setIsLoading(true);
        const { data, error } = await supabase
            .from('partner_therapists')
            .select('*')
            .eq('partner_id', partnerId)
            .order('created_at', { ascending: false });
            
        if (!error && data) {
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
        setIsEditing(true);
    };

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to remove this therapist?')) {
            await supabase.from('partner_therapists').delete().eq('id', id);
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
                    const MAX_WIDTH = 400;
                    const MAX_HEIGHT = 400;
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

        const payload = {
            name,
            bio,
            image_url: imageUrl,
            partner_id: partnerId,
            is_active: true
        };

        if (editingId) {
            await supabase.from('partner_therapists').update(payload).eq('id', editingId);
        } else {
            await supabase.from('partner_therapists').insert([payload]);
        }

        setIsEditing(false);
        fetchTherapists();
    };

    const handleStatusUpdate = async (id: string, status: string) => {
        await supabase.from('partner_therapists').update({ online_status: status }).eq('id', id);
        fetchTherapists();
    };

    if (isEditing) {
        return (
            <div className="bg-[#1C1C1E]/80 backdrop-blur-[60px] border border-white/[0.08] rounded-[32px] p-6 shadow-[0_8px_32px_rgba(0,0,0,0.37)]">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="font-serif text-2xl text-white font-medium">{editingId ? 'Edit Therapist' : 'New Therapist'}</h2>
                    <button onClick={() => setIsEditing(false)} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/70 hover:text-white"><X size={16} /></button>
                </div>
                
                <div className="space-y-4">
                    {/* Avatar Upload */}
                    <div className="flex justify-center mb-6">
                        <div className="relative group cursor-pointer">
                            <div className="w-24 h-24 rounded-full overflow-hidden bg-[#2C2C2E] border-2 border-white/20 shadow-inner flex items-center justify-center">
                                {imageUrl ? (
                                    <img src={imageUrl} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <Camera className="w-8 h-8 text-white/40" />
                                )}
                            </div>
                            <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="text-xs font-bold text-white">Upload</span>
                            </div>
                            <input 
                                type="file" 
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="absolute inset-0 opacity-0 cursor-pointer"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-[10px] font-bold text-white/60 uppercase tracking-widest ml-4 block mb-1">Full Name</label>
                        <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full bg-[#2C2C2E]/80 border border-transparent rounded-xl py-3 px-4 text-white focus:outline-none" />
                    </div>
                    <div>
                        <label className="text-[10px] font-bold text-white/60 uppercase tracking-widest ml-4 block mb-1">Short Bio</label>
                        <textarea value={bio} onChange={e => setBio(e.target.value)} rows={3} className="w-full bg-[#2C2C2E]/80 border border-transparent rounded-xl py-3 px-4 text-white focus:outline-none resize-none" />
                    </div>

                    <button onClick={handleSave} className="w-full mt-4 bg-[#0A84FF] text-white rounded-full py-4 font-semibold text-[17px] tracking-wide shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2">
                        <Save className="w-5 h-5" /> Save Therapist
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="bg-[#1C1C1E]/80 backdrop-blur-[60px] border border-white/[0.08] rounded-[32px] p-6 shadow-[0_8px_32px_rgba(0,0,0,0.37)] flex justify-between items-center">
                <div>
                    <h2 className="font-serif text-2xl text-white font-medium">Therapists</h2>
                    <p className="text-xs text-white/60 mt-1">Manage your team and availability</p>
                </div>
                <button onClick={handleAddNew} className="bg-white/10 text-white rounded-full p-3 hover:bg-white/20 transition">
                    <Plus size={20} />
                </button>
            </div>

            {isLoading ? (
                <div className="text-center text-white/50 py-10">Loading...</div>
            ) : therapists.length === 0 ? (
                <div className="text-center text-white/50 py-10 bg-white/5 rounded-3xl">No therapists added yet.</div>
            ) : (
                <div className="space-y-4">
                    {therapists.map(t => (
                        <div key={t.id} className="bg-[#1C1C1E]/80 backdrop-blur-[60px] border border-white/[0.08] rounded-[32px] p-5 flex flex-col gap-4">
                            <div className="flex justify-between items-start">
                                <div className="flex gap-4 items-center">
                                    <div className="w-12 h-12 rounded-full overflow-hidden bg-[#2C2C2E] border border-white/20">
                                        {t.image_url ? (
                                            <img src={t.image_url} alt={t.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-white/40"><Camera size={16} /></div>
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="text-white font-semibold text-lg">{t.name}</h3>
                                        <p className="text-xs text-white/50 line-clamp-1">{t.bio || 'No bio'}</p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => handleEdit(t)} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/70 hover:text-white"><Edit2 size={14} /></button>
                                    <button onClick={() => handleDelete(t.id)} className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center text-red-400 hover:text-red-300"><Trash2 size={14} /></button>
                                </div>
                            </div>
                            
                            <div className="bg-[#2C2C2E]/50 rounded-2xl p-4">
                                <h4 className="text-[10px] font-bold text-white/60 uppercase tracking-widest mb-3">Real-time Availability</h4>
                                <div className="space-y-2">
                                    <button 
                                        onClick={() => handleStatusUpdate(t.id, 'READY TO ACCEPT JOBS')}
                                        className={`w-full flex items-center justify-between p-3 rounded-xl transition-colors ${t.online_status === 'READY TO ACCEPT JOBS' ? 'bg-[#0E2A1A] border border-[#16A34A]/30' : 'bg-[#1C1C1E] border border-white/5 hover:border-white/10'}`}
                                    >
                                        <div className="text-left">
                                            <div className={`font-semibold text-sm ${t.online_status === 'READY TO ACCEPT JOBS' ? 'text-white' : 'text-white/70'}`}>READY TO ACCEPT JOBS</div>
                                        </div>
                                        {t.online_status === 'READY TO ACCEPT JOBS' ? <CheckCircle2 className="w-5 h-5 text-[#16A34A]" /> : <div className="w-4 h-4 rounded-full border-2 border-white/20" />}
                                    </button>
                                    
                                    <button 
                                        onClick={() => handleStatusUpdate(t.id, 'HANDLING CUSTOMER')}
                                        className={`w-full flex items-center justify-between p-3 rounded-xl transition-colors ${t.online_status === 'HANDLING CUSTOMER' ? 'bg-[#2A1A0E] border border-[#EAB308]/30' : 'bg-[#1C1C1E] border border-white/5 hover:border-white/10'}`}
                                    >
                                        <div className="text-left">
                                            <div className={`font-semibold text-sm ${t.online_status === 'HANDLING CUSTOMER' ? 'text-white' : 'text-white/70'}`}>HANDLING CUSTOMER</div>
                                        </div>
                                        {t.online_status === 'HANDLING CUSTOMER' ? <CheckCircle2 className="w-5 h-5 text-[#EAB308]" /> : <div className="w-4 h-4 rounded-full border-2 border-white/20" />}
                                    </button>

                                    <button 
                                        onClick={() => handleStatusUpdate(t.id, 'OFFLINE')}
                                        className={`w-full flex items-center justify-between p-3 rounded-xl transition-colors ${t.online_status === 'OFFLINE' ? 'bg-white/10 border border-white/30' : 'bg-[#1C1C1E] border border-white/5 hover:border-white/10'}`}
                                    >
                                        <div className="text-left">
                                            <div className={`font-semibold text-sm ${t.online_status === 'OFFLINE' ? 'text-white' : 'text-white/70'}`}>OFFLINE</div>
                                        </div>
                                        {t.online_status === 'OFFLINE' ? <CheckCircle2 className="w-5 h-5 text-white" /> : <div className="w-4 h-4 rounded-full border-2 border-white/20" />}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
