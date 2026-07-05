const fs = require('fs');
let content = fs.readFileSync('src/app/rituals/[id]/page.tsx', 'utf8');

// 1. Update CONTINUE TO DETAILS -> CONTINUE TO DATE & TIME
content = content.replace('CONTINUE TO DETAILS', 'CONTINUE TO DATE & TIME <ArrowRight className="w-4 h-4" />');

// 2. Replace steps 2,3,4 with 2,3,4,5
const newSteps = `                            {bookingStep === 2 && (
                                <div className="animate-in fade-in slide-in-from-right-4 duration-300 h-full flex flex-col">
                                    <div className="flex items-center gap-4 mb-6 shrink-0">
                                        <button onClick={() => setBookingStep(1)} className="w-8 h-8 rounded-full bg-surface flex items-center justify-center hover:bg-border transition-colors shrink-0">
                                            <ChevronLeft className="w-4 h-4" />
                                        </button>
                                        <h2 className="font-serif text-2xl text-primary">When would you like this?</h2>
                                    </div>
                                    <p className="text-xs text-text-muted mb-6 shrink-0">Select the date and time for your booking.</p>
                                    
                                    <div className="flex flex-col space-y-5 flex-1">
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-primary/80 ml-1">Date</label>
                                            <input 
                                                type="date" required 
                                                value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})}
                                                className="w-full bg-surface border border-border/50 rounded-xl px-4 py-4 text-sm text-primary placeholder:text-text-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-primary/80 ml-1">Time</label>
                                            <input 
                                                type="time" required 
                                                value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})}
                                                className="w-full bg-surface border border-border/50 rounded-xl px-4 py-4 text-sm text-primary placeholder:text-text-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                            />
                                        </div>
                                    </div>

                                    <div className="mt-8 pt-6 border-t border-border/50">
                                        <button 
                                            type="button"
                                            onClick={() => setBookingStep(3)}
                                            disabled={!formData.date || !formData.time}
                                            className="w-full bg-primary text-white px-6 py-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-primary/90 hover:scale-[1.02] transition-all duration-300 shadow-[0_8px_24px_rgb(0,0,0,0.15)] uppercase tracking-widest disabled:opacity-70"
                                        >
                                            CONTINUE TO AREA <ArrowRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            )}

                            {bookingStep === 3 && (
                                <div className="animate-in fade-in slide-in-from-right-4 duration-300 h-full flex flex-col">
                                    <div className="flex items-center gap-4 mb-6 shrink-0">
                                        <button onClick={() => setBookingStep(2)} className="w-8 h-8 rounded-full bg-surface flex items-center justify-center hover:bg-border transition-colors shrink-0">
                                            <ChevronLeft className="w-4 h-4" />
                                        </button>
                                        <h2 className="font-serif text-2xl text-primary">Where are you staying?</h2>
                                    </div>
                                    <p className="text-xs text-text-muted mb-6 shrink-0">Select your area in Bali so we can match you with nearby therapists.</p>
                                    <div className="space-y-3 overflow-y-auto pb-8">
                                        {LOCATIONS.map(loc => (
                                            <button
                                                key={loc}
                                                onClick={() => { 
                                                    setSelectedArea(loc); 
                                                    if (selectedTherapist) setBookingStep(5);
                                                    else setBookingStep(4); 
                                                }}
                                                className={\`w-full p-4 rounded-xl border text-left flex justify-between items-center transition-all \${selectedArea === loc ? 'border-primary bg-primary/5' : 'border-border/50 hover:border-primary/30'}\`}
                                            >
                                                <span className="font-bold text-primary">{loc}</span>
                                                <ArrowRight className="w-4 h-4 text-text-muted" />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {bookingStep === 4 && (
                                <div className="animate-in fade-in slide-in-from-right-4 duration-300 h-full flex flex-col">
                                    <div className="flex items-center gap-4 mb-6 shrink-0">
                                        <button onClick={() => setBookingStep(3)} className="w-8 h-8 rounded-full bg-surface flex items-center justify-center hover:bg-border transition-colors shrink-0">
                                            <ChevronLeft className="w-4 h-4" />
                                        </button>
                                        <h2 className="font-serif text-2xl text-primary">Choose Therapist</h2>
                                    </div>
                                    <p className="text-xs text-text-muted mb-4 shrink-0">Therapists available in {selectedArea} for {formData.date} at {formData.time}. You can also skip this step.</p>
                                    <div className="space-y-3 overflow-y-auto pb-8 pr-1 no-scrollbar">
                                        <button
                                            onClick={() => { setSelectedTherapist(''); setBookingStep(5); }}
                                            className={\`w-full p-4 rounded-xl border text-left flex justify-between items-center transition-all \${!selectedTherapist ? 'border-primary bg-primary/5 shadow-sm' : 'border-border/50 hover:border-primary/30 bg-surface'}\`}
                                        >
                                            <span className="font-bold text-primary text-sm tracking-wide">Any Available Therapist</span>
                                            <ArrowRight className="w-4 h-4 text-text-muted" />
                                        </button>
                                        {MOCK_THERAPISTS.filter(t => t.location === selectedArea).map(t => (
                                            <button
                                                key={t.id}
                                                onClick={() => { setSelectedTherapist(t.id); setBookingStep(5); }}
                                                className={\`w-full p-4 rounded-xl border text-left flex gap-4 transition-all \${selectedTherapist === t.id ? 'border-primary bg-primary/5 shadow-sm' : 'border-border/50 hover:border-primary/30 bg-surface'}\`}
                                            >
                                                <img src={t.avatar} alt={t.name} className="w-14 h-14 rounded-full object-cover shrink-0 border border-border" />
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center justify-between mb-1">
                                                        <div className="flex items-center gap-2">
                                                            <h4 className="font-bold text-primary truncate">{t.name}</h4>
                                                            {t.status === 'Online' && <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span>}
                                                            {t.status === 'Busy' && <span className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.6)]"></span>}
                                                            {t.status === 'Off' && <span className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]"></span>}
                                                        </div>
                                                        <div className="flex items-center gap-1 text-[10px] font-bold bg-amber-50 text-amber-600 px-1.5 py-0.5 rounded">
                                                            ★ {t.rating}
                                                        </div>
                                                    </div>
                                                    <p className="text-[10px] text-text-muted leading-relaxed line-clamp-1 mb-2">{t.desc}</p>
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        {t.status === 'Off' ? (
                                                            <span className="text-[10px] font-bold text-red-500/80 bg-red-50 px-2 py-1 rounded">Offline</span>
                                                        ) : t.status === 'Busy' ? (
                                                            <span className="text-[10px] font-bold text-amber-600/80 bg-amber-50 px-2 py-1 rounded">Still handle customer</span>
                                                        ) : (
                                                            t.availability?.today?.slice(0,3).map(time => (
                                                                <span key={time} className="text-[9px] font-bold text-primary bg-primary/5 px-2 py-1 rounded-full border border-primary/10">
                                                                    {time}
                                                                </span>
                                                            ))
                                                        )}
                                                    </div>
                                                </div>
                                            </button>
                                        ))}
                                        {MOCK_THERAPISTS.filter(t => t.location === selectedArea).length === 0 && (
                                            <div className="p-6 text-center text-sm text-text-muted border border-dashed border-border/50 rounded-xl bg-surface/50">
                                                No specific therapists found for {selectedArea}. We will assign the best available therapist for you.
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {bookingStep === 5 && (
                                <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                                    <div className="flex items-center gap-4 mb-6">
                                        <button onClick={() => {
                                            if (selectedTherapist) {
                                                setBookingStep(3);
                                            } else {
                                                setBookingStep(4);
                                            }
                                        }} className="w-8 h-8 rounded-full bg-surface flex items-center justify-center hover:bg-border transition-colors shrink-0">
                                            <ChevronLeft className="w-4 h-4" />
                                        </button>
                                        <h2 className="font-serif text-2xl text-primary">Final Details</h2>
                                    </div>

                                    {/* SUMMARY CARD */}
                                    {cartItems.length > 0 && (
                                    <div className="bg-surface border border-border/50 rounded-xl p-4 mb-6 shadow-sm">
                                        <h4 className="text-[10px] font-bold text-primary/60 uppercase tracking-widest mb-3">Booking Summary</h4>
                                        <div className="space-y-3 mb-4">
                                            {cartItems.map((item, idx) => (
                                                <div key={idx} className="flex justify-between items-start">
                                                    <div>
                                                        <p className="text-sm font-bold text-primary">{item.title}</p>
                                                        <p className="text-xs text-text-muted">{item.duration} Mins • {item.guests} Guest(s)</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        {selectedTherapist && (
                                            <div className="border-t border-border/50 pt-4 flex gap-3 items-center">
                                                <img 
                                                    src={MOCK_THERAPISTS.find(t => t.id === selectedTherapist)?.avatar} 
                                                    className="w-10 h-10 rounded-full object-cover border border-border"
                                                    alt="Therapist"
                                                />
                                                <div>
                                                    <p className="text-[10px] font-bold text-primary/60 uppercase tracking-widest">Selected Therapist</p>
                                                    <p className="text-sm font-bold text-primary flex items-center gap-2">
                                                        {MOCK_THERAPISTS.find(t => t.id === selectedTherapist)?.name}
                                                        <span className="text-[10px] bg-amber-50 text-amber-600 px-1.5 py-0.5 rounded">★ {MOCK_THERAPISTS.find(t => t.id === selectedTherapist)?.rating}</span>
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    )}

                                    <form className="space-y-5 pb-8 md:pb-0">
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-primary/80 ml-1">Guest Name</label>
                                            <input 
                                                type="text" required placeholder="John Doe"
                                                value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                                                className="w-full bg-surface border border-border/50 rounded-xl px-4 py-3.5 text-sm text-primary placeholder:text-text-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-primary/80 ml-1">Address / Villa Name</label>
                                            <input 
                                                type="text" required placeholder={\`e.g. Four Seasons Sayan (\${selectedArea})\`}
                                                value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})}
                                                className="w-full bg-surface border border-border/50 rounded-xl px-4 py-3.5 text-sm text-primary placeholder:text-text-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-primary/80 ml-1">Room Number (Optional)</label>
                                            <input 
                                                type="text" placeholder="e.g. Villa 12"
                                                value={formData.room} onChange={e => setFormData({...formData, room: e.target.value})}
                                                className="w-full bg-surface border border-border/50 rounded-xl px-4 py-3.5 text-sm text-primary placeholder:text-text-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                            />
                                        </div>

                                        <div className="mt-8 pt-6 border-t border-border/50">
                                            <div className="flex items-end justify-between mb-6">
                                                <span className="text-xs font-bold text-text-muted uppercase tracking-widest">Total Price</span>
                                                <span className="text-2xl font-serif text-primary">IDR {formattedTotalPrice}</span>
                                            </div>
                                            <div className="flex flex-col gap-3">
                                                <button 
                                                    type="button"
                                                    onClick={(e) => handleBooking(e)}
                                                    disabled={isProcessing}
                                                    className="w-full bg-primary text-white px-6 py-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-primary/90 hover:scale-[1.02] transition-all duration-300 shadow-[0_8px_24px_rgb(0,0,0,0.15)] uppercase tracking-widest disabled:opacity-70"
                                                >
                                                    {isProcessing ? 'PROCESSING...' : 'CONFIRM ON WHATSAPP'}
                                                </button>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            )}`;

const startIndex = content.indexOf('{bookingStep === 2 && (');
const endIndex = content.indexOf('</>', startIndex);

content = content.substring(0, startIndex) + newSteps + '\n                            ' + content.substring(endIndex);

fs.writeFileSync('src/app/rituals/[id]/page.tsx', content);
