import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, ShieldCheck, Zap, Target, Eye, Heart, Star, TrendingUp, MessageSquare } from 'lucide-react';
import { supabase } from '../lib/supabase';
import SEO from '../components/SEO';
import { useContact } from '../context/ContactContext';

const Contact = () => {
    const { whatsapp, whatsapp_display, email } = useContact();
    const [selectedImg, setSelectedImg] = useState(null);
    const [galleryImages, setGalleryImages] = useState([]);

    useEffect(() => {
        const fetchGallery = async () => {
            const { data } = await supabase
                .from('gallery')
                .select('url')
                .order('created_at', { ascending: false });

            if (data && data.length > 0) {
                setGalleryImages(data.map(img => img.url));
            }
        };
        fetchGallery();
    }, []);

    const stats = [
        { label: 'Anos de Experiência', value: '25+', icon: <ShieldCheck className="text-servweld-blue" /> },
        { label: 'Clientes Atendidos', value: '5k+', icon: <TrendingUp className="text-servweld-blue" /> },
        { label: 'Técnicos Certificados', value: '10+', icon: <Zap className="text-servweld-blue" /> },
        { label: 'Marcas Atendidas', value: '20+', icon: <Target className="text-servweld-blue" /> },
    ];

    const values = [
        {
            title: "Missão",
            desc: "Fornecer soluções em soldagem que combinem tecnologia de ponta, qualidade superior e eficiência máxima, visando o sucesso total de nossos clientes.",
            icon: <Target size={32} className="text-servweld-blue" />
        },
        {
            title: "Visão",
            desc: "Ser a líder incontestável no setor de soldagem no Centro-Oeste, reconhecida pela excelência técnica e compromisso inabalável com a inovação.",
            icon: <Eye size={32} className="text-servweld-blue" />
        },
        {
            title: "Valores",
            desc: "Ética, transparência, responsabilidade socioambiental e uma paixão técnica pelo que fazemos todos os dias há mais de duas décadas.",
            icon: <Heart size={32} className="text-servweld-blue" />
        }
    ];


    return (
        <>
            <SEO
                title="Contato e Nossa História"
                description="Conheça a história da Servweld, nossa missão, visão e valores. Entre em contato conosco para locação, assistência e vendas em Brasília."
            />

            <div className="bg-white">
                {/* Image Lightbox Modal */}
                {selectedImg && (
                    <div
                        className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 cursor-zoom-out"
                        onClick={() => setSelectedImg(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="relative max-w-5xl max-h-[90vh]"
                        >
                            <img
                                src={selectedImg.includes('http') ? selectedImg : `/assets/images/quem_somos/${selectedImg}`}
                                alt="Expanded"
                                className="w-full h-full object-contain rounded-xl shadow-2xl"
                            />
                            <button className="absolute -top-12 right-0 text-white font-bold flex items-center gap-2 hover:text-servweld-blue">
                                <Zap size={20} /> Fechar
                            </button>
                        </motion.div>
                    </div>
                )}

                {/* Hero Section */}
                <section className="relative py-24 bg-servweld-black overflow-hidden">
                    <div className="absolute inset-0 opacity-10">
                        <img
                            src="/assets/images/quem_somos/unnamed (3).jpg"
                            alt="Background"
                            className="w-full h-full object-cover blur-sm"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-servweld-black via-servweld-black/80 to-transparent" />
                    </div>

                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-4xl md:text-6xl font-black text-white mb-6 uppercase tracking-tight"
                        >
                            Contato & <span className="text-servweld-blue">Nossa História</span>
                        </motion.h1>
                        <p className="text-xl text-gray-400 max-w-2xl mx-auto font-medium">
                            Expertise técnica e confiança construída ao longo de 25 anos atendendo a indústria do Distrito Federal.
                        </p>
                    </div>
                </section>

                {/* Statistics */}
                <section className="relative -mt-12 z-20 px-4">
                    <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
                        {stats.map((stat, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 text-center"
                            >
                                <div className="flex justify-center mb-2">{stat.icon}</div>
                                <div className="text-3xl font-black text-servweld-black">{stat.value}</div>
                                <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">{stat.label}</div>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* History Section */}
                <section className="py-24">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                            <motion.div
                                initial={{ opacity: 0, x: -30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                            >
                                <h2 className="text-3xl md:text-4xl font-black text-servweld-black mb-8">
                                    Uma Jornada de <span className="text-servweld-blue">Excelência</span>
                                </h2>
                                <div className="space-y-6 text-gray-600 text-lg leading-relaxed">
                                    <p>
                                        A história da <strong>Servweld</strong> se confunde com o crescimento industrial de Brasília. Fundada como parte de um grupo com mais de 25 anos de tradição, nascemos com a missão de elevar o padrão de serviços de soldagem e corte no Distrito Federal.
                                    </p>
                                    <p>
                                        Desde o início, entendemos que máquinas de solda não são apenas ferramentas, mas o coração da produtividade de nossos clientes. Por isso, investimos pesado em conhecimento técnico e peças originais, tornando-nos referência em assistência técnica multimarcas.
                                    </p>
                                    <p>
                                        Hoje, operamos em uma estrutura moderna no Guará, oferecendo desde a locação ágil de equipamentos de alta tecnologia até a consultoria de processos para grandes indústrias e oficinas especializadas.
                                    </p>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, x: 30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                className="relative"
                            >
                                <div className="rounded-3xl overflow-hidden shadow-2xl border-8 border-gray-50 bg-gray-200 aspect-[4/3]">
                                    <img
                                        src="/assets/images/quem_somos/SAE Ouro 2024!!! Obrigado @esab_brasil aqui a parceria é forte!!.jpg"
                                        alt="Servweld Unidade Brasília"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="absolute -bottom-6 -right-6 bg-servweld-blue p-8 rounded-2xl shadow-xl hidden md:block">
                                    <div className="text-white text-center">
                                        <div className="text-4xl font-black mb-1">4.9</div>
                                        <div className="flex justify-center mb-2">
                                            {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="white" />)}
                                        </div>
                                        <div className="text-[10px] font-bold uppercase tracking-widest opacity-80">Avaliação no Google</div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* Photo Carousel [INFINITE & EXPANDABLE] */}
                <section className="py-12 bg-servweld-black overflow-hidden relative">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 flex flex-col md:flex-row justify-between items-end gap-4">
                        <div>
                            <h2 className="text-2xl md:text-3xl font-black text-white mb-2 uppercase tracking-tight">
                                Nossa <span className="text-servweld-blue">Operação</span> em Detalhes
                            </h2>
                            <p className="text-gray-400 text-sm max-w-xl">
                                Clique para expandir as imagens.
                            </p>
                        </div>
                    </div>

                    <div className="relative">
                        {galleryImages.length > 0 && (
                            <motion.div
                                animate={{ x: [0, -15 * galleryImages.length * 10] }}
                                transition={{
                                    x: {
                                        repeat: Infinity,
                                        repeatType: "loop",
                                        duration: galleryImages.length * 3,
                                        ease: "linear",
                                    },
                                }}
                                className="flex gap-4 cursor-pointer"
                            >
                                {[...galleryImages, ...galleryImages, ...galleryImages].map((img, i) => (
                                    <motion.div
                                        key={i}
                                        whileHover={{ scale: 1.05 }}
                                        onClick={() => setSelectedImg(img)}
                                        className="w-32 h-32 md:w-48 md:h-48 rounded-lg overflow-hidden bg-gray-900 border border-white/5 shadow-lg shrink-0 transition-transform"
                                    >
                                        <img
                                            src={img.includes('http') ? img : `/assets/images/quem_somos/${img}`}
                                            alt={`Slide ${i}`}
                                            className="w-full h-full object-cover select-none"
                                        />
                                    </motion.div>
                                ))}
                            </motion.div>
                        )}
                    </div>
                </section>

                {/* Mission Vision Values */}
                <section className="py-24 bg-gray-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {values.map((v, i) => (
                                <motion.div
                                    key={i}
                                    whileHover={{ y: -10 }}
                                    className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100"
                                >
                                    <div className="mb-6">{v.icon}</div>
                                    <h3 className="text-2xl font-bold mb-4">{v.title}</h3>
                                    <p className="text-gray-500 leading-relaxed italic">{v.desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Contact Channels */}
                <section className="py-24">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-black text-servweld-black mb-4 uppercase">Canais de Atendimento</h2>
                            <p className="text-gray-500 font-medium">Escolha a melhor forma de falar com nosso time comercial ou técnico.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {/* WhatsApp Card */}
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                className="p-8 bg-green-50 rounded-3xl border border-green-100 flex flex-col items-center text-center group"
                            >
                                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-[#25D366] mb-6 shadow-sm group-hover:bg-[#25D366] group-hover:text-white transition-all">
                                    <MessageSquare size={32} />
                                </div>
                                <h3 className="text-xl font-bold mb-2">WhatsApp Direct</h3>
                                <p className="text-gray-600 mb-6 text-sm">Resposta rápida para orçamentos e dúvidas técnicas.</p>
                                <a
                                    href={`https://wa.me/${whatsapp}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-[#25D366] text-white px-8 py-3 rounded-xl font-bold hover:opacity-90 transition-all flex items-center gap-2"
                                >
                                    {whatsapp_display}
                                </a>
                            </motion.div>

                            {/* Email Card */}
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                className="p-8 bg-blue-50 rounded-3xl border border-blue-100 flex flex-col items-center text-center group"
                            >
                                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-servweld-blue mb-6 shadow-sm group-hover:bg-servweld-blue group-hover:text-white transition-all">
                                    <Mail size={32} />
                                </div>
                                <h3 className="text-xl font-bold mb-2">E-mail Comercial</h3>
                                <p className="text-gray-600 mb-6 text-sm">Ideal para envio de ordens de serviço e solicitações formais.</p>
                                <a
                                    href={`mailto:${email}`}
                                    className="text-servweld-blue font-bold hover:underline"
                                >
                                    {email}
                                </a>
                            </motion.div>

                            {/* Clock Card */}
                            <motion.div
                                className="p-8 bg-gray-50 rounded-3xl border border-gray-100 flex flex-col items-center text-center"
                            >
                                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-servweld-black mb-6 shadow-sm">
                                    <Clock size={32} />
                                </div>
                                <h3 className="text-xl font-bold mb-2">Horário Comercial</h3>
                                <p className="text-gray-600 text-sm">
                                    Segunda a Sexta<br />
                                    08:00 às 18:00
                                </p>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* Location Section */}
                <section className="py-24 bg-servweld-black text-white overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-1/3 h-full bg-servweld-blue/5 skew-x-12 transform origin-top translate-x-20" />

                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                            <div>
                                <h2 className="text-3xl md:text-5xl font-black mb-8 leading-tight">
                                    Sua Parceria Técnica <br />
                                    <span className="text-servweld-blue">Começa Aqui.</span>
                                </h2>
                                <div className="space-y-6">
                                    <div className="flex gap-4">
                                        <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center shrink-0">
                                            <MapPin className="text-servweld-blue" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-lg">Nossa Unidade Guará</p>
                                            <p className="text-gray-400">
                                                SQPS 104 Quadra 05 Conjunto A Lote 05 Loja 02<br />
                                                Brasília - DF, 71215-226
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex gap-4">
                                        <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center shrink-0">
                                            <Phone className="text-servweld-blue" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-lg">Telefone Fixo</p>
                                            <p className="text-gray-400">(61) 3234-6622</p>
                                        </div>
                                    </div>
                                </div>

                                <a
                                    href="https://www.google.com/maps/place/Servweld+%2F+Servsolda+Assist%C3%AAncia+T%C3%A9cnica,+Loca%C3%A7%C3%A3o+e+M%C3%A1quinas+de+Solda/@-15.8204163,-47.9590714,17z/data=!3m1!4b1!4m6!3m5!1s0x935a303214e58247:0x9f22315243aef2c3!8m2!3d-15.8204163!4d-47.9564965!16s%2Fg%2F1v75s_6n?entry=ttu"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mt-12 inline-flex items-center gap-3 bg-servweld-blue text-white font-bold py-4 px-10 rounded-xl hover:bg-white hover:text-servweld-blue transition-all"
                                >
                                    Ver no Google Maps
                                </a>
                            </div>

                            <div className="h-[450px] rounded-3xl overflow-hidden shadow-2xl border-4 border-white/10">
                                <iframe
                                    title="Localização"
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3838.293149506634!2d-47.9564965!3d-15.8204163!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x935a303214e58247%3A0x9f22315243aef2c3!2sServweld%20%2F%20Servsolda%20Assist%C3%AAncia%20T%C3%A9cnica%2C%20Loca%C3%A7%C3%A3o%20e%20M%C3%A1quinas%20de%20Solda!5e0!3m2!1spt-BR!2sbr!4v1710000000000!5m2!1spt-BR!2sbr"
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    allowFullScreen=""
                                    loading="lazy"
                                />
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
};

export default Contact;
