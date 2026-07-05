import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Loader2, ExternalLink } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

// Global Type for Google Maps
declare global {
  interface Window {
    google: any;
  }
}

// SIMULATED DETAILED DATABASE (Fallback when API Key is missing)
const BALI_LOCATIONS_FALLBACK = [
  // Seminyak
  "W Bali - Seminyak", "Potato Head Suites & Studios", "Alila Seminyak", "The Seminyak Beach Resort & Spa", 
  "Hotel Indigo Bali Seminyak Beach", "Double-Six Luxury Hotel", "Courtyard by Marriott Bali Seminyak Resort",
  "Peppers Seminyak", "The Trans Resort Bali", "Mrs Sippy Bali", "Ku De Ta", "La Favela",
  "Villa Kresna Boutique Suites", "Impiana Private Villas Seminyak", "The Oberoi Beach Resort, Bali",
  
  // Canggu
  "COMO Uma Canggu", "The Slow", "Hotel Tugu Bali", "Aston Canggu Beach Resort", "Eastin Ashta Resort Canggu",
  "The Lawn Canggu", "Finns Beach Club", "La Brisa Bali", "Echo Beach", "Batu Bolong Beach",
  "Shore Amora Canggu", "Plataran Canggu Bali Resort", "Desa Seni", "Udara Bali Yoga Detox & Spa",
  
  // Ubud
  "The Kayon Jungle Resort", "Hanging Gardens of Bali", "Four Seasons Resort Bali at Sayan", "Mandapa, a Ritz-Carlton Reserve",
  "Maya Ubud Resort & Spa", "Padma Resort Ubud", "Alaya Resort Ubud", "Komaneka at Bisma",
  "The Royal Pita Maha", "Viceroy Bali", "Capella Ubud", "COMO Shambhala Estate",
  "Monkey Forest Ubud", "Tegalalang Rice Terrace", "Campuhan Ridge Walk",

  // Nusa Dua
  "The St. Regis Bali Resort", "The Mulia, Mulia Resort & Villas", "Ayodya Resort Bali", "Grand Hyatt Bali",
  "Sofitel Bali Nusa Dua Beach Resort", "The Ritz-Carlton, Bali", "Conrad Bali", "Club Med Bali",
  "Apurva Kempinski Bali", "Melia Bali",

  // Jimbaran / Uluwatu
  "Ayana Resort and Spa, BALI", "Rimba by Ayana Bali", "Four Seasons Resort Bali at Jimbaran Bay",
  "InterContinental Bali Resort", "Le Meridien Bali Jimbaran",
  "Six Senses Uluwatu", "Alila Villas Uluwatu", "Bulgari Resort Bali", "The Edge Bali",
  "Single Fin Bali", "Savaya Bali", "Padang Padang Beach", "Suluban Beach", "Uluwatu Temple",

  // General Areas
  "Seminyak, Bali", "Canggu, Bali", "Ubud, Bali", "Kuta, Bali", 
  "Legian, Bali", "Jimbaran, Bali", "Nusa Dua, Bali", "Uluwatu, Bali", 
  "Sanur, Bali", "Pererenan, Bali", "Berawa, Canggu", "Kerobokan, Bali", 
  "Ungasan, Bali", "Pecatu, Bali", "Denpasar, Bali"
];

interface Props {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  className?: string;
}

const LocationAutocomplete: React.FC<Props> = ({ value, onChange, placeholder = "Villa Name / Location", className }) => {
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const autocompleteService = useRef<any>(null);
    const sessionToken = useRef<any>(null);

    // Initialize Google Autocomplete Service if available
    useEffect(() => {
        if (window.google && window.google.maps && window.google.maps.places) {
            try {
                autocompleteService.current = new window.google.maps.places.AutocompleteService();
                sessionToken.current = new window.google.maps.places.AutocompleteSessionToken();
            } catch (e) {
                console.warn("Google Maps API loaded but Autocomplete failed initialization", e);
            }
        }
    }, []);

    // Close suggestions on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const input = e.target.value;
        onChange(input);

        if (input.length > 1) {
            setIsLoading(true);
            setShowSuggestions(true);

            if (autocompleteService.current && window.google && window.google.maps) {
                const baliBounds = new window.google.maps.LatLngBounds(
                    new window.google.maps.LatLng(-8.9, 114.4),
                    new window.google.maps.LatLng(-8.0, 115.8)
                );

                const request = {
                    input: input,
                    sessionToken: sessionToken.current,
                    componentRestrictions: { country: 'id' },
                    locationBias: baliBounds,
                    types: ['establishment', 'geocode'] 
                };

                autocompleteService.current.getPlacePredictions(request, (predictions: any[], status: any) => {
                    if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions) {
                        setSuggestions(predictions.map(p => p.description));
                        setIsLoading(false);
                    } else {
                        filterLocal(input);
                    }
                });
            } else {
                filterLocal(input);
            }
        } else {
            setShowSuggestions(false);
            setIsLoading(false);
        }
    };

    const filterLocal = (input: string) => {
        // Debounce slightly
        setTimeout(() => {
            const lowerInput = input.toLowerCase();
            const filtered = BALI_LOCATIONS_FALLBACK.filter(loc => 
                loc.toLowerCase().includes(lowerInput)
            );
            filtered.sort((a, b) => {
                const aStarts = a.toLowerCase().startsWith(lowerInput);
                const bStarts = b.toLowerCase().startsWith(lowerInput);
                if (aStarts && !bStarts) return -1;
                if (!aStarts && bStarts) return 1;
                return 0;
            });

            setSuggestions(filtered.slice(0, 8));
            setIsLoading(false);
        }, 100);
    };

    const handleSelectSuggestion = (suggestion: string) => {
        onChange(suggestion);
        setShowSuggestions(false);
        if (window.google && window.google.maps && window.google.maps.places) {
            sessionToken.current = new window.google.maps.places.AutocompleteSessionToken();
        }
    };

    const handleCheckMap = () => {
         if (!value) return;
         const query = encodeURIComponent(value.toLowerCase().includes('bali') ? value : value + ' Bali');
         window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
    };

    return (
        <div className="relative w-full" ref={wrapperRef}>
            <div className="relative flex items-center">
                <input 
                    type="text" 
                    value={value}
                    onChange={handleInputChange}
                    onFocus={() => value.length > 0 && setShowSuggestions(true)}
                    className={className}
                    placeholder={placeholder}
                    autoComplete="off"
                />
                
                {/* Right-side Actions */}
                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2 z-10">
                    {isLoading ? (
                        <Loader2 className="w-4 h-4 text-white animate-spin" />
                    ) : value.length > 2 && (
                        <button 
                            type="button"
                            onClick={handleCheckMap}
                            className="text-stone-300 hover:text-white p-1.5 transition-all"
                            title="Check location on Google Maps"
                        >
                            <ExternalLink className="w-3.5 h-3.5" />
                        </button>
                    )}
                </div>
            </div>

            {/* Suggestions Dropdown */}
            <AnimatePresence>
                {showSuggestions && suggestions.length > 0 && (
                    <motion.ul
                        initial={{ opacity: 0, y: 10, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.98 }}
                        className="absolute z-[100] left-0 right-0 mt-2 bg-white/40 backdrop-blur-2xl border border-white/50 rounded-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] max-h-60 overflow-y-auto no-scrollbar"
                    >
                        {suggestions.map((suggestion, index) => (
                            <li 
                                key={index}
                                onClick={() => handleSelectSuggestion(suggestion)}
                                className="px-5 py-4 hover:bg-stone-50 cursor-pointer text-sm font-light text-stone-600 hover:text-secondary transition-colors border-b border-stone-100 last:border-0 flex items-center gap-4 group"
                            >
                                <div className="p-2 bg-stone-50 rounded-none border border-white/20 group-hover:border-black transition-colors">
                                     <MapPin className="w-3 h-3 text-white shrink-0" strokeWidth={1.5} />
                                </div>
                                <span className="truncate">{suggestion}</span>
                            </li>
                        ))}
                    </motion.ul>
                )}
            </AnimatePresence>
        </div>
    );
};

export default LocationAutocomplete;