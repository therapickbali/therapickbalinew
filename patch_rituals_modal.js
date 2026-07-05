const fs = require('fs');
let content = fs.readFileSync('src/app/rituals/[id]/page.tsx', 'utf8');

if (!content.includes('const [viewingTherapist, setViewingTherapist] = useState<any>(null);')) {
    content = content.replace('const [selectedTherapist, setSelectedTherapist] = useState(\'\');', 'const [selectedTherapist, setSelectedTherapist] = useState(\'\');\n    const [viewingTherapist, setViewingTherapist] = useState<any>(null);');
}

const modalCode = `
            {/* Therapist Details Modal */}
            <AnimatePresence>
                {viewingTherapist && (
                    <motion.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4"
                        onClick={() => setViewingTherapist(null)}
                    >
                        <motion.div 
                            initial={{ y: '100%' }} 
                            animate={{ y: 0 }} 
                            exit={{ y: '100%' }} 
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="w-full sm:max-w-md bg-[#FDFBF7] rounded-t-[32px] sm:rounded-[32px] overflow-hidden shadow-2xl relative max-h-[90vh] flex flex-col"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Header Image */}
                            <div className="relative h-64 shrink-0">
                                <img src={viewingTherapist.avatar} alt={viewingTherapist.name} className="w-full h-full object-cover object-top" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                                <button onClick={() => setViewingTherapist(null)} className="absolute top-4 right-4 w-8 h-8 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white">
                                    <X className="w-5 h-5" />
                                </button>
                                <div className="absolute bottom-4 left-6 right-6 flex justify-between items-end">
                                    <div>
                                        <h2 className="text-3xl font-serif text-white font-medium">{viewingTherapist.name}</h2>
                                        <p className="text-white/80 text-sm tracking-wide mt-1">{viewingTherapist.location}</p>
                                    </div>
                                    <div className="flex items-center gap-1 text-xs font-bold bg-white/20 backdrop-blur-md text-white px-2.5 py-1 rounded-full border border-white/20">
                                        ★ {viewingTherapist.rating}
                                    </div>
                                </div>
                            </div>

                            {/* Scrollable Content */}
                            <div className="overflow-y-auto no-scrollbar flex-1 pb-24">
                                {/* Bio & Reviews */}
                                <div className="px-6 py-6 border-b border-border/40">
                                    <h4 className="text-[10px] font-bold text-primary/60 uppercase tracking-widest mb-3">About</h4>
                                    <p className="text-sm text-text-muted leading-relaxed mb-6">{viewingTherapist.desc}</p>
                                    
                                    {viewingTherapist.reviews && viewingTherapist.reviews.length > 0 && (
                                        <div className="bg-primary/5 rounded-2xl p-5 relative">
                                            <div className="text-primary/20 absolute top-4 left-4 font-serif text-4xl leading-none">"</div>
                                            <p className="text-primary/90 text-sm font-medium italic relative z-10 pl-6 leading-relaxed">
                                                {viewingTherapist.reviews[0].text}
                                            </p>
                                            <p className="text-xs text-primary/60 font-bold tracking-wide mt-3 pl-6">— {viewingTherapist.reviews[0].author}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};`;

if (!content.includes(' Therapist Details Modal ')) {
    content = content.replace('        </div>\n    );\n', modalCode);
}

fs.writeFileSync('src/app/rituals/[id]/page.tsx', content);
