import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Instagram, Linkedin, Facebook } from 'lucide-react';
import { useContact } from '../context/ContactContext';

const Footer = () => {
    const { whatsapp, whatsapp_display, email } = useContact();
    return (
        <footer className="bg-servweld-black text-white pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                    {/* Brand and Description */}
                    <div className="col-span-1 md:col-span-1">
                        <div className="flex items-center mb-6">
                            <img
                                src="/assets/logo/LOGO.png"
                                alt=""
                                className="h-20 w-auto object-contain brightness-0 invert"
                                onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.nextSibling.classList.remove('hidden');
                                }}
                            />
                            <span className="hidden text-2xl font-bold text-white">SERVWELD</span>
                        </div>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Soluções de alta performance em equipamentos de solda e corte. Locação, assistência técnica e venda de consumíveis com qualidade garantida.
                        </p>
                        <div className="flex space-x-4 mt-6">
                            <a href="https://www.instagram.com/servweld" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-servweld-blue border border-gray-800 p-2 rounded-full transition-all"><Instagram size={20} /></a>
                            <a href="https://www.facebook.com/servweld" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-servweld-blue border border-gray-800 p-2 rounded-full transition-all"><Facebook size={20} /></a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="col-span-1">
                        <h4 className="text-lg font-semibold mb-6">Navegação</h4>
                        <ul className="space-y-4">
                            <li><Link to="/" className="text-gray-400 hover:text-white transition-colors">Home</Link></li>
                            <li><Link to="/locacao" className="text-gray-400 hover:text-white transition-colors">Locação</Link></li>
                            <li><Link to="/assistencia" className="text-gray-400 hover:text-white transition-colors">Assistência Técnica</Link></li>
                            <li><Link to="/trabalhe-conosco" className="text-gray-400 hover:text-white transition-colors">Trabalhe Conosco</Link></li>
                            <li><Link to="/venda" className="text-gray-400 hover:text-white transition-colors">Venda de Equipamentos</Link></li>
                            <li><Link to="/equipamentos" className="text-gray-400 hover:text-white transition-colors">Equipamentos e Serviços</Link></li>
                            <li className="pt-2">
                                <Link to="/restrito" className="inline-flex items-center gap-2 text-servweld-blue hover:text-blue-400 font-bold transition-all group text-sm">
                                    <svg 
                                        width="16" 
                                        height="16" 
                                        viewBox="0 0 24 24" 
                                        fill="none" 
                                        stroke="currentColor" 
                                        strokeWidth="2.5" 
                                        strokeLinecap="round" 
                                        strokeLinejoin="round"
                                        className="group-hover:rotate-12 transition-transform"
                                    >
                                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                                    </svg>
                                    Portal do Colaborador
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div className="col-span-1">
                        <h4 className="text-lg font-semibold mb-6">Contato</h4>
                        <ul className="space-y-4">
                            <li className="flex items-center gap-3 text-gray-400">
                                <Phone size={18} className="text-servweld-blue" />
                                {whatsapp_display}
                            </li>
                            <li className="flex items-center gap-3 text-gray-400">
                                <Mail size={18} className="text-servweld-blue" />
                                <a href={`mailto:${email}`} className="hover:text-white transition-colors">{email}</a>
                            </li>
                            <li className="flex items-start gap-3 text-gray-400">
                                <MapPin size={18} className="text-servweld-blue mt-1 shrink-0" />
                                SQPS 104 Quadra 05 Conjunto A Lote 05 Loja 02<br />Zona Industrial: Guará - Brasília - DF<br />CEP 71215-226
                            </li>
                        </ul>
                    </div>

                    {/* Newsletter/CTA */}
                    <div className="col-span-1">
                        <h4 className="text-lg font-semibold mb-6">Fale Conosco</h4>
                        <p className="text-gray-400 text-sm mb-4">Dúvidas ou orçamentos? Respondemos rápido via WhatsApp.</p>
                        <a
                            href={`https://wa.me/${whatsapp}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block bg-servweld-blue hover:opacity-90 text-white px-6 py-2 rounded-md font-medium transition-all"
                        >
                            WhatsApp
                        </a>
                    </div>
                </div>

                <div className="border-t border-gray-800 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center">
                    <p className="text-gray-500 text-sm">
                        &copy; {new Date().getFullYear()} Servweld. Todos os direitos reservados.
                    </p>
                    <Link 
                        to="/restrito" 
                        className="text-gray-900/5 hover:text-gray-500/20 transition-all duration-700 p-2 rounded-full group"
                        title="Portal Interno"
                    >
                        <div className="group-hover:rotate-180 transition-transform duration-1000">
                            <svg 
                                width="12" 
                                height="12" 
                                viewBox="0 0 24 24" 
                                fill="none" 
                                stroke="currentColor" 
                                strokeWidth="2" 
                                strokeLinecap="round" 
                                strokeLinejoin="round"
                            >
                                <path d="M12.22 2h-.44a2 2 0 0 0-2 2 2 2 0 0 1-2 2 2 2 0 0 0-2 2 2 2 0 0 1-2 2 2 2 0 0 0-2 2v.44a2 2 0 0 0 2 2 2 2 0 0 1 2 2 2 2 0 0 0 2 2 2 2 0 0 1 2 2 2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2 2 2 0 0 1 2-2 2 2 0 0 0 2-2 2 2 0 0 1 2-2 2 2 0 0 0 2-2v-.44a2 2 0 0 0-2-2 2 2 0 0 1-2-2 2 2 0 0 0-2-2 2 2 0 0 1-2-2 2 2 0 0 0-2-2z" />
                                <circle cx="12" cy="12" r="3" />
                            </svg>
                        </div>
                    </Link>
                    <p className="text-gray-500 text-sm mt-4 md:mt-0">
                        Desenvolvido por Fernando_M_Aragao
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
