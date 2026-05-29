
import React, { useState } from 'react';
import { WHATSAPP_NUMBER, SERVICES } from '../constants';
import { ArrowRight, Star } from 'lucide-react';
import LocationAutocomplete from '../components/LocationAutocomplete';

const Contact: React.FC = () => {
    const [name, setName] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [location, setLocation] = useState('');
    const [roomNumber, setRoomNumber] = useState('');
    const [primaryService, setPrimaryService] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // SEO Optimized Booking Inquiry
        const roomInfo = roomNumber ? `\n🚪 Room/Villa No: ${roomNumber}` : '';
        const text = `*ELEXOIR BALI • BOOKING INQUIRY*
──────────────────────
Hello Elexoir Concierge, 
I would like to request a professional home spa appointment.

*GUEST PREFERENCE*
👤 Name: ${name}
✨ Ritual: ${primaryService}
🗓 Date: ${date}
⏰ Time: ${time}
📍 Location: ${location}${roomInfo}

──────────────────────
_Please confirm availability for this session._
_Thank you._`;
        window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`, '_blank');
    };

    return (
        <div className="min-h-screen bg-background flex flex-col lg:flex-row pt-20 lg:pt-0">

            {/* Left: Atmospheric Image */}
            <div className="w-full lg:w-1/2 h-[40vh] lg:h-screen relative overflow-hidden bg-stone-100 border-b lg:border-b-0 lg:border-r border-border/50">
                <img
                    src="https://images.pexels.com/photos/6663364/pexels-photo-6663364.jpeg?auto=compress&cs=tinysrgb&w=1600"
                    className="w-full h-full object-cover filter brightness-90 hover:scale-105 transition-transform duration-1000"
                    alt="Spa Atmosphere"
                />
                <div className="absolute inset-0 bg-primary/10 mix-blend-overlay"></div>

                <div className="absolute bottom-16 left-12 bg-surface/95 backdrop-blur-md p-10 max-w-md hidden lg:block z-10 border border-border/80 rounded-2xl shadow-soft">
                    <div className="flex gap-2 mb-6 text-accent">
                        {[...Array(5)].map((_, i) => <Star key={i} size={20} fill="currentColor" strokeWidth={1} />)}
                    </div>
                    <p className="font-serif font-light text-3xl text-primary leading-tight mb-8">
                        "The most exquisite mobile spa experience in Bali."
                    </p>
                    <div className="flex items-center gap-4 text-text-muted">
                        <span className="font-sans font-bold uppercase tracking-[0.2em] text-[11px] text-primary">
                            Verified Client
                        </span>
                    </div>
                </div>
            </div>

            {/* Right: Form */}
            <div className="w-full lg:w-1/2 bg-background flex flex-col justify-center px-6 lg:px-20 py-16 lg:py-0 relative overflow-y-auto">
                <div className="max-w-xl mx-auto w-full relative z-10 py-10">
                    <div className="inline-block text-accent font-sans font-bold uppercase tracking-[0.25em] text-[10px] mb-8">
                        Availability
                    </div>

                    <h1 className="font-serif text-5xl md:text-[80px] font-normal text-primary mb-8 leading-[1] tracking-[-0.02em]">
                        Reserve <br />
                        <span className="italic text-accent">Time</span>
                    </h1>

                    <p className="text-text-muted font-light text-sm mb-12 leading-relaxed max-w-sm">
                        Please secure your appointment at least 4 hours in advance to ensure our therapists can prepare your sanctuary.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="group">
                            <label className="block text-[9px] font-bold font-sans uppercase tracking-[0.2em] text-accent mb-2.5 group-focus-within:text-primary transition-colors">Guest Name</label>
                            <input
                                type="text"
                                required
                                value={name}
                                onChange={e => setName(e.target.value)}
                                className="w-full bg-surface/50 border border-border/80 px-4 py-3 rounded-lg text-sm text-primary placeholder-text-muted/40 outline-none focus:border-accent focus:bg-background transition-all duration-300"
                                placeholder="Your full name"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-8">
                            <div className="group">
                                <label className="block text-[9px] font-bold font-sans uppercase tracking-[0.2em] text-accent mb-2.5 group-focus-within:text-primary transition-colors">Date</label>
                                <input
                                    type="date"
                                    required
                                    value={date}
                                    onChange={e => setDate(e.target.value)}
                                    className="w-full bg-surface/50 border border-border/80 px-4 py-3 rounded-lg text-sm text-primary placeholder-text-muted/40 outline-none focus:border-accent focus:bg-background transition-all duration-300"
                                />
                            </div>
                            <div className="group">
                                <label className="block text-[9px] font-bold font-sans uppercase tracking-[0.2em] text-accent mb-2.5 group-focus-within:text-primary transition-colors">Time</label>
                                <input
                                    type="time"
                                    required
                                    value={time}
                                    onChange={e => setTime(e.target.value)}
                                    className="w-full bg-surface/50 border border-border/80 px-4 py-3 rounded-lg text-sm text-primary placeholder-text-muted/40 outline-none focus:border-accent focus:bg-background transition-all duration-300"
                                />
                            </div>
                        </div>

                        <div className="group">
                            <label className="block text-[9px] font-bold font-sans uppercase tracking-[0.2em] text-accent mb-2.5 group-focus-within:text-primary transition-colors">Treatment Strategy</label>
                            <select
                                className="w-full bg-surface/50 border border-border/80 px-4 py-3 rounded-lg text-sm text-primary placeholder-text-muted/40 outline-none focus:border-accent focus:bg-background transition-all duration-300 appearance-none cursor-pointer"
                                value={primaryService}
                                onChange={e => setPrimaryService(e.target.value)}
                                required
                            >
                                <option value="" disabled className="text-text-muted">Select your ritual</option>
                                {SERVICES.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                            </select>
                        </div>

                        <div className="group">
                            <label className="block text-[9px] font-bold font-sans uppercase tracking-[0.2em] text-accent mb-2.5 group-focus-within:text-primary transition-colors">Target Location</label>
                            <LocationAutocomplete
                                value={location}
                                onChange={setLocation}
                                className="w-full bg-surface/50 border border-border/80 px-4 py-3 rounded-lg text-sm text-primary placeholder-text-muted/40 outline-none focus:border-accent focus:bg-background transition-all duration-300"
                                placeholder="Villa name or area"
                            />
                        </div>

                        <div className="group">
                            <label className="block text-[9px] font-bold font-sans uppercase tracking-[0.2em] text-accent mb-2.5 flex items-center gap-2 group-focus-within:text-primary transition-colors">Room / Villa No. <span className="text-text-muted/50 font-normal italic">(Optional)</span></label>
                            <input
                                type="text"
                                value={roomNumber}
                                onChange={e => setRoomNumber(e.target.value)}
                                className="w-full bg-surface/50 border border-border/80 px-4 py-3 rounded-lg text-sm text-primary placeholder-text-muted/40 outline-none focus:border-accent focus:bg-background transition-all duration-300"
                                placeholder="e.g. Villa 5"
                            />
                        </div>

                        <button type="submit" className="w-full h-14 bg-primary hover:bg-secondary text-white font-sans font-bold uppercase tracking-[0.22em] text-[10px] rounded-xl hover:shadow-soft transition-all duration-300 flex items-center justify-center gap-2 mt-8 group">
                            <span>Request via WhatsApp</span>
                            <ArrowRight size={15} strokeWidth={2} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Contact;
