import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Settings, Wrench, ShieldCheck, ArrowRight, ShoppingBag, MapPin, ExternalLink, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import SEO from '../components/SEO';
import { useContact } from '../context/ContactContext';

const Home = () => {
    const { whatsapp } = useContact();
    const [hero, setHero] = useState({
        title: 'Soluções de Alta Performance em <br className="hidden lg:block" /> Solda e Corte',
        subtitle: 'Equipamentos de última geração para sua indústria. Oferecemos locação ágil, assistência técnica multimarcas e suporte especializado para garantir sua produtividade.',
        video_url: 'https://www.youtube.com/embed/Kks92P3OGJI',
        primary_button_text: 'Ver Catálogo de Locação',
        primary_button_link: '/locacao',
        secondary_button_text: 'Nossos Serviços',
        secondary_button_link: '/assistencia'
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHero = async () => {
            const { data, error } = await supabase
                .from('site_settings')
                .select('value')
                .eq('key', 'hero')
                .single();

            if (data && data.value) {
                setHero(data.value);
            }
            setLoading(false);
        };
        fetchHero();
    }, []);
    const schema = {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "name": "Servweld",
        "image": "https://www.servweld.com.br/logo.png",
        "@id": "https://www.servweld.com.br",
        "url": "https://www.servweld.com.br",
        "telephone": "+556132346622",
        "address": {
            "@type": "PostalAddress",
            "streetAddress": "SQPS 104 Quadra 05 Conjunto A Lote 05 Loja 02",
            "addressLocality": "Brasília",
            "postalCode": "71215-226",
            "addressRegion": "DF",
            "addressCountry": "BR"
        },
        "geo": {
            "@type": "GeoCoordinates",
            "latitude": -23.55052,
            "longitude": -46.633308
        },
        "openingHoursSpecification": {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": [
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday"
            ],
            "opens": "08:00",
            "closes": "18:00"
        }
    };

    return (
        <>
            <SEO
                title="Home"
                description="Soluções de alta performance em soldagem e corte. Locação de máquinas MIG, TIG e Plasma com assistência técnica especializada."
                schema={schema}
            />

            {/* Hero Section */}
            <section className="relative min-h-[90vh] flex items-center bg-black overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-black/50 z-10" />
                    <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden">
                        <iframe
                            className="absolute top-1/2 left-1/2 w-[115%] h-[115%] -translate-x-1/2 -translate-y-1/2"
                            src={`${hero.video_url}?autoplay=1&mute=1&controls=0&loop=1&playlist=${hero.video_url.split('/').pop()}&background=1&modestbranding=1&rel=0`}
                            allow="autoplay; encrypted-media"
                            title="Servweld Hero Video"
                        ></iframe>
                    </div>
                </div>

                <div className="relative z-20 w-full h-full flex flex-col">
                    {/* Top spacing to push text down from navbar if needed, or just center it */}
                    <div className="flex-grow flex items-center justify-center px-4 sm:px-6 lg:px-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, delay: 0.2 }}
                            className="max-w-5xl text-center"
                        >
                            <h1
                                className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black tracking-tight mb-8 text-white leading-[1.05] drop-shadow-2xl text-balance"
                                dangerouslySetInnerHTML={{ __html: hero.title }}
                            />
                            <p className="text-xl md:text-2xl text-gray-200 mb-12 leading-relaxed max-w-3xl mx-auto font-medium drop-shadow-lg">
                                {hero.subtitle}
                            </p>
                        </motion.div>
                    </div>

                    {/* Bottom Buttons - Positioned at the bottom limit of the hero */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.8 }}
                        className="pb-16 flex flex-wrap justify-center gap-6 px-4"
                    >
                        <Link to={hero.primary_button_link} className="btn-primary py-5 px-10 text-xl shadow-2xl shadow-servweld-blue/40 hover:scale-105 transition-transform">
                            {hero.primary_button_text}
                        </Link>
                        <Link to={hero.secondary_button_link} className="btn-outline py-5 px-10 text-xl backdrop-blur-md hover:bg-white hover:text-servweld-black hover:scale-105 transition-transform border-2">
                            {hero.secondary_button_text}
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* Quick Services */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl font-bold mb-4">Por que escolher a Servweld?</h2>
                        <div className="w-20 h-1.5 bg-servweld-blue mx-auto rounded-full" />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        {/* Rental Card */}
                        <motion.div
                            whileHover={{ y: -10 }}
                            className="p-10 bg-gray-50 rounded-[2.5rem] transition-all hover:shadow-2xl border border-gray-100 flex flex-col group"
                        >
                            <div className="w-24 h-24 bg-servweld-blue/10 rounded-3xl flex items-center justify-center mb-8 group-hover:bg-servweld-blue transition-all duration-500">
                                <Settings className="text-servweld-blue group-hover:text-white transition-colors" size={48} />
                            </div>
                            <h3 className="text-2xl font-bold mb-4 text-[#1a2316]">Locação Flexível</h3>
                            <p className="text-gray-600 mb-6 leading-relaxed">
                                Equipamentos revisados e prontos para uso imediato em diversos processos:
                            </p>
                            <ul className="grid grid-cols-1 gap-2 mb-8 flex-grow">
                                {[
                                    "MIG/MAG Alimentador Interno",
                                    "MIG/MAG Alimentador Externo",
                                    "Retificadores de Solda",
                                    "Goivagem",
                                    "Inversor de Solda",
                                    "Máquinas de Corte Plasma",
                                    "Conjunto de Oxi-Corte"
                                ].map((item, idx) => (
                                    <li key={idx} className="flex items-center gap-2 text-sm text-gray-700 font-medium">
                                        <div className="w-1.5 h-1.5 bg-servweld-blue rounded-full" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                            <Link to="/locacao" className="inline-flex items-center gap-2 text-servweld-blue font-bold hover:gap-3 transition-all mt-auto">
                                Ver Catálogo Completo <ArrowRight size={20} />
                            </Link>
                        </motion.div>

                        {/* Assistance Card */}
                        <motion.div
                            whileHover={{ y: -10 }}
                            className="p-10 bg-gray-50 rounded-[2.5rem] transition-all hover:shadow-2xl border border-gray-100 flex flex-col group lg:scale-105 lg:z-10 bg-white"
                        >
                            <div className="w-24 h-24 bg-servweld-blue/10 rounded-3xl flex items-center justify-center mb-8 group-hover:bg-servweld-blue transition-all duration-500">
                                <Wrench className="text-servweld-blue group-hover:text-white transition-colors" size={48} />
                            </div>
                            <h3 className="text-2xl font-bold mb-4 text-[#1a2316]">Assistência Técnica</h3>
                            <p className="text-gray-600 mb-6 leading-relaxed">
                                Manutenção especializada em uma ampla gama de equipamentos industriais:
                            </p>
                            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4 mb-8 flex-grow">
                                {[
                                    "Alimentadores de Arame",
                                    "Maçaricos de Corte",
                                    "Máquinas MIG/MAG",
                                    "CNC",
                                    "Retificadores",
                                    "Teste de Baterias",
                                    "Carregadores",
                                    "TIG Alta Frequência",
                                    "Secagem Funilaria",
                                    "Talhas Elétricas",
                                    "Tochas MIG/TIG",
                                    "Compressores",
                                    "Inversores",
                                    "Corte Plasma",
                                    "Repuxadeiras",
                                    "Reguladores Pressão",
                                    "Tartarugas Corte"
                                ].map((item, idx) => (
                                    <li key={idx} className="flex items-center gap-2 text-xs text-gray-700 font-medium">
                                        <div className="w-1 h-1 bg-servweld-blue rounded-full" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                            <Link to="/assistencia" className="inline-flex items-center gap-2 text-servweld-blue font-bold hover:gap-3 transition-all mt-auto">
                                Solicitar Manutenção <ArrowRight size={20} />
                            </Link>
                        </motion.div>

                        {/* Quality Card */}
                        <motion.div
                            whileHover={{ y: -10 }}
                            className="p-10 bg-gray-50 rounded-[2.5rem] transition-all hover:shadow-2xl border border-gray-100 flex flex-col group"
                        >
                            <div className="w-24 h-24 bg-servweld-blue/10 rounded-3xl flex items-center justify-center mb-8 group-hover:bg-servweld-blue transition-all duration-500">
                                <ShieldCheck className="text-servweld-blue group-hover:text-white transition-colors" size={48} />
                            </div>
                            <h3 className="text-2xl font-bold mb-4 text-[#1a2316]">Qualidade Garantida</h3>
                            <p className="text-gray-600 mb-6 leading-relaxed">
                                Compromisso com a excelência técnica e suporte total ao cliente:
                            </p>
                            <ul className="grid grid-cols-1 gap-4 mb-8 flex-grow">
                                {[
                                    { title: "Peças Originais", desc: "Trabalhamos apenas com componentes de alta qualidade." },
                                    { title: "Profissionais Certificados", desc: "Técnicos com vasta experiência no setor." }
                                ].map((item, idx) => (
                                    <li key={idx} className="text-left">
                                        <span className="block text-sm font-bold text-[#1a2316] mb-1">{item.title}</span>
                                        <span className="block text-xs text-gray-500">{item.desc}</span>
                                    </li>
                                ))}
                            </ul>
                            <button className="inline-flex items-center gap-2 text-servweld-blue font-bold hover:gap-3 transition-all cursor-default mt-auto">
                                Conheça nossa empresa
                            </button>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Servsolda Promotion - Sales Division */}
            <section className="py-24 bg-white overflow-hidden relative border-t border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
                        {/* Image Block - Clean & Minimalist */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="relative"
                        >
                            <div className="bg-gray-50 rounded-[2rem] p-12 border border-gray-100 flex items-center justify-center aspect-[4/3] shadow-sm">
                                <img
                                    src="/assets/logo/servsolda.png"
                                    alt="Servsolda Logo"
                                    className="w-full max-w-[340px] h-auto object-contain"
                                />
                            </div>
                        </motion.div>

                        {/* Content Block - Solid & Clean */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                        >
                            <div className="inline-flex items-center gap-2 text-[#005f2f] font-bold uppercase tracking-widest text-sm mb-6">
                                <ShoppingBag size={18} />
                                Visite nossa loja parceira
                            </div>

                            <h2 className="text-4xl md:text-5xl font-extrabold text-[#1a2316] mb-8 leading-tight">
                                Máquinas, Consumíveis e <br />
                                <span className="text-[#005f2f]">Acessórios de Solda</span>
                            </h2>

                            <p className="text-gray-600 text-lg mb-10 leading-relaxed max-w-xl">
                                Através da **Servsolda**, oferecemos a linha completa de produtos para sua indústria.
                                Encontre eletrodos, EPIs, máquinas de última geração e tudo o que você precisa
                                para soldagem e corte com a garantia de quem entende do assunto.
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 mb-12">
                                {[
                                    "Eletrodos e Arames",
                                    "Máquinas de Solda",
                                    "Acessórios e Tochas",
                                    "EPIs e Segurança"
                                ].map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-3">
                                        <div className="w-2 h-2 bg-[#005f2f] rounded-full" />
                                        <span className="text-[#1a2316] font-medium">{item}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <a
                                    href="https://www.servsolda.com.br/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center justify-center gap-3 bg-[#005f2f] text-white hover:bg-[#1a2316] px-8 py-4 rounded-xl font-bold transition-all shadow-lg shadow-[#005f2f]/10"
                                >
                                    Ir para o Site da Servsolda
                                    <ExternalLink size={18} />
                                </a>
                                <a
                                    href={`https://wa.me/${whatsapp}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center justify-center gap-3 border-2 border-[#005f2f] text-[#005f2f] hover:bg-[#005f2f] hover:text-white px-8 py-4 rounded-xl font-bold transition-all"
                                >
                                    Consultar Estoque
                                </a>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Map & Location Section */}
            <section className="py-24 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch">
                        <div className="flex flex-col justify-center">
                            <div className="inline-flex items-center gap-2 text-servweld-blue font-bold uppercase tracking-wider mb-4">
                                <MapPin size={20} />
                                Localização Estratégica
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold mb-6">Venha nos Visitar em Brasília</h2>
                            <p className="text-gray-600 mb-8 max-w-lg">
                                Estamos localizados no Guará, com fácil acesso para atender toda a região industrial.
                                Nossa equipe está pronta para receber você com consultoria técnica especializada.
                            </p>

                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8">
                                <p className="font-bold text-servweld-black mb-2">Endereço Oficial:</p>
                                <p className="text-gray-600">
                                    SQPS 104 Quadra 05 Conjunto A Lote 05 Loja 02<br />
                                    Zona Industrial: Guará - Brasília - DF<br />
                                    CEP 71215-226
                                </p>
                            </div>

                            <a
                                href="https://www.google.com/maps/place/Servweld+%2F+Servsolda+Assist%C3%AAncia+T%C3%A9cnica,+Loca%C3%A7%C3%A3o+e+M%C3%A1quinas+de+Solda/@-15.8204163,-47.9590714,17z/data=!3m1!4b1!4m6!3m5!1s0x935a303214e58247:0x9f22315243aef2c3!8m2!3d-15.8204163!4d-47.9564965!16s%2Fg%2F1v75s_6n?entry=ttu"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-primary w-fit flex items-center gap-3 py-4 px-10 shadow-lg shadow-servweld-blue/20"
                            >
                                <MapPin size={22} />
                                Abrir no GPS / Ver no Maps
                            </a>
                        </div>

                        <div className="h-[400px] lg:h-auto rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                            <iframe
                                title="Localização Servweld"
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3838.293149506634!2d-47.9564965!3d-15.8204163!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x935a303214e58247%3A0x9f22315243aef2c3!2sServweld%20%2F%20Servsolda%20Assist%C3%AAncia%20T%C3%A9cnica%2C%20Loca%C3%A7%C3%A3o%20e%20M%C3%A1quinas%20de%20Solda!5e0!3m2!1spt-BR!2sbr!4v1710000000000!5m2!1spt-BR!2sbr"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen=""
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="bg-servweld-blue py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-8">
                        Pronto para impulsionar sua produtividade?
                    </h2>
                    <p className="text-blue-100 text-xl mb-10 max-w-2xl mx-auto">
                        Fale com um de nossos especialistas e solicite um orçamento personalizado para sua empresa.
                    </p>
                    <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noopener noreferrer" className="bg-white text-servweld-blue hover:bg-gray-100 px-10 py-4 rounded-xl font-bold text-lg inline-flex items-center gap-2 transition-all">
                        Falar pelo WhatsApp
                    </a>
                </div>
            </section>
        </>
    );
};

export default Home;
