'use client';

import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Plus, Trash2, Save } from 'lucide-react';
import { Treatment } from '@/context/SpaContext';

interface PartnerTreatmentFormProps {
    partnerId: string;
    treatmentToEdit?: Treatment;
    onSaveSuccess: () => void;
    onCancel: () => void;
}

export default function PartnerTreatmentForm({ partnerId, treatmentToEdit, onSaveSuccess, onCancel }: PartnerTreatmentFormProps) {
    const [title, setTitle] = useState(treatmentToEdit?.title || '');
    const [category, setCategory] = useState(treatmentToEdit?.category || 'Massage');
    const [desc, setDesc] = useState(treatmentToEdit?.desc || '');
    
    // Dynamic Pricing
    const [pricingOptions, setPricingOptions] = useState(
        treatmentToEdit?.options.map(o => ({ duration: o.duration.replace(/\D/g, ''), price: o.price })) || [{ duration: '60', price: '' }]
    );
    
    // Dynamic Benefits
    const [benefits, setBenefits] = useState<string[]>(
        treatmentToEdit?.benefits && treatmentToEdit.benefits.length > 0 ? treatmentToEdit.benefits : ['']
    );

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleAddPricing = () => setPricingOptions([...pricingOptions, { duration: '', price: '' }]);
    const handleRemovePricing = (index: number) => {
        if (pricingOptions.length > 1) {
            setPricingOptions(pricingOptions.filter((_, i) => i !== index));
        }
    };
    const handlePricingChange = (index: number, field: 'duration' | 'price', value: string) => {
        const newOptions = [...pricingOptions];
        newOptions[index][field] = value;
        setPricingOptions(newOptions);
    };

    const handleAddBenefit = () => setBenefits([...benefits, '']);
    const handleRemoveBenefit = (index: number) => {
        if (benefits.length > 1) {
            setBenefits(benefits.filter((_, i) => i !== index));
        }
    };
    const handleBenefitChange = (index: number, value: string) => {
        const newBenefits = [...benefits];
        newBenefits[index] = value;
        setBenefits(newBenefits);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        try {
            const treatmentData = {
                title,
                category,
                desc,
                benefits: benefits.filter(b => b.trim() !== ''),
                bgPattern: treatmentToEdit?.bgPattern || 'from-secondary/10 via-white to-white',
                options: pricingOptions.map(o => ({ duration: `${o.duration} Min`, price: o.price })),
                is_published: treatmentToEdit?.is_published ?? true,
                therapist_id: partnerId
            };
            
            if (treatmentToEdit?.id) {
                await supabase.from('treatments').update(treatmentData).eq('id', treatmentToEdit.id);
            } else {
                await supabase.from('treatments').insert([treatmentData]);
            }
            onSaveSuccess();
        } catch (error) {
            console.error("Error saving treatment:", error);
            alert("Failed to save treatment.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8 bg-[#1C1C1E]/80 backdrop-blur-[60px] border border-white/[0.08] rounded-[32px] p-6 shadow-[0_8px_32px_rgba(0,0,0,0.37)]">
            <div className="flex justify-between items-center mb-6">
                <h2 className="font-serif text-2xl text-white font-medium">{treatmentToEdit ? 'Edit Treatment' : 'Create New Treatment'}</h2>
                <button type="button" onClick={onCancel} className="text-white/50 hover:text-white">Cancel</button>
            </div>
            
            {/* Title & Category */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-white/90-muted ml-1">Treatment Title</label>
                    <input 
                        type="text" required placeholder="e.g. Deep Tissue Flow" 
                        value={title} onChange={e => setTitle(e.target.value)}
                        className="w-full bg-[#2C2C2E]/80 border border-transparent rounded-2xl px-5 py-4 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all appearance-none"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-white/90-muted ml-1">Category</label>
                    <select 
                        value={category} onChange={e => setCategory(e.target.value)}
                        className="w-full bg-[#2C2C2E]/80 border border-transparent rounded-2xl px-5 py-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all appearance-none [&>option]:text-black"
                    >
                        <option value="Massage">Massage</option>
                        <option value="Facial">Facial</option>
                        <option value="Package">Package</option>
                        <option value="Ritual">Ritual</option>
                    </select>
                </div>
            </div>

            {/* Dynamic Duration & Pricing */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <label className="text-xs font-bold uppercase tracking-widest text-white/90-muted ml-1">Duration & Pricing</label>
                    <button type="button" onClick={handleAddPricing} className="text-xs font-bold text-white flex items-center gap-1 hover:opacity-70 transition-opacity">
                        <Plus size={14} /> Add Option
                    </button>
                </div>
                {pricingOptions.map((option, idx) => (
                    <div key={idx} className="flex flex-col md:flex-row items-center gap-4 bg-[#2C2C2E]/30 p-4 rounded-2xl border border-white/5 relative">
                        <div className="w-full md:flex-1 relative">
                            <select 
                                required value={option.duration} onChange={(e) => handlePricingChange(idx, 'duration', e.target.value)}
                                className="w-full bg-[#2C2C2E] border border-transparent rounded-2xl px-5 py-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all appearance-none [&>option]:text-black"
                            >
                                <option value="" disabled>Duration</option>
                                <option value="30">30 Mins</option>
                                <option value="45">45 Mins</option>
                                <option value="60">60 Mins</option>
                                <option value="90">90 Mins</option>
                                <option value="120">120 Mins</option>
                            </select>
                        </div>
                        <div className="w-full md:flex-[2] relative">
                            <span className="absolute left-5 top-1/2 -translate-y-1/2 text-sm font-semibold text-white/90-muted">AED</span>
                            <input 
                                type="text" required placeholder="450" value={option.price} onChange={(e) => handlePricingChange(idx, 'price', e.target.value)}
                                className="w-full bg-[#2C2C2E] border border-transparent rounded-2xl px-14 py-4 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all appearance-none"
                            />
                        </div>
                        {pricingOptions.length > 1 && (
                            <button type="button" onClick={() => handleRemovePricing(idx)} className="md:static absolute -top-3 -right-3 w-8 h-8 md:w-12 md:h-12 rounded-full bg-red-500/90 md:bg-red-500/10 text-white md:text-red-400 flex items-center justify-center shrink-0 hover:bg-red-500 hover:text-white transition-colors shadow-lg md:shadow-none z-10">
                                <Trash2 size={14} />
                            </button>
                        )}
                    </div>
                ))}
            </div>

            {/* Description */}
            <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-white/90-muted ml-1">Description</label>
                <textarea 
                    required rows={3} placeholder="Write a captivating description about the treatment..." 
                    value={desc} onChange={e => setDesc(e.target.value)}
                    className="w-full bg-[#2C2C2E]/80 border border-transparent rounded-2xl px-5 py-4 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all appearance-none resize-none"
                />
            </div>

            {/* Dynamic Benefits */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <label className="text-xs font-bold uppercase tracking-widest text-white/90-muted ml-1">Key Benefits</label>
                    <button type="button" onClick={handleAddBenefit} className="text-xs font-bold text-white flex items-center gap-1 hover:opacity-70 transition-opacity">
                        <Plus size={14} /> Add Benefit
                    </button>
                </div>
                {benefits.map((benefit, idx) => (
                    <div key={idx} className="flex items-center gap-4">
                        <input 
                            type="text" required placeholder="e.g. Relieves muscle tension" 
                            value={benefit} onChange={(e) => handleBenefitChange(idx, e.target.value)}
                            className="flex-1 bg-[#2C2C2E]/80 border border-transparent rounded-2xl px-5 py-4 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all appearance-none"
                        />
                        {benefits.length > 1 && (
                            <button type="button" onClick={() => handleRemoveBenefit(idx)} className="w-12 h-12 rounded-full bg-red-500/10 text-red-400 flex items-center justify-center shrink-0 hover:bg-red-500/20 transition-colors">
                                <Trash2 size={16} />
                            </button>
                        )}
                    </div>
                ))}
            </div>

            <button type="submit" disabled={isSubmitting} className="w-full bg-[#0A84FF] text-white rounded-full py-4 font-semibold text-[17px] tracking-wide shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2">
                <Save className="w-5 h-5" /> {isSubmitting ? 'Saving...' : 'Save Treatment'}
            </button>
        </form>
    );
}
