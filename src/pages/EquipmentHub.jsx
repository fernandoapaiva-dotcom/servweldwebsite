import { motion } from 'framer-motion';
import { Wrench, Zap, Fuel, Target, Cpu, ShieldCheck } from 'lucide-react';
import SEO from '../components/SEO';

const EquipmentHub = () => {
    const categories = [
        {
            title: "Soldagem MIG/MAG & TIG",
            icon: <Zap className="text-servweld-blue" size={32} />,
            items: [
                "Máquinas MIG/MAG (Alimentador Interno e Externo)",
                "Equipamentos TIG DC e TIG AC/DC",
                "Inversores de Solda Profissionais",
                "Retificadores e Transformadores de Solda",
                "Máquinas de Solda Ponto",
                "Alimentadores de Arame Automáticos",
                "Ignitores de Alta Frequência"
            ]
        },
        {
            title: "Corte e Automação",
            icon: <Cpu className="text-servweld-blue" size={32} />,
            items: [
                "Máquinas de Corte Plasma",
                "CNC de Corte e Furação",
                "Tartarugas de Corte Automáticas",
                "Maçaricos de Corte e Solda",
                "Arco Submerso",
                "Unidades de Refrigeração para Tochas"
            ]
        },
        {
            title: "Reparação Automotiva (Funilaria)",
            icon: <Target className="text-servweld-blue" size={32} />,
            items: [
                "Máquinas de Repuxo (Spotter / Spotcar)",
                "Painéis de Secagem Infravermelho",
                "Teste e Carregadores de Baterias",
                "Compressores de Ar Industriais",
                "Filtros de Ar e Reguladores"
            ]
        },
        {
            title: "Tochas e Consumíveis",
            icon: <Wrench className="text-servweld-blue" size={32} />,
            items: [
                "Tochas de Solda MIG/MAG e TIG",
                "Tochas de Corte Plasma e Goivagem",
                "Eletrodos, Arames e Varetas",
                "Bicos, Bocais e Difusores para Tochas",
                "Reguladores de Pressão para Gases"
            ]
        },
        {
            title: "Gases Industriais",
            icon: <Fuel className="text-servweld-blue" size={32} />,
            items: [
                "Gás Argônio (Puro e Mistura)",
                "Oxigênio e Acetileno para Corte",
                "Nitrogênio Industrial",
                "Mistura CO2 com Argônio para Solda",
                "Gases Especiais sob consulta"
            ]
        }
    ];

    const schema = {
        "@context": "https://schema.org",
        "@type": "Service",
        "name": "Catálogo Técnico de Equipamentos e Serviços Servweld",
        "provider": {
            "@type": "LocalBusiness",
            "name": "Servweld"
        },
        "description": "Lista completa de equipamentos para solda, corte, reparação e gases industriais atendidos pela Servweld."
    };

    return (
        <>
            <SEO 
                title="Equipamentos e Serviços Técnicos"
                description="Consulte nossa lista completa de equipamentos de soldagem, corte e suporte técnico: MIG, TIG, Plasma, Spotter, Gases Industriais e mais."
                keywords="MIG, MAG, TIG, Corte Plasma, Maçarico, Spotter, Argônio, Nitrogênio, CNC, Solda Ponto"
                schema={schema}
            />

            <div className="bg-gray-50 min-h-screen py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <motion.h1 
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-4xl md:text-5xl font-black mb-6 text-servweld-black"
                        >
                            Índice Técnico de Equipamentos
                        </motion.h1>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Consulte as tecnologias e processos que atendemos através de locação, venda e assistência técnica especializada.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {categories.map((cat, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 hover:shadow-xl transition-all group"
                            >
                                <div className="w-16 h-16 bg-servweld-blue/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-servweld-blue group-hover:text-white transition-all duration-300">
                                    {cat.icon}
                                </div>
                                <h2 className="text-2xl font-bold mb-6 text-servweld-black">{cat.title}</h2>
                                <ul className="space-y-3">
                                    {cat.items.map((item, i) => (
                                        <li key={i} className="flex items-start gap-2 text-gray-600">
                                            <ShieldCheck size={18} className="text-green-500 shrink-0 mt-1" />
                                            <span className="text-sm font-medium">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>
                        ))}
                    </div>

                    <div className="mt-20 p-12 bg-servweld-blue rounded-[3rem] text-center text-white">
                        <h2 className="text-3xl font-bold mb-6">Não encontrou o que procurava?</h2>
                        <p className="text-blue-100 text-lg mb-10 max-w-2xl mx-auto">
                            Trabalhamos com uma vasta linha de acessórios e componentes técnicos não listados. 
                            Fale com nosso suporte para consultas específicas.
                        </p>
                        <a 
                            href="https://wa.me/556132346622" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="bg-white text-servweld-blue px-10 py-4 rounded-xl font-bold hover:bg-gray-100 transition-all inline-block"
                        >
                            Consultar Especialista
                        </a>
                    </div>
                </div>
            </div>
        </>
    );
};

export default EquipmentHub;
