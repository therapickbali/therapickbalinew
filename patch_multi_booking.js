const fs = require('fs');

function patchFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');

    // 1. Add import
    if (!content.includes("import FloatingCalendar")) {
        content = content.replace("import { ChevronLeft", "import FloatingCalendar from '@/components/FloatingCalendar';\nimport { ChevronLeft");
    }

    // 2. Change state
    if (content.includes("const [selectedTherapist, setSelectedTherapist] = useState('');")) {
        content = content.replace(
            "const [selectedTherapist, setSelectedTherapist] = useState('');",
            "const [selectedTherapists, setSelectedTherapists] = useState<string[]>([]);\n    const totalGuests = cartItems.reduce((acc, item) => acc + item.guests, 0);"
        );
    }

    // Fix viewingTherapist any typescript if it exists (in page.tsx)
    if (content.includes("const [viewingTherapist, setViewingTherapist] = useState(null);")) {
        content = content.replace(
            "const [viewingTherapist, setViewingTherapist] = useState(null);",
            "const [viewingTherapist, setViewingTherapist] = useState<any>(null);"
        );
    }

    // 3. Update Step 2 (Calendar)
    const oldStep2Date = `<div className="space-y-1.5">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-primary/80 ml-1">Date</label>
                                            <input 
                                                type="date" required 
                                                value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})}
                                                className="w-full bg-surface border border-border/50 rounded-xl px-4 py-4 text-sm text-primary placeholder:text-text-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                            />
                                        </div>`;
    const newStep2Date = `<div className="space-y-3">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-primary/80 ml-1">Select Date</label>
                                            <FloatingCalendar 
                                                value={formData.date}
                                                onChange={(date) => setFormData({...formData, date})}
                                            />
                                        </div>`;
    
    if (content.includes(oldStep2Date)) {
        content = content.replace(oldStep2Date, newStep2Date);
    }

    // 4. Update Area (Step 3) transition
    content = content.replace(/if \(selectedTherapist\) setBookingStep\(5\);/g, "if (selectedTherapists.length > 0) setBookingStep(5);");

    // 5. Update Step 4 (Choose Therapist)
    const oldStep4Header = `<p className="text-xs text-text-muted mb-4 shrink-0">Therapists available in {selectedArea} for {formData.date} at {formData.time}. You can also skip this step.</p>`;
    const newStep4Header = `<p className="text-xs text-text-muted mb-4 shrink-0">Therapists available in {selectedArea}. You need {totalGuests} therapist{totalGuests > 1 ? 's' : ''}. Selected: {selectedTherapists.length}/{totalGuests}</p>`;
    content = content.replace(oldStep4Header, newStep4Header);

    // Any available therapist button
    const oldAnyButton = `<button
                                            onClick={() => { setSelectedTherapist(''); setBookingStep(5); }}
                                            className={\`w-full p-4 rounded-xl border text-left flex justify-between items-center transition-all \${!selectedTherapist ? 'border-primary bg-primary/5 shadow-sm' : 'border-border/50 hover:border-primary/30 bg-surface'}\`}
                                        >
                                            <span className="font-bold text-primary text-sm tracking-wide">Any Available Therapist</span>
                                            <ArrowRight className="w-4 h-4 text-text-muted" />
                                        </button>`;
    
    const newAnyButton = `<button
                                            onClick={() => { setSelectedTherapists([]); setBookingStep(5); }}
                                            className={\`w-full p-4 rounded-xl border text-left flex justify-between items-center transition-all \${selectedTherapists.length === 0 ? 'border-primary bg-primary/5 shadow-sm' : 'border-border/50 hover:border-primary/30 bg-surface'}\`}
                                        >
                                            <span className="font-bold text-primary text-sm tracking-wide">Assign Automatically</span>
                                            <ArrowRight className="w-4 h-4 text-text-muted" />
                                        </button>`;
    content = content.replace(oldAnyButton, newAnyButton);

    // Therapist mapping click logic
    const oldTherapistCardStart = `onClick={() => { setSelectedTherapist(t.id); setBookingStep(5); }}`;
    const newTherapistCardStart = `onClick={() => { 
                                                    if (selectedTherapists.includes(t.id)) {
                                                        setSelectedTherapists(selectedTherapists.filter(id => id !== t.id));
                                                    } else if (selectedTherapists.length < totalGuests) {
                                                        setSelectedTherapists([...selectedTherapists, t.id]);
                                                    }
                                                }}`;
    
    // We need to replace exactly this snippet
    content = content.replace(oldTherapistCardStart, newTherapistCardStart);

    // Selected therapist styling
    content = content.replace(
        /\${selectedTherapist === t.id \? 'border-primary bg-primary\/5 shadow-sm' : 'border-border\/50 hover:border-primary\/30 bg-surface'}/g,
        "${selectedTherapists.includes(t.id) ? 'border-primary bg-primary/5 shadow-sm' : (selectedTherapists.length >= totalGuests && !selectedTherapists.includes(t.id) ? 'border-border/50 opacity-50 cursor-not-allowed bg-surface' : 'border-border/50 hover:border-primary/30 bg-surface')}"
    );

    // Add continue button to step 4
    if (!content.includes('CONTINUE TO FINAL DETAILS')) {
        const step4End = `No specific therapists found for {selectedArea}. We will assign the best available therapist for you.
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}`;
        const step4EndNew = `No specific therapists found for {selectedArea}. We will assign the best available therapist for you.
                                            </div>
                                        )}
                                    </div>
                                    <div className="mt-4 pt-4 border-t border-border/50">
                                        <button 
                                            type="button"
                                            onClick={() => setBookingStep(5)}
                                            className="w-full bg-primary text-white px-6 py-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-all uppercase tracking-widest"
                                        >
                                            CONTINUE TO FINAL DETAILS <ArrowRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            )}`;
        content = content.replace(step4End, step4EndNew);
    }


    // 6. Update Step 5
    content = content.replace(/if \(selectedTherapist\) {/g, "if (selectedTherapists.length > 0) {");
    
    const oldSummarySelected = `{selectedTherapist && (
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
                                        )}`;
    
    const newSummarySelected = `{selectedTherapists.length > 0 && (
                                            <div className="border-t border-border/50 pt-4">
                                                <p className="text-[10px] font-bold text-primary/60 uppercase tracking-widest mb-3">Selected Therapist{selectedTherapists.length > 1 ? 's' : ''}</p>
                                                <div className="space-y-3">
                                                    {selectedTherapists.map((tid, i) => {
                                                        const t = MOCK_THERAPISTS.find(th => th.id === tid);
                                                        if (!t) return null;
                                                        return (
                                                            <div key={i} className="flex gap-3 items-center">
                                                                <img 
                                                                    src={t.avatar} 
                                                                    className="w-10 h-10 rounded-full object-cover border border-border"
                                                                    alt={t.name}
                                                                />
                                                                <div>
                                                                    <p className="text-sm font-bold text-primary flex items-center gap-2">
                                                                        {t.name}
                                                                        <span className="text-[10px] bg-amber-50 text-amber-600 px-1.5 py-0.5 rounded">★ {t.rating}</span>
                                                                    </p>
                                                                    <p className="text-[10px] text-text-muted">{t.desc.substring(0, 40)}...</p>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        )}`;
    
    content = content.replace(oldSummarySelected, newSummarySelected);

    // Small issue in page.tsx: "selectedTherapist === t.id" at the beginning for recommended therapists (in the main page)
    content = content.replace(
        /selectedTherapist === t.id \? 'bg-gradient-to-tr from-primary via-highlight to-primary/g, 
        "selectedTherapists.includes(t.id) ? 'bg-gradient-to-tr from-primary via-highlight to-primary"
    );
    content = content.replace(
        /selectedTherapist === t.id \? 'text-primary font-bold' : 'text-text-muted font-medium'/g,
        "selectedTherapists.includes(t.id) ? 'text-primary font-bold' : 'text-text-muted font-medium'"
    );

    // Also update `onClick={() => { setSelectedTherapist(t.id); setIsBookingModalOpen(true); }}` at top of page
    content = content.replace(
        /onClick=\{\(\) => \{ setSelectedTherapist\(t\.id\); setIsBookingModalOpen\(true\); \}\}/g,
        "onClick={() => { setSelectedTherapists([t.id]); setIsBookingModalOpen(true); }}"
    );

    fs.writeFileSync(filePath, content);
    console.log("Patched " + filePath);
}

patchFile('src/app/page.tsx');
patchFile('src/app/rituals/[id]/page.tsx');
