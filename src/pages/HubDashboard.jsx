import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { 
    LayoutDashboard, 
    LogOut, 
    ExternalLink, 
    ShieldCheck, 
    Settings, 
    Layers,
    ChevronRight,
    Search,
    Briefcase
} from 'lucide-react';
import { motion } from 'framer-motion';

const HubDashboard = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [tools, setTools] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        checkUser();
        fetchTools();
    }, []);

    const checkUser = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            navigate('/restrito?reason=expired');
        } else {
            setUser(user);
        }
    };

    const fetchTools = async () => {
        // For now, we'll use static tools until we create the DB table
        const defaultTools = [
            {
                id: 'credos',
                name: 'Credos',
                description: 'Sistema de Gestão de Soldagem e Rastreabilidade',
                url: 'http://167.234.252.109/login',
                icon: 'ShieldCheck',
                color: 'from-blue-600 to-indigo-600'
            },
            {
                id: 'translator',
                name: 'Tradutor PDF',
                description: 'Serviço inteligente de tradução de documentos técnicos',
                url: 'http://167.234.252.109:8000',
                icon: 'Layers',
                color: 'from-emerald-500 to-teal-600'
            },
            {
                id: 'resumes',
                name: 'Banco de Currículos',
                description: 'Acesse e gerencie os currículos dos candidatos pelo site',
                url: '/admin?tab=resumes',
                icon: 'Briefcase',
                color: 'from-amber-400 to-orange-500'
            }
        ];
        
        // In the future: const { data } = await supabase.from('internal_tools').select('*').eq('is_active', true);
        setTools(defaultTools);
        setLoading(false);
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/restrito');
    };

    const filteredTools = tools.filter(tool => 
        tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleToolAccess = async (e, tool) => {
        if (!tool.url || tool.url === '#') return;
        
        e.preventDefault();
        
        // Se for um link externo, geramos o token de SSO
        if (tool.url.startsWith('http')) {
            try {
                // Expiração em 1 minuto para o token inicial
                const expiresAt = new Date(Date.now() + 60000).toISOString();
                
                const { data, error } = await supabase
                    .from('sso_tokens')
                    .insert([{ 
                        user_id: user.id,
                        user_email: user.email,
                        expires_at: expiresAt
                    }])
                    .select('id')
                    .single();

                if (error) throw error;

                const url = new URL(tool.url);
                url.searchParams.set('sso_token', data.id);
                window.open(url.toString(), '_blank');
            } catch (err) {
                console.error('Erro ao gerar token SSO:', err);
                window.open(tool.url, '_blank');
            }
        } else {
            window.open(tool.url, '_blank');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#fafafa] flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-servweld-blue/20 border-t-servweld-blue rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#fcfcfc] text-slate-900 font-sans">
            {/* Sidebar / Header Navigation */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-auto flex items-center justify-center p-1">
                            <img src="/assets/logo/LOGO.png" alt="Servweld" className="h-full w-auto object-contain" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold tracking-tight">Hub Servweld</h1>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Workspace Central</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="hidden md:flex flex-col items-end">
                            <span className="text-sm font-bold text-slate-700">{user?.email}</span>
                            <span className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest">On-line</span>
                        </div>
                        <button 
                            onClick={handleLogout}
                            className="p-3 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all group"
                            title="Sair"
                        >
                            <LogOut size={20} className="group-hover:-translate-x-0.5 transition-transform" />
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 py-12">
                {/* Search & Filter */}
                <div className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h2 className="text-3xl font-bold text-slate-900">Bem-vindo ao Hub</h2>
                        <p className="text-slate-500 mt-2 font-medium">Selecione uma ferramenta para começar seu trabalho.</p>
                    </div>

                    <div className="relative group max-w-md w-full">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-servweld-blue transition-colors" size={18} />
                        <input 
                            type="text"
                            placeholder="Buscar ferramenta..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-servweld-blue/5 focus:border-servweld-blue outline-none transition-all shadow-sm"
                        />
                    </div>
                </div>

                {/* Grid of Tools */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredTools.map((tool, index) => (
                        <motion.a
                            key={tool.id}
                            href={tool.url}
                            onClick={(e) => handleToolAccess(e, tool)}
                            target="_blank"
                            rel="noopener noreferrer"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="group relative bg-white border border-slate-200 rounded-[2rem] p-8 hover:border-servweld-blue hover:shadow-2xl hover:shadow-servweld-blue/5 transition-all duration-500 overflow-hidden"
                        >
                            {/* Decorative Background */}
                            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${tool.color} opacity-[0.03] group-hover:opacity-[0.08] transition-opacity rounded-bl-[5rem]`} />
                            
                            <div className="flex flex-col h-full items-center text-center">
                                <div className={`w-20 h-20 bg-gradient-to-tr ${tool.color} rounded-2xl flex items-center justify-center text-white mb-8 shadow-xl shadow-blue-200/50 group-hover:scale-110 transition-transform duration-500 overflow-hidden`}>
                                    {tool.image_url ? (
                                        <img src={tool.image_url} alt={tool.name} className="w-full h-full object-cover" />
                                    ) : (
                                        tool.icon === 'ShieldCheck' ? <ShieldCheck size={36} /> : 
                                        tool.icon === 'Layers' ? <Layers size={36} /> : 
                                        tool.icon === 'Briefcase' ? <Briefcase size={36} /> : 
                                        <Settings size={36} />
                                    )}
                                </div>

                                <div className="flex-grow">
                                    <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-servweld-blue transition-colors">{tool.name}</h3>
                                    <p className="text-slate-500 leading-relaxed font-medium px-4">{tool.description}</p>
                                </div>

                                <div className="mt-10 flex items-center justify-center gap-4 w-full">
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest group-hover:text-servweld-blue transition-colors flex items-center gap-2">
                                        Acessar Sistema
                                        <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                    </span>
                                    <ExternalLink size={18} className="text-slate-200 group-hover:text-servweld-blue transition-colors" />
                                </div>
                            </div>
                        </motion.a>
                    ))}

                    {/* Add More Tool Placeholder (Admin only in future) */}
                    <div className="border-2 border-dashed border-slate-200 rounded-[2rem] p-8 flex flex-col items-center justify-center text-center opacity-40 hover:opacity-100 hover:border-servweld-blue hover:bg-blue-50/30 transition-all duration-500 cursor-pointer group">
                        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-4 group-hover:bg-servweld-blue/10 transition-colors">
                            <Settings size={24} className="text-slate-400 group-hover:text-servweld-blue transition-colors" />
                        </div>
                        <span className="text-sm font-bold text-slate-500 group-hover:text-servweld-blue transition-colors">Novos sistemas em breve</span>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="max-w-7xl mx-auto px-6 py-12 border-t border-slate-100 mt-12">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-slate-400 text-sm font-medium">© {new Date().getFullYear()} Servweld Intelligence Technology</p>
                    <div className="flex items-center gap-6">
                        <button className="text-slate-400 hover:text-slate-600 text-sm font-bold">Suporte</button>
                        <button className="text-slate-400 hover:text-slate-600 text-sm font-bold">Documentação</button>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default HubDashboard;
