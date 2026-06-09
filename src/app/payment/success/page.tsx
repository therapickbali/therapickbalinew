'use client';

import React from 'react';
import Link from 'next/link';
import { CheckCircle2, Home } from 'lucide-react';

export default function PaymentSuccessPage() {
    return (
        <div className="min-h-screen bg-[#FDFBF7] flex flex-col items-center justify-center p-6 font-sans">
            <div className="bg-white rounded-[40px] p-10 md:p-16 text-center max-w-lg w-full shadow-[0_20px_40px_rgb(0,0,0,0.08)] border border-border/50">
                <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center text-green-500 mx-auto mb-8 border border-green-100 shadow-inner">
                    <CheckCircle2 size={48} strokeWidth={2} />
                </div>
                <h1 className="font-serif text-3xl md:text-4xl text-primary font-medium mb-4 tracking-tight">Payment Successful</h1>
                <p className="text-text-muted text-sm md:text-base leading-relaxed mb-10">
                    Thank you for your purchase. We have received your payment and your order is now being processed. You will receive an email or WhatsApp confirmation shortly.
                </p>
                
                <Link href="/" className="inline-flex items-center justify-center gap-3 w-full bg-primary text-white py-4 rounded-2xl font-bold text-sm hover:bg-primary/90 transition-all shadow-[0_8px_24px_rgb(0,0,0,0.15)] hover:scale-[1.02] uppercase tracking-widest">
                    <Home size={18} /> Return Home
                </Link>
            </div>
        </div>
    );
}
