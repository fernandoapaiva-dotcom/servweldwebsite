import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { 
    Search, 
    Filter, 
    Download, 
    FileText, 
    Loader2, 
    Trash2, 
    Calendar,
    Phone,
    Mail,
    ChevronRight,
    Briefcase
} from 'lucide-react';
import { motion } from 'framer-motion';

const ResumeManagement = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterArea, setFilterArea] = useState('');
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

    const areas = [
        "Área Comercial / Vendas",
        "Estoque / Logística",
        "Financeiro",
        "Assistência Técnica (Máquinas de Solda)",
        "Motorista",
        "Outros"
    ];

    useEffect(() => {
        fetchApplications();
    }, []);

    const fetchApplications = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('job_applications')
            .select('*')
            .order('created_at', { ascending: false });

        if (!error && data) {
            setApplications(data);
        }
        setLoading(false);
    };

    const handleDelete = async (id) => {
        const { error } = await supabase
            .from('job_applications')
            .delete()
            .eq('id', id);

        if (!error) {
            setApplications(applications.filter(app => app.id !== id));
            setShowDeleteConfirm(null);
        }
    };

    const filteredApplications = applications.filter(app => {
        const matchesSearch = app.full_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             app.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesArea = filterArea === '' || app.area === filterArea;
        return matchesSearch && matchesArea;
    });

    if (loading) {
        return (
            <div className="p-20 flex flex-col items-center justify-center text-gray-400">
                <Loader2 className="animate-spin text-servweld-blue mb-4" size={40} />
                <p className="font-medium">Carregando banco de currículos...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header / Stats */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <Briefcase className="text-servweld-blue" size={24} />
                        Banco de Talentos
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">Gerencie os currículos recebidos pelo site.</p>
                </div>
                <div className="bg-servweld-blue/5 px-4 py-2 rounded-xl border border-servweld-blue/10">
                    <span className="text-xs font-bold text-servweld-blue uppercase tracking-widest">Total Recebido</span>
                    <p className="text-2xl font-black text-servweld-blue">{applications.length}</p>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-gray-50 p-4 rounded-2xl flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input 
                        type="text" 
                        placeholder="Buscar por nome ou e-mail..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-white border border-transparent rounded-xl focus:ring-2 focus:ring-servweld-blue outline-none transition-all"
                    />
                </div>
                <div className="relative w-full md:w-64">
                    <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <select 
                        value={filterArea}
                        onChange={(e) => setFilterArea(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-white border border-transparent rounded-xl focus:ring-2 focus:ring-servweld-blue outline-none transition-all appearance-none cursor-pointer"
                    >
                        <option value="">Todas as Áreas</option>
                        {areas.map((area, idx) => (
                            <option key={idx} value={area}>{area}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* List */}
            <div className="grid grid-cols-1 gap-4">
                {filteredApplications.length === 0 ? (
                    <div className="p-20 text-center bg-white border border-dashed border-gray-200 rounded-3xl text-gray-400">
                        <FileText size={48} className="mx-auto mb-4 opacity-20" />
                        <p>Nenhum currículo encontrado com os filtros atuais.</p>
                    </div>
                ) : (
                    filteredApplications.map((app) => (
                        <motion.div 
                            key={app.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow group flex flex-col md:flex-row items-center gap-6"
                        >
                            <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-servweld-blue shrink-0 group-hover:bg-servweld-blue group-hover:text-white transition-all">
                                <FileText size={28} />
                            </div>

                            <div className="flex-1 text-center md:text-left">
                                <h3 className="text-lg font-bold text-gray-900">{app.full_name}</h3>
                                <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-2 text-sm text-gray-500">
                                    <span className="flex items-center gap-1.5"><Mail size={14} className="text-gray-400" /> {app.email}</span>
                                    <span className="flex items-center gap-1.5"><Phone size={14} className="text-gray-400" /> {app.phone}</span>
                                </div>
                                <div className="mt-3 flex flex-wrap justify-center md:justify-start gap-2">
                                    <span className="px-3 py-1 bg-servweld-blue/5 text-servweld-blue text-[10px] font-bold uppercase tracking-widest rounded-full border border-servweld-blue/10">
                                        {app.area}
                                    </span>
                                    <span className="px-3 py-1 bg-gray-50 text-gray-400 text-[10px] font-bold uppercase tracking-widest rounded-full flex items-center gap-1">
                                        <Calendar size={10} /> {new Date(app.created_at).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <a 
                                    href={app.resume_url} 
                                    target="_blank" 
                                    rel="noreferrer"
                                    className="p-3 bg-servweld-blue text-white rounded-xl shadow-lg shadow-servweld-blue/20 hover:scale-105 transition-transform flex items-center gap-2 font-bold text-sm"
                                >
                                    <Download size={18} />
                                    Baixar PDF
                                </a>
                                
                                <button 
                                    onClick={() => setShowDeleteConfirm(app.id)}
                                    className="p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                    title="Excluir"
                                >
                                    <Trash2 size={20} />
                                </button>
                            </div>

                            {showDeleteConfirm === app.id && (
                                <div className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-4">
                                    <div className="bg-white p-8 rounded-[2rem] max-w-sm w-full shadow-2xl">
                                        <h4 className="text-xl font-bold mb-4">Excluir Currículo?</h4>
                                        <p className="text-gray-500 mb-8">Esta ação é irreversível. O currículo de <strong>{app.full_name}</strong> será removido permanentemente.</p>
                                        <div className="flex gap-4">
                                            <button 
                                                onClick={() => setShowDeleteConfirm(null)}
                                                className="flex-1 py-3 bg-gray-100 text-gray-600 font-bold rounded-xl"
                                            >
                                                Cancelar
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(app.id)}
                                                className="flex-1 py-3 bg-red-500 text-white font-bold rounded-xl shadow-lg shadow-red-500/20"
                                            >
                                                Excluir
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    ))
                )}
            </div>
            
            <div className="p-6 bg-blue-50 rounded-3xl border border-blue-100 flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-servweld-blue shadow-sm">
                    <ChevronRight size={24} />
                </div>
                <div className="text-sm">
                    <p className="font-bold text-blue-900">Dica do Recrutador</p>
                    <p className="text-blue-700">Mantenha seu banco de talentos limpo. Remova currículos que já foram processados ou que não atendem aos critérios mínimos.</p>
                </div>
            </div>
        </div>
    );
};

export default ResumeManagement;
