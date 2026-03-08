
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
        <div className="w-full lg:w-1/2 h-[35vh] lg:h-screen relative overflow-hidden">
             <img 
                src="https://images.pexels.com/photos/6663364/pexels-photo-6663364.jpeg?auto=compress&cs=tinysrgb&w=1200" 
                className="w-full h-full object-cover"
                alt="Spa Atmosphere"
             />
             <div className="absolute inset-0 bg-black/20"></div>
             <div className="absolute bottom-12 left-12 text-white max-w-sm hidden lg:block">
                 <div className="flex gap-1 mb-6">
                     {[1,2,3,4,5].map(i => <Star key={i} size={14} fill="white" className="text-white" />)}
                 </div>
                 <p className="font-serif font-light text-3xl leading-tight">
                     "The most professional mobile service in Bali. A true 5-star experience."
                 </p>
             </div>
        </div>

        {/* Right: Form */}
        <div className="w-full lg:w-1/2 bg-white flex flex-col justify-center px-6 lg:px-16 py-10 lg:py-0">
            <div className="max-w-lg mx-auto w-full">
                <span className="text-primary font-sans font-semibold uppercase tracking-[0.4em] text-[9px] mb-4 block">Availability</span>
                <h1 className="font-serif text-5xl md:text-6xl font-light text-secondary mb-8 leading-[0.9] tracking-[-0.02em]">Secure Your Time</h1>
                <p className="text-text-muted mb-10 font-light text-lg">
                    Due to high demand in Canggu and Uluwatu, we recommend booking at least 4 hours in advance.
                </p>

                <form onSubmit={handleSubmit} className="space-y-8">
                     <div className="group">
                         <label className="block text-[9px] font-sans font-semibold uppercase tracking-[0.3em] text-text-muted mb-3">Guest Name</label>
                         <input 
                            type="text" 
                            required
                            value={name}
                            onChange={e => setName(e.target.value)}
                            className="w-full border-b border-gray-200 py-3 text-2xl font-serif font-light text-secondary outline-none focus:border-primary transition-colors bg-transparent placeholder-gray-300"
                            placeholder="Your Name"
                         />
                     </div>

                     <div className="grid grid-cols-2 gap-8">
                         <div>
                             <label className="block text-[9px] font-sans font-semibold uppercase tracking-[0.3em] text-text-muted mb-3">Preferred Date</label>
                             <input 
                                type="date" 
                                required
                                value={date}
                                onChange={e => setDate(e.target.value)}
                                className="w-full border-b border-gray-200 py-3 text-lg font-light text-secondary outline-none focus:border-primary transition-colors bg-transparent"
                             />
                         </div>
                         <div>
                             <label className="block text-[9px] font-sans font-semibold uppercase tracking-[0.3em] text-text-muted mb-3">Time</label>
                             <input 
                                type="time" 
                                required
                                value={time}
                                onChange={e => setTime(e.target.value)}
                                className="w-full border-b border-gray-200 py-3 text-lg font-light text-secondary outline-none focus:border-primary transition-colors bg-transparent"
                             />
                         </div>
                     </div>

                     <div>
                         <label className="block text-[9px] font-sans font-semibold uppercase tracking-[0.3em] text-text-muted mb-3">Treatment Interest</label>
                         <select 
                            className="w-full border-b border-gray-200 py-3 text-lg font-serif font-light text-secondary outline-none focus:border-primary transition-colors bg-transparent"
                            value={primaryService}
                            onChange={e => setPrimaryService(e.target.value)}
                            required
                         >
                             <option value="">Select a ritual...</option>
                             {SERVICES.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                         </select>
                     </div>

                     <div>
                         <label className="block text-[9px] font-sans font-semibold uppercase tracking-[0.3em] text-text-muted mb-3">Location</label>
                         <LocationAutocomplete 
                            value={location}
                            onChange={setLocation}
                            className="w-full border-b border-gray-200 py-3 text-lg font-serif font-light text-secondary outline-none focus:border-primary transition-colors bg-transparent placeholder-gray-300"
                            placeholder="Villa Name or Area"
                         />
                     </div>

                     <div>
                         <label className="block text-[9px] font-sans font-semibold uppercase tracking-[0.3em] text-text-muted mb-3">Room Number (Optional)</label>
                         <input 
                            type="text" 
                            value={roomNumber}
                            onChange={e => setRoomNumber(e.target.value)}
                            className="w-full border-b border-gray-200 py-3 text-lg font-serif font-light text-secondary outline-none focus:border-primary transition-colors bg-transparent placeholder-gray-300"
                            placeholder="e.g. 101 or Villa 5"
                         />
                     </div>

                     {/* Google Map Embed for Local SEO */}
                     <div className="pt-4">
                         <iframe 
                           src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3946.115628358793!2d115.2671386!3d-8.488137100000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd23d00e0ee4769%3A0x2353065278116e6a!2sElexoir%20Spa%20%26%20Massage%20%7C%20Home%20Massage%20Service!5e0!3m2!1sid!2sid!4v1771989137085!5m2!1sid!2sid" 
                           width="100%" 
                           height="200" 
                           style={{ border: 0, borderRadius: '12px' }} 
                           allowFullScreen={false} 
                           loading="lazy" 
                           referrerPolicy="no-referrer-when-downgrade"
                           title="Elexoir Spa & Massage Ubud Location"
                         ></iframe>
                     </div>

                     <button type="submit" className="w-full bg-secondary text-white py-5 rounded-full font-sans font-semibold uppercase tracking-[0.3em] text-[10px] hover:bg-primary transition-colors mt-8 flex items-center justify-center gap-3">
                         Request via WhatsApp <ArrowRight size={16} strokeWidth={1.5} />
                     </button>
                </form>
            </div>
        </div>
    </div>
  );
};

export default Contact;
