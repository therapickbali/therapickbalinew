import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface FloatingCalendarProps {
    value: string;
    onChange: (date: string) => void;
    currentTime?: string;
}

export default function FloatingCalendar({ value, onChange, currentTime }: FloatingCalendarProps) {
    const [selectedDateObj, setSelectedDateObj] = useState<Date | null>(value ? new Date(value) : null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (value) {
            setSelectedDateObj(new Date(value));
        } else {
            // Select today by default if no value
            handleDateSelect(new Date());
        }
    }, [value]);

    const handleDateSelect = (date: Date) => {
        setSelectedDateObj(date);
        
        // Format as YYYY-MM-DD
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const dateStr = String(date.getDate()).padStart(2, '0');
        onChange(`${year}-${month}-${dateStr}`);
    };

    // Generate next 7 days
    const next7Days = Array.from({ length: 7 }).map((_, i) => {
        const d = new Date();
        d.setDate(d.getDate() + i);
        return d;
    });

    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    return (
        <div className="w-full relative">
            <div 
                ref={scrollContainerRef}
                className="flex overflow-x-auto gap-3 no-scrollbar snap-x snap-mandatory pb-2 px-1"
            >
                {next7Days.map((date, i) => {
                    const isSelected = selectedDateObj && 
                        selectedDateObj.getDate() === date.getDate() && 
                        selectedDateObj.getMonth() === date.getMonth() && 
                        selectedDateObj.getFullYear() === date.getFullYear();
                        
                    const isToday = i === 0;

                    return (
                        <button
                            key={i}
                            onClick={() => handleDateSelect(date)}
                            className={`
                                shrink-0 snap-center w-[72px] h-[90px] rounded-2xl flex flex-col items-center justify-center transition-all duration-300 relative border
                                ${isSelected 
                                    ? 'bg-white/20 border-white/50 text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.8),0_8px_16px_rgba(0,0,0,0.4)] scale-105' 
                                    : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:border-white/20'
                                }
                            `}
                        >
                            <span className={`text-[10px] font-bold uppercase tracking-widest mb-2 ${isSelected ? 'text-white' : 'text-white/50'}`}>
                                {isToday ? 'Today' : weekDays[date.getDay()]}
                            </span>
                            <span className={`text-2xl font-serif leading-none mb-1 ${isSelected ? 'text-white font-medium' : 'text-white/90'}`}>
                                {date.getDate()}
                            </span>
                            <span className={`text-[9px] font-medium tracking-wider uppercase ${isSelected ? 'text-white/90' : 'text-white/40'}`}>
                                {monthNames[date.getMonth()]}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
