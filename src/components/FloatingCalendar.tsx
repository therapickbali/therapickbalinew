import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface FloatingCalendarProps {
    value: string;
    onChange: (date: string) => void;
}

export default function FloatingCalendar({ value, onChange }: FloatingCalendarProps) {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDateObj, setSelectedDateObj] = useState<Date | null>(value ? new Date(value) : null);
    const [isSelectingMonth, setIsSelectingMonth] = useState(false);

    useEffect(() => {
        if (value) {
            setSelectedDateObj(new Date(value));
        }
    }, [value]);

    const getDaysInMonth = (year: number, month: number) => {
        return new Date(year, month + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (year: number, month: number) => {
        return new Date(year, month, 1).getDay();
    };

    const handlePrevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const handleDateSelect = (day: number) => {
        const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        setSelectedDateObj(newDate);
        
        // Format as YYYY-MM-DD
        const year = newDate.getFullYear();
        const month = String(newDate.getMonth() + 1).padStart(2, '0');
        const dateStr = String(newDate.getDate()).padStart(2, '0');
        onChange(`${year}-${month}-${dateStr}`);
    };

    const renderGrid = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const daysInMonth = getDaysInMonth(year, month);
        const firstDay = getFirstDayOfMonth(year, month);
        
        const days = [];
        const weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

        // Weekday headers
        weekDays.forEach(day => {
            days.push(
                <div key={day} className="text-center text-[10px] font-bold text-text-muted/60 uppercase tracking-widest pb-2">
                    {day}
                </div>
            );
        });

        // Empty cells before first day
        for (let i = 0; i < firstDay; i++) {
            days.push(<div key={`empty-${i}`} className="h-10" />);
        }

        // Days
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        for (let i = 1; i <= daysInMonth; i++) {
            const thisDate = new Date(year, month, i);
            thisDate.setHours(0, 0, 0, 0);
            
            const isPast = thisDate < today;
            const isSelected = selectedDateObj && 
                selectedDateObj.getDate() === i && 
                selectedDateObj.getMonth() === month && 
                selectedDateObj.getFullYear() === year;
                
            const isToday = thisDate.getTime() === today.getTime();

            days.push(
                <button
                    key={i}
                    disabled={isPast}
                    onClick={() => handleDateSelect(i)}
                    className={`
                        h-10 w-full rounded-xl flex items-center justify-center text-sm font-medium transition-all duration-300 relative
                        ${isPast ? 'text-border/40 cursor-not-allowed' : 'hover:bg-primary/5 cursor-pointer'}
                        ${isSelected ? 'bg-primary text-white shadow-[0_4px_12px_rgba(0,0,0,0.2)] hover:bg-primary' : 'text-primary'}
                        ${isToday && !isSelected ? 'border border-primary/20 bg-primary/5' : ''}
                    `}
                >
                    <span className="relative z-10">{i}</span>
                </button>
            );
        }

        return days;
    };

    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    return (
        <div className="bg-white/10 backdrop-blur-[40px] border border-white/40 shadow-[0_8px_32px_0_rgba(0,0,0,0.1),inset_0_1px_1px_rgba(255,255,255,1)] rounded-2xl p-4 relative overflow-hidden w-full">
            {/* Background Accent */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
            
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <button 
                    type="button"
                    onClick={handlePrevMonth}
                    className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-[40px] border border-white/40 shadow-[0_8px_32px_0_rgba(0,0,0,0.1),inset_0_1px_1px_rgba(255,255,255,1)] flex items-center justify-center text-primary hover:bg-surface transition-colors shadow-sm"
                >
                    <ChevronLeft className="w-4 h-4" />
                </button>
                
                <div 
                    className="font-serif text-lg text-primary cursor-pointer hover:opacity-70 transition-opacity"
                    onClick={() => setIsSelectingMonth(!isSelectingMonth)}
                >
                    {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </div>
                
                <button 
                    type="button"
                    onClick={handleNextMonth}
                    className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-[40px] border border-white/40 shadow-[0_8px_32px_0_rgba(0,0,0,0.1),inset_0_1px_1px_rgba(255,255,255,1)] flex items-center justify-center text-primary hover:bg-surface transition-colors shadow-sm"
                >
                    <ChevronRight className="w-4 h-4" />
                </button>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-7 gap-1">
                {renderGrid()}
            </div>
        </div>
    );
}
