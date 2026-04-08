import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    FileText, 
    Upload, 
    CheckCircle, 
    AlertCircle, 
    Loader2, 
    Send,
    Briefcase,
    Phone,
    Mail,
    User
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import SEO from '../components/SEO';

const Careers = () => {
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState(null);
    const [file, setFile] = useState(null);
    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        phone: '',
        area: ''
    });

    const areas = [
        "Área Comercial / Vendas",
        "Estoque / Logística",
        "Financeiro",
        "Assistência Técnica (Máquinas de Solda)",
        "Motorista",
        "Outros"
    ];

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile && selectedFile.type === 'application/pdf') {
            if (selectedFile.size > 5 * 1024 * 1024) {
                setError('O arquivo é muito grande. O limite é de 5MB.');
                setFile(null);
            } else {
                setFile(selectedFile);
                setError(null);
            }
        } else {
            setError('Por favor, selecione um arquivo em formato PDF.');
            setFile(null);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (!file) throw new Error('Por favor, anexe o seu currículo em PDF.');
            if (!formData.area) throw new Error('Por favor, selecione a área de interesse.');

            // 1. Upload File to Supabase Storage
            const fileExt = file.name.split('.').pop();
            const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
            const filePath = `resumes/${fileName}`;

            const { error: uploadError, data: uploadData } = await supabase.storage
                .from('resumes')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            // 2. Get Public URL
            const { data: { publicUrl } } = supabase.storage
                .from('resumes')
                .getPublicUrl(filePath);

            // 3. Save to Database
            const { error: dbError } = await supabase
                .from('job_applications')
                .insert([{
                    full_name: formData.full_name,
                    email: formData.email,
                    phone: formData.phone,
                    area: formData.area,
                    resume_url: publicUrl
                }]);

            if (dbError) throw dbError;

            // 4. Trigger Email Notification (Edge Function)
            await supabase.functions.invoke('notify-resume', { 
                body: { ...formData, resume_url: publicUrl } 
            });

            setSubmitted(true);
        } catch (err) {
            console.error(err);
            setError(err.message || 'Ocorreu um erro ao enviar seu currículo. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <SEO 
                title="Trabalhe Conosco" 
                description="Faça parte do time Servweld. Envie seu currículo e junte-se à maior referência em soldagem do Centro-Oeste."
            />

            <div className="min-h-screen bg-gray-50 pb-20">
                {/* Hero Section */}
                <section className="relative py-24 bg-servweld-black overflow-hidden mt-16 md:mt-0">
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute inset-0 bg-gradient-to-br from-servweld-blue to-transparent" />
                    </div>
                    
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="inline-flex items-center gap-2 bg-servweld-blue/20 text-servweld-blue px-4 py-2 rounded-full font-bold uppercase tracking-widest text-xs mb-8 border border-servweld-blue/30"
                        >
                            <Briefcase size={14} /> Carreira na Servweld
                        </motion.div>
                        <h1 className="text-4xl md:text-7xl font-black text-white mb-6 uppercase tracking-tight">
                            Venha Soldar o <span className="text-servweld-blue">Futuro</span> Conosco
                        </h1>
                        <p className="text-xl text-gray-400 max-w-2xl mx-auto font-medium">
                            Se você é apaixonado por tecnologia industrial e excelência técnica, queremos você no nosso time.
                        </p>
                    </div>
                </section>

                <main className="max-w-3xl mx-auto px-4 -mt-12 relative z-20">
                    <div className="bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 overflow-hidden">
                        <AnimatePresence mode="wait">
                            {submitted ? (
                                <motion.div 
                                    key="success"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="p-12 md:p-20 text-center"
                                >
                                    <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8">
                                        <CheckCircle size={48} />
                                    </div>
                                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Currículo Enviado!</h2>
                                    <p className="text-gray-500 text-lg mb-10 leading-relaxed">
                                        Obrigado pelo seu interesse na Servweld. Seus dados foram salvos em nosso banco de talentos e o setor comercial receberá sua notificação em breve. Boa sorte!
                                    </p>
                                    <button 
                                        onClick={() => window.location.href = '/'}
                                        className="bg-servweld-blue text-white px-10 py-4 rounded-xl font-bold hover:bg-opacity-90 transition-all shadow-lg shadow-servweld-blue/20"
                                    >
                                        Voltar para o Início
                                    </button>
                                </motion.div>
                            ) : (
                                <motion.div 
                                    key="form"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="p-8 md:p-12"
                                >
                                    <div className="flex items-center gap-4 mb-10 border-b border-gray-50 pb-8">
                                        <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center text-servweld-blue">
                                            <FileText size={24} />
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-bold text-gray-900">Formulário de Candidatura</h2>
                                            <p className="text-sm text-gray-400">Preencha seus dados profissionais abaixo.</p>
                                        </div>
                                    </div>

                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                                                    <User size={16} className="text-servweld-blue" /> Nome Completo
                                                </label>
                                                <input 
                                                    type="text" 
                                                    required
                                                    value={formData.full_name}
                                                    onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                                                    placeholder="Como prefere ser chamado?"
                                                    className="w-full px-5 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:ring-4 focus:ring-servweld-blue/5 focus:border-servweld-blue outline-none transition-all placeholder:text-gray-300"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                                                    <Mail size={16} className="text-servweld-blue" /> E-mail Profissional
                                                </label>
                                                <input 
                                                    type="email" 
                                                    required
                                                    value={formData.email}
                                                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                                                    placeholder="seu@email.com"
                                                    className="w-full px-5 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:ring-4 focus:ring-servweld-blue/5 focus:border-servweld-blue outline-none transition-all placeholder:text-gray-300"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                                                    <Phone size={16} className="text-servweld-blue" /> WhatsApp / Celular
                                                </label>
                                                <input 
                                                    type="tel" 
                                                    required
                                                    value={formData.phone}
                                                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                                    placeholder="(00) 00000-0000"
                                                    className="w-full px-5 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:ring-4 focus:ring-servweld-blue/5 focus:border-servweld-blue outline-none transition-all placeholder:text-gray-300"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                                                    <Briefcase size={16} className="text-servweld-blue" /> Área de Interesse
                                                </label>
                                                <select 
                                                    required
                                                    value={formData.area}
                                                    onChange={(e) => setFormData({...formData, area: e.target.value})}
                                                    className="w-full px-5 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:ring-4 focus:ring-servweld-blue/5 focus:border-servweld-blue outline-none transition-all appearance-none cursor-pointer"
                                                >
                                                    <option value="" disabled>Selecione a área...</option>
                                                    {areas.map((area, idx) => (
                                                        <option key={idx} value={area}>{area}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>

                                        <div className="mt-8">
                                            <label className="block text-sm font-bold text-gray-700 mb-2">Anexar Currículo (PDF)</label>
                                            <div className={`relative group border-2 border-dashed ${file ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'} rounded-3xl p-10 transition-all hover:border-servweld-blue hover:bg-white`}>
                                                <input 
                                                    type="file" 
                                                    accept=".pdf"
                                                    onChange={handleFileChange}
                                                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                                />
                                                <div className="text-center">
                                                    <div className={`w-16 h-16 ${file ? 'bg-green-100 text-green-600' : 'bg-white text-gray-400 group-hover:text-servweld-blue'} rounded-2xl flex items-center justify-center mx-auto mb-4 transition-colors shadow-sm`}>
                                                        {file ? <CheckCircle size={32} /> : <Upload size={32} />}
                                                    </div>
                                                    {file ? (
                                                        <div>
                                                            <p className="font-bold text-green-700">{file.name}</p>
                                                            <p className="text-xs text-green-600 uppercase mt-1">Clique para trocar o arquivo</p>
                                                        </div>
                                                    ) : (
                                                        <div>
                                                            <p className="font-bold text-gray-700">Clique para enviar ou arraste o PDF</p>
                                                            <p className="text-xs text-gray-400 uppercase mt-1">Limite de 5MB por currículo</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {error && (
                                            <motion.div 
                                                initial={{ opacity: 0, x: -10 }} 
                                                animate={{ opacity: 1, x: 0 }}
                                                className="flex items-center gap-3 p-4 bg-red-50 text-red-600 rounded-2xl text-sm font-medium border border-red-100"
                                            >
                                                <AlertCircle size={20} />
                                                {error}
                                            </motion.div>
                                        )}

                                        <button 
                                            type="submit"
                                            disabled={loading}
                                            className="w-full bg-servweld-blue text-white py-5 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-opacity-90 transition-all shadow-xl shadow-servweld-blue/20 disabled:bg-gray-300 disabled:shadow-none mt-10"
                                        >
                                            {loading ? <Loader2 className="animate-spin" /> : <Send size={20} />}
                                            {loading ? 'Enviando Currículo...' : 'Enviar Minha Candidatura'}
                                        </button>
                                    </form>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <div className="mt-12 text-center text-gray-400 text-xs font-medium uppercase tracking-widest flex items-center justify-center gap-8">
                        <div className="flex items-center gap-2"><CheckCircle size={14} className="text-servweld-blue" /> Segurança de dados</div>
                        <div className="flex items-center gap-2"><CheckCircle size={14} className="text-servweld-blue" /> Banco de Talentos</div>
                        <div className="flex items-center gap-2"><CheckCircle size={14} className="text-servweld-blue" /> Recrutamento Direto</div>
                    </div>
                </main>
            </div>
        </>
    );
};

export default Careers;
