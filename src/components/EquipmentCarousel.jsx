import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';

const EquipmentCarousel = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const scrollRef = useRef(null);

    useEffect(() => {
        fetchShowcase();
    }, []);

    const fetchShowcase = async () => {
        try {
            const { data, error } = await supabase
                .from('site_showcase')
                .select('*')
                .order('display_order', { ascending: true });

            if (!error && data) {
                setItems(data);
            }
        } catch (err) {
            console.error('Error fetching showcase for carousel:', err);
        } finally {
            setLoading(false);
        }
    };

    const scroll = (direction) => {
        if (scrollRef.current) {
            const { scrollLeft, clientWidth } = scrollRef.current;
            const scrollTo = direction === 'left' 
                ? scrollLeft - clientWidth * 0.8 
                : scrollLeft + clientWidth * 0.8;
            
            scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
        }
    };

    if (loading) {
        return (
            <div className="py-20 flex justify-center">
                <Loader2 className="animate-spin text-servweld-blue" size={40} />
            </div>
        );
    }

    if (items.length === 0) return null;

    return (
        <section className="py-24 bg-gray-50/50 overflow-hidden border-t border-b border-gray-100/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 flex justify-between items-end">
                <div>
                    <h2 className="text-3xl md:text-5xl font-black text-servweld-black mb-4">Equipamentos que Trabalhamos</h2>
                    <div className="w-20 h-2 bg-servweld-blue rounded-full" />
                </div>
                <div className="flex gap-2">
                    <button 
                        onClick={() => scroll('left')}
                        className="p-3 rounded-full border border-gray-100 hover:bg-servweld-blue hover:text-white transition-all shadow-sm"
                    >
                        <ChevronLeft size={24} />
                    </button>
                    <button 
                        onClick={() => scroll('right')}
                        className="p-3 rounded-full border border-gray-100 hover:bg-servweld-blue hover:text-white transition-all shadow-sm"
                    >
                        <ChevronRight size={24} />
                    </button>
                </div>
            </div>

            <div className="relative">
                <div 
                    ref={scrollRef}
                    className="flex gap-8 overflow-x-auto pb-12 px-[5%] scrollbar-hide snap-x snap-mandatory"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {items.map((item, idx) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: idx * 0.1 }}
                            className="min-w-[280px] md:min-w-[400px] aspect-[4/5] bg-gray-50 rounded-[3rem] p-10 flex flex-col items-center justify-between snap-center group relative overflow-hidden border border-gray-100/50"
                        >
                            {/* Decorative background element */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-servweld-blue/5 rounded-bl-[5rem] group-hover:w-full group-hover:h-full group-hover:rounded-none transition-all duration-700 pointer-events-none" />
                            
                            <div className="relative z-10 w-full flex-grow flex items-center justify-center">
                                <img
                                    src={item.image_url}
                                    alt={item.name}
                                    className="max-w-full max-h-[85%] object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.15)] group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-700"
                                />
                            </div>

                            <div className="relative z-10 text-center w-full">
                                <h3 className="text-xl md:text-2xl font-black text-servweld-black mb-2 opacity-80 group-hover:opacity-100 transition-opacity">
                                    {item.name}
                                </h3>
                                <div className="h-1 w-0 bg-servweld-blue mx-auto group-hover:w-12 transition-all duration-500" />
                            </div>
                        </motion.div>
                    ))}
                    {/* Spacer for ending padding */}
                    <div className="min-w-[5%] shrink-0 h-4" />
                </div>
            </div>
        </section>
    );
};

export default EquipmentCarousel;
