import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Lock, Mail, Loader2, Rocket, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const RestrictedLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const isExpired = searchParams.get('reason') === 'expired';

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            setError(error.message === 'Invalid login credentials' ? 'Credenciais inválidas' : error.message);
            setLoading(false);
        } else {
            // Check if user has internal staff flag (we'll implement this check later)
            // For now, redirect to hub
            navigate('/hub');
        }
    };

    return (
        <div className="min-h-screen relative flex items-center justify-center p-4 bg-[#0a0a0a] overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-servweld-blue/20 rounded-full blur-[120px] animate-pulse" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px]" />

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="max-w-md w-full relative z-10"
            >
                {/* Central Logo/Icon */}
                <div className="text-center mb-10">
                    <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.3, type: "spring", stiffness: 260, damping: 20 }}
                        className="h-20 w-auto flex items-center justify-center mx-auto mb-6 drop-shadow-2xl"
                    >
                        <img src="/assets/logo/LOGO.png" alt="Servweld" className="h-full w-auto object-contain brightness-0 invert" />
                    </motion.div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Portal Interno</h1>
                    <p className="text-gray-400 mt-2 font-medium">Acesso restrito ao Grupo Servweld</p>
                </div>

                {/* Glassmorphism Card */}
                <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-[2.5rem] p-8 md:p-10 shadow-2xl shadow-black/50 overflow-hidden relative group">
                    {/* Subtle inner glow */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />

                    {isExpired && !error && (
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-amber-500/10 text-amber-400 p-4 rounded-2xl mb-8 text-sm border border-amber-500/20 flex items-center gap-3"
                        >
                            <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse" />
                            Sessão expirada. Por favor, autentique-se novamente.
                        </motion.div>
                    )}

                    {error && (
                        <motion.div 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-red-500/10 text-red-400 p-4 rounded-2xl mb-8 text-sm border border-red-500/20 flex items-center gap-3"
                        >
                            <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                            {error}
                        </motion.div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-6 relative z-10">
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 ml-1 text-center">E-mail Corporativo</label>
                            <div className="relative group/input">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within/input:text-servweld-blue transition-colors" size={20} />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-servweld-blue/50 focus:border-servweld-blue/50 outline-none transition-all text-white placeholder:text-gray-600"
                                    placeholder="seu.nome@servweld.com.br"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 ml-1 text-center">Senha de Acesso</label>
                            <div className="relative group/input">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within/input:text-servweld-blue transition-colors" size={20} />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-servweld-blue/50 focus:border-servweld-blue/50 outline-none transition-all text-white placeholder:text-gray-600"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-white text-black py-4 rounded-2xl font-bold hover:bg-servweld-blue hover:text-white transition-all duration-500 flex items-center justify-center gap-2 group/btn relative overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-servweld-blue to-blue-400 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500" />
                            <span className="relative z-10">{loading ? <Loader2 className="animate-spin" size={24} /> : 'Autenticar'}</span>
                            <ArrowRight size={20} className="relative z-10 group-hover/btn:translate-x-1 transition-transform" />
                        </button>
                    </form>
                </div>

                {/* Footer Link */}
                <div className="text-center mt-10">
                    <button 
                        onClick={() => navigate('/')}
                        className="text-gray-500 hover:text-gray-300 text-sm font-medium transition-colors"
                    >
                        ← Voltar para o site público
                    </button>
                    <p className="mt-6 text-[10px] text-gray-600 uppercase tracking-[0.2em] font-bold">
                        &copy; {new Date().getFullYear()} Servweld Intelligence
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default RestrictedLogin;
