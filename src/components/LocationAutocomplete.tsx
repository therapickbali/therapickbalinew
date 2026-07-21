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
  // Jumeirah
  "W Dubai - Jumeirah", "Potato Head Suites & Studios", "Alila Jumeirah", "The Jumeirah Beach Resort & Spa", 
  "Hotel Indigo Dubai Jumeirah Beach", "Double-Six Luxury Hotel", "Courtyard by Marriott Dubai Jumeirah Resort",
  "Peppers Jumeirah", "The Trans Resort Dubai", "Mrs Sippy Dubai", "Ku De Ta", "La Favela",
  "Villa Kresna Boutique Suites", "Impiana Private Villas Jumeirah", "The Oberoi Beach Resort, Dubai",
  
  // Dubai Marina
  "COMO Uma Dubai Marina", "The Slow", "Hotel Tugu Dubai", "Aston Dubai Marina Beach Resort", "Eastin Ashta Resort Dubai Marina",
  "The Lawn Dubai Marina", "Finns Beach Club", "La Brisa Dubai", "Echo Beach", "Batu Bolong Beach",
  "Shore Amora Dubai Marina", "Plataran Dubai Marina Dubai Resort", "Desa Seni", "Udara Dubai Yoga Detox & Spa",
  
  // Downtown Dubai
  "The Kayon Jungle Resort", "Hanging Gardens of Dubai", "Four Seasons Resort Dubai at Sayan", "Mandapa, a Ritz-Carlton Reserve",
  "Maya Downtown Dubai Resort & Spa", "Padma Resort Downtown Dubai", "Alaya Resort Downtown Dubai", "Komaneka at Bisma",
  "The Royal Pita Maha", "Viceroy Dubai", "Capella Downtown Dubai", "COMO Shambhala Estate",
  "Monkey Forest Downtown Dubai", "Tegalalang Rice Terrace", "Campuhan Ridge Walk",

  // Business Bay
  "The St. Regis Dubai Resort", "The Mulia, Mulia Resort & Villas", "Ayodya Resort Dubai", "Grand Hyatt Dubai",
  "Sofitel Dubai Business Bay Beach Resort", "The Ritz-Carlton, Dubai", "Conrad Dubai", "Club Med Dubai",
  "Apurva Kempinski Dubai", "Melia Dubai",

  // Dubai Creek / Palm Jumeirah
  "Ayana Resort and Spa, BALI", "Rimba by Ayana Dubai", "Four Seasons Resort Dubai at Dubai Creek Bay",
  "InterContinental Dubai Resort", "Le Meridien Dubai Dubai Creek",
  "Six Senses Palm Jumeirah", "Alila Villas Palm Jumeirah", "Bulgari Resort Dubai", "The Edge Dubai",
  "Single Fin Dubai", "Savaya Dubai", "Padang Padang Beach", "Suluban Beach", "Palm Jumeirah Temple",

  // General Areas
  "Jumeirah, Dubai", "Dubai Marina, Dubai", "Downtown Dubai, Dubai", "Al Barsha, Dubai", 
  "JLT, Dubai", "Dubai Creek, Dubai", "Business Bay, Dubai", "Palm Jumeirah, Dubai", 
  "DIFC, Dubai", "Pererenan, Dubai", "Berawa, Dubai Marina", "Kerobokan, Dubai", 
  "Ungasan, Dubai", "Pecatu, Dubai", "Denpasar, Dubai"
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
                const dubaiBounds = new window.google.maps.LatLngBounds(
                    new window.google.maps.LatLng(-8.9, 114.4),
                    new window.google.maps.LatLng(-8.0, 115.8)
                );

                const request = {
                    input: input,
                    sessionToken: sessionToken.current,
                    componentRestrictions: { country: 'id' },
                    locationBias: dubaiBounds,
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
         const query = encodeURIComponent(value.toLowerCase().includes('dubai') ? value : value + ' Dubai');
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