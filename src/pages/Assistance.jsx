import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Wrench, Zap, ClipboardCheck, Clock, ShieldCheck, HeadphonesIcon, Loader2 } from 'lucide-react';
import { assistanceBrands as staticBrands } from '../data/products';
import { supabase } from '../lib/supabase';
import SEO from '../components/SEO';
import { useContact } from '../context/ContactContext';

const Assistance = () => {
    const { whatsapp } = useContact();
    const [brands, setBrands] = useState(staticBrands);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBrands();
    }, []);

    const fetchBrands = async () => {
        try {
            const { data, error } = await supabase
                .from('brands')
                .select('*')
                .order('name', { ascending: true });

            if (!error && data && data.length > 0) {
                // Map database fields to match component expectations
                const mappedBrands = data.map(b => ({
                    name: b.name,
                    url: b.url,
                    logo: b.logo_url
                }));
                setBrands(mappedBrands);
            }
        } catch (err) {
            console.error('Error fetching brands:', err);
        } finally {
            setLoading(false);
        }
    };
    const services = [
        {
            icon: <Wrench size={32} />,
            title: "Manutenção Preventiva",
            description: "Avaliação técnica periódica para evitar paradas inesperadas e prolongar a vida útil do seu equipamento."
        },
        {
            icon: <Zap size={32} />,
            title: "Reparo Eletrônico",
            description: "Conserto especializado em placas de controle e inversores de solda com componentes originais."
        },
        {
            icon: <ClipboardCheck size={32} />,
            title: "Calibração e Aferição",
            description: "Certificação de equipamentos conforme normas técnicas vigentes (ISO/IEC)."
        },
        {
            icon: <Clock size={32} />,
            title: "Atendimento Rápido",
            description: "Prioridade para clientes com contratos de manutenção ou urgências industriais."
        },
        {
            icon: <ShieldCheck size={32} />,
            title: "Garantia de Serviço",
            description: "Todos os nossos serviços contam com garantia integral e laudo técnico detalhado."
        },
        {
            icon: <HeadphonesIcon size={32} />,
            title: "Suporte Técnico",
            description: "Orientação especializada para configuração e melhor aproveitamento dos equipamentos."
        }
    ];

    return (
        <>
            <SEO
                title="Assistência Técnica Especializada"
                description="Manutenção preventiva e corretiva de máquinas de solda multimarcas. Técnicos certificados e peças originais."
            />

            <div className="bg-white">
                {/* Header Section */}
                <section className="bg-gray-50 py-20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h1 className="text-4xl md:text-5xl font-extrabold mb-6">Assistência Técnica Especializada</h1>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Somos especialistas em manter sua produção em movimento. Oferecemos suporte técnico completo
                            para as principais marcas do mercado de soldagem e corte.
                        </p>
                    </div>
                </section>

                {/* Services Grid */}
                <section className="py-24">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                            {services.map((service, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    className="flex flex-col items-start"
                                >
                                    <div className="w-16 h-16 bg-servweld-blue/10 text-servweld-blue rounded-2xl flex items-center justify-center mb-6">
                                        {service.icon}
                                    </div>
                                    <h3 className="text-2xl font-bold mb-4">{service.title}</h3>
                                    <p className="text-gray-600 leading-relaxed italic">
                                        {service.description}
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Brands Section */}
                <section className="py-24 bg-gray-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold mb-4">Marcas que Atendemos</h2>
                            <div className="w-20 h-1.5 bg-servweld-blue mx-auto rounded-full mb-8" />
                            <p className="text-gray-600 max-w-2xl mx-auto">
                                Trabalhamos com multimarcas, garantindo que você tenha suporte independente do seu parque de máquinas.
                            </p>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                            {loading ? (
                                <div className="col-span-full py-20 flex flex-col items-center gap-4 text-gray-400">
                                    <Loader2 size={40} className="animate-spin text-servweld-blue" />
                                    <p>Carregando parceiros...</p>
                                </div>
                            ) : brands.map((brand, index) => (
                                <a
                                    key={index}
                                    href={brand.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center transition-all hover:border-servweld-blue hover:shadow-lg hover:-translate-y-1 group min-h-[160px]"
                                >
                                    <div className="h-24 w-full flex items-center justify-center mb-2">
                                        <img
                                            src={brand.logo}
                                            alt={`${brand.name} Logo`}
                                            className="max-h-full max-w-full object-contain grayscale group-hover:grayscale-0 transition-all duration-300 scale-110 group-hover:scale-125"
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                                e.target.nextSibling.style.display = 'block';
                                            }}
                                        />
                                        <span className="hidden text-sm font-bold tracking-wider text-gray-500 group-hover:text-servweld-blue transition-colors">
                                            {brand.name}
                                        </span>
                                    </div>
                                </a>
                            ))}
                        </div>

                        <div className="mt-16 text-center">
                            <p className="text-gray-500 mb-8 italic">Sua marca não está na lista? Entre em contato e consulte-nos.</p>
                            <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noopener noreferrer" className="btn-primary inline-flex">
                                Solicitar Suporte Técnico
                            </a>
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
};

export default Assistance;
