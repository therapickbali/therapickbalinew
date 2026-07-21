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
        <div className="flex flex-col gap-4">

            {isLoading ? (
                <div className="text-center text-white/50 py-10">Loading...</div>
            ) : treatments.length === 0 ? (
                <div className="text-center text-white/50 py-10 bg-white/5 rounded-3xl">No treatments found. Create one!</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pb-12">
                    {treatments.map(t => (
                        <div key={t.id} className="group bg-[#1C1C1E]/80 backdrop-blur-[60px] border border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.15)] rounded-[40px] overflow-hidden flex flex-col relative transition-all hover:border-white/20 hover:shadow-[0_12px_40px_rgba(0,0,0,0.25)] p-6">
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-white/50 bg-white/5 px-3 py-1.5 rounded-full">{t.category}</span>
                                    <h3 className="text-white font-serif text-xl mt-3">{t.title.toUpperCase()}</h3>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => handleEdit(t)} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-colors"><Edit2 size={16} /></button>
                                    <button onClick={() => handleDelete(t.id)} className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center text-red-400 hover:text-red-300 hover:bg-red-500/20 transition-colors"><Trash2 size={16} /></button>
                                </div>
                            </div>
                            <p className="text-sm text-white/60 line-clamp-2 leading-relaxed flex-1">{t.desc}</p>

                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
