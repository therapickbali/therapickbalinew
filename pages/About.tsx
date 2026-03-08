
import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-background text-text overflow-hidden pt-32">
      
      {/* Header */}
      <section className="px-6 max-w-5xl mx-auto text-center mb-24">
          <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.8 }}
          >
              <h1 className="font-serif text-7xl md:text-[120px] font-light text-secondary mb-8 leading-[0.85] tracking-[-0.02em]">
                  The <span className="text-primary italic">Collective</span>
              </h1>
              <p className="text-text-muted text-lg md:text-2xl font-light leading-relaxed">
                  We are not just a service; we are a curated collective of Bali's finest wellness professionals, dedicated to bringing the sanctuary to you.
              </p>
          </motion.div>
      </section>

      {/* Visual Section */}
      <section className="max-w-[1400px] mx-auto px-6 mb-32">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24 items-center">
            
            <div className="relative h-[600px]">
                <img 
                    src="https://images.pexels.com/photos/3997993/pexels-photo-3997993.jpeg?auto=compress&cs=tinysrgb&w=1200" 
                    alt="Therapist" 
                    className="w-full h-full object-cover"
                />
                <div className="absolute -bottom-6 -right-6 bg-secondary p-10 text-white max-w-sm">
                     <p className="font-serif font-light text-3xl mb-6 leading-tight">"True luxury is comfort without effort."</p>
                     <div className="w-16 h-[1px] bg-primary"></div>
                </div>
            </div>

            <div className="space-y-12">
                <div>
                    <h3 className="text-primary text-[9px] font-sans font-semibold uppercase tracking-[0.4em] mb-6">Our Standard</h3>
                    <h2 className="font-serif text-5xl md:text-6xl font-light text-secondary mb-8 leading-[0.9] tracking-[-0.02em]">Excellence in Motion</h2>
                    <p className="text-text-muted leading-relaxed text-lg md:text-xl font-light">
                        Every therapist in our collective has served in 5-star resorts. We bring this level of expertise, discretion, and skill to your private villa. We understand that your time in Bali is precious.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-10 border-t border-border pt-10">
                    <div className="flex gap-8">
                        <span className="text-primary font-serif text-4xl font-light italic">01.</span>
                        <div>
                            <h4 className="font-sans font-semibold text-[10px] uppercase tracking-[0.2em] text-secondary mb-3">Vetted Professionals</h4>
                            <p className="text-sm font-light text-text-muted">Strict background checks and skill assessments.</p>
                        </div>
                    </div>
                    <div className="flex gap-8">
                         <span className="text-primary font-serif text-4xl font-light italic">02.</span>
                        <div>
                            <h4 className="font-sans font-semibold text-[10px] uppercase tracking-[0.2em] text-secondary mb-3">Hygiene Protocols</h4>
                            <p className="text-sm font-light text-text-muted">Hospital-grade sterilization for every session.</p>
                        </div>
                    </div>
                     <div className="flex gap-8">
                         <span className="text-primary font-serif text-4xl font-light italic">03.</span>
                        <div>
                            <h4 className="font-sans font-semibold text-[10px] uppercase tracking-[0.2em] text-secondary mb-3">Complete Setup</h4>
                            <p className="text-sm font-light text-text-muted">We bring the spa: linens, music, oils, and tables.</p>
                        </div>
                    </div>
                </div>
            </div>

        </div>
      </section>

    </div>
  );
};

export default About;
