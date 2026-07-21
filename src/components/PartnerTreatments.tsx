'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Plus, Edit2, Trash2, X, Save } from 'lucide-react';
import { Treatment } from '@/context/SpaContext';

interface PartnerTreatmentsProps {
    therapistId: string;
}

export default function PartnerTreatments({ therapistId }: PartnerTreatmentsProps) {
    const [treatments, setTreatments] = useState<Treatment[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    
    // Form state
    const [editingId, setEditingId] = useState<string | null>(null);
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('massage');
    const [desc, setDesc] = useState('');
    const [duration1, setDuration1] = useState('60');
    const [price1, setPrice1] = useState('');
    const [duration2, setDuration2] = useState('');
    const [price2, setPrice2] = useState('');
    const [bgPattern, setBgPattern] = useState('pattern1');
    const [isPublished, setIsPublished] = useState(true);

    useEffect(() => {
        fetchTreatments();
    }, [therapistId]);

    const fetchTreatments = async () => {
        setIsLoading(true);
        const { data, error } = await supabase
            .from('treatments')
            .select('*')
            .eq('therapist_id', therapistId)
            .order('created_at', { ascending: false });
            
        if (!error && data) {
            setTreatments(data as Treatment[]);
        }
        setIsLoading(false);
    };

    const handleAddNew = () => {
        setEditingId(null);
        setTitle('');
        setCategory('massage');
        setDesc('');
        setDuration1('60');
        setPrice1('');
        setDuration2('');
        setPrice2('');
        setBgPattern('pattern1');
        setIsPublished(true);
        setIsEditing(true);
    };

    const handleEdit = (t: Treatment) => {
        setEditingId(t.id);
        setTitle(t.title);
        setCategory(t.category);
        setDesc(t.desc);
        setDuration1(t.options[0]?.duration?.replace(/\D/g, '') || '60');
        setPrice1(t.options[0]?.price || '');
        if (t.options.length > 1) {
            setDuration2(t.options[1]?.duration?.replace(/\D/g, '') || '');
            setPrice2(t.options[1]?.price || '');
        } else {
            setDuration2('');
            setPrice2('');
        }
        setBgPattern(t.bgPattern || 'pattern1');
        setIsPublished(t.is_published ?? true);
        setIsEditing(true);
    };

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this treatment?')) {
            await supabase.from('treatments').delete().eq('id', id);
            fetchTreatments();
        }
    };

    const handleSave = async () => {
        if (!title || !desc || !price1) {
            alert('Please fill out Title, Description, and at least one Price.');
            return;
        }

        const options = [{ duration: `${duration1} Min`, price: price1 }];
        if (duration2 && price2) {
            options.push({ duration: `${duration2} Min`, price: price2 });
        }

        const payload = {
            title,
            category,
            desc,
            options,
            bgPattern,
            is_published: isPublished,
            therapist_id: therapistId
        };

        if (editingId) {
            await supabase.from('treatments').update(payload).eq('id', editingId);
        } else {
            await supabase.from('treatments').insert([payload]);
        }

        setIsEditing(false);
        fetchTreatments();
    };

    if (isEditing) {
        return (
            <div className="bg-[#1C1C1E]/80 backdrop-blur-[60px] border border-white/[0.08] rounded-[32px] p-6 shadow-[0_8px_32px_rgba(0,0,0,0.37)]">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="font-serif text-2xl text-white font-medium">{editingId ? 'Edit Treatment' : 'New Treatment'}</h2>
                    <button onClick={() => setIsEditing(false)} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/70 hover:text-white"><X size={16} /></button>
                </div>
                
                <div className="space-y-4">
                    <div>
                        <label className="text-[10px] font-bold text-white/60 uppercase tracking-widest ml-4 block mb-1">Title</label>
                        <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-[#2C2C2E]/80 border border-transparent rounded-xl py-3 px-4 text-white focus:outline-none" />
                    </div>
                    <div>
                        <label className="text-[10px] font-bold text-white/60 uppercase tracking-widest ml-4 block mb-1">Category</label>
                        <select value={category} onChange={e => setCategory(e.target.value)} className="w-full bg-[#2C2C2E]/80 border border-transparent rounded-xl py-3 px-4 text-white focus:outline-none [&>option]:text-black">
                            <option value="massage">Massage</option>
                            <option value="body">Body</option>
                            <option value="beauty">Beauty</option>
                            <option value="packages">Packages</option>
                        </select>
                    </div>
                    <div>
                        <label className="text-[10px] font-bold text-white/60 uppercase tracking-widest ml-4 block mb-1">Description</label>
                        <textarea value={desc} onChange={e => setDesc(e.target.value)} rows={3} className="w-full bg-[#2C2C2E]/80 border border-transparent rounded-xl py-3 px-4 text-white focus:outline-none resize-none" />
                    </div>
                    
                    <div className="flex gap-4">
                        <div className="flex-1">
                            <label className="text-[10px] font-bold text-white/60 uppercase tracking-widest ml-4 block mb-1">Duration 1 (Min)</label>
                            <input type="text" value={duration1} onChange={e => setDuration1(e.target.value)} placeholder="60" className="w-full bg-[#2C2C2E]/80 border border-transparent rounded-xl py-3 px-4 text-white focus:outline-none" />
                        </div>
                        <div className="flex-1">
                            <label className="text-[10px] font-bold text-white/60 uppercase tracking-widest ml-4 block mb-1">Price 1 (e.g. 450,000)</label>
                            <input type="text" value={price1} onChange={e => setPrice1(e.target.value)} className="w-full bg-[#2C2C2E]/80 border border-transparent rounded-xl py-3 px-4 text-white focus:outline-none" />
                        </div>
                    </div>
                    
                    <div className="flex gap-4">
                        <div className="flex-1">
                            <label className="text-[10px] font-bold text-white/60 uppercase tracking-widest ml-4 block mb-1">Duration 2 (Optional)</label>
                            <input type="text" value={duration2} onChange={e => setDuration2(e.target.value)} placeholder="90" className="w-full bg-[#2C2C2E]/80 border border-transparent rounded-xl py-3 px-4 text-white focus:outline-none" />
                        </div>
                        <div className="flex-1">
                            <label className="text-[10px] font-bold text-white/60 uppercase tracking-widest ml-4 block mb-1">Price 2</label>
                            <input type="text" value={price2} onChange={e => setPrice2(e.target.value)} className="w-full bg-[#2C2C2E]/80 border border-transparent rounded-xl py-3 px-4 text-white focus:outline-none" />
                        </div>
                    </div>

                    <div className="flex items-center gap-2 mt-2 ml-4">
                        <input type="checkbox" checked={isPublished} onChange={e => setIsPublished(e.target.checked)} id="isPublished" />
                        <label htmlFor="isPublished" className="text-sm text-white/80">Published</label>
                    </div>

                    <button onClick={handleSave} className="w-full mt-4 bg-[#0A84FF] text-white rounded-full py-4 font-semibold text-[17px] tracking-wide shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2">
                        <Save className="w-5 h-5" /> Save Treatment
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="bg-[#1C1C1E]/80 backdrop-blur-[60px] border border-white/[0.08] rounded-[32px] p-6 shadow-[0_8px_32px_rgba(0,0,0,0.37)] flex justify-between items-center">
                <div>
                    <h2 className="font-serif text-2xl text-white font-medium">My Treatments</h2>
                    <p className="text-xs text-white/60 mt-1">Manage your services</p>
                </div>
                <button onClick={handleAddNew} className="bg-white/10 text-white rounded-full p-3 hover:bg-white/20 transition">
                    <Plus size={20} />
                </button>
            </div>

            {isLoading ? (
                <div className="text-center text-white/50 py-10">Loading...</div>
            ) : treatments.length === 0 ? (
                <div className="text-center text-white/50 py-10 bg-white/5 rounded-3xl">No treatments found. Create one!</div>
            ) : (
                <div className="space-y-4">
                    {treatments.map(t => (
                        <div key={t.id} className="bg-white/5 border border-white/10 rounded-[24px] p-5 backdrop-blur-md flex flex-col gap-3">
                            <div className="flex justify-between items-start">
                                <div>
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-white/50 bg-white/5 px-2 py-1 rounded-md">{t.category}</span>
                                    <h3 className="text-white font-semibold mt-2">{t.title}</h3>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => handleEdit(t)} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/70 hover:text-white"><Edit2 size={14} /></button>
                                    <button onClick={() => handleDelete(t.id)} className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center text-red-400 hover:text-red-300"><Trash2 size={14} /></button>
                                </div>
                            </div>
                            <p className="text-xs text-white/70 line-clamp-2">{t.desc}</p>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {t.options.map((opt, i) => (
                                    <div key={i} className="bg-white/10 text-[11px] px-3 py-1.5 rounded-full text-white/90">
                                        {opt.duration} - Rp {opt.price}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
