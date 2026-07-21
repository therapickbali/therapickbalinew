'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Plus, Edit2, Trash2, X, Save } from 'lucide-react';
import { Treatment } from '@/context/SpaContext';
import PartnerTreatmentForm from './PartnerTreatmentForm';

interface PartnerTreatmentsProps {
    therapistId: string;
}

export default function PartnerTreatments({ therapistId }: PartnerTreatmentsProps) {
    const [treatments, setTreatments] = useState<Treatment[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    
    const [editingTreatment, setEditingTreatment] = useState<Treatment | undefined>(undefined);

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
        setEditingTreatment(undefined);
        setIsEditing(true);
    };

    const handleEdit = (t: Treatment) => {
        setEditingTreatment(t);
        setIsEditing(true);
    };

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this treatment?')) {
            await supabase.from('treatments').delete().eq('id', id);
            fetchTreatments();
        }
    };

    if (isEditing) {
        return (
            <PartnerTreatmentForm 
                partnerId={therapistId} 
                treatmentToEdit={editingTreatment}
                onSaveSuccess={() => {
                    setIsEditing(false);
                    fetchTreatments();
                }}
                onCancel={() => setIsEditing(false)}
            />
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
