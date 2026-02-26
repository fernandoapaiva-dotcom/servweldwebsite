import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Save, Loader2, Play, Type, MousePointer2, Globe } from 'lucide-react';

const SettingsForm = () => {
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [heroData, setHeroData] = useState({
        title: '',
        subtitle: '',
        video_url: '',
        primary_button_text: '',
        primary_button_link: '',
        secondary_button_text: '',
        secondary_button_link: ''
    });

    const [contactData, setContactData] = useState({
        whatsapp: '',
        whatsapp_display: '',
        email: ''
    });

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        const { data: heroDataResp } = await supabase
            .from('site_settings')
            .select('*')
            .eq('key', 'hero')
            .single();

        const { data: contactDataResp } = await supabase
            .from('site_settings')
            .select('*')
            .eq('key', 'contact')
            .single();

        if (heroDataResp) setHeroData(heroDataResp.value);
        if (contactDataResp) setContactData(contactDataResp.value);
        setFetching(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const heroPromise = supabase
            .from('site_settings')
            .upsert({
                key: 'hero',
                value: heroData,
                updated_at: new Date().toISOString()
            });

        const contactPromise = supabase
            .from('site_settings')
            .upsert({
                key: 'contact',
                value: contactData,
                updated_at: new Date().toISOString()
            });

        const results = await Promise.all([heroPromise, contactPromise]);
        const errors = results.filter(r => r.error);

        if (errors.length === 0) {
            alert('Configurações salvas com sucesso!');
        } else {
            alert('Erro ao salvar: ' + errors.map(e => e.error.message).join(', '));
        }
        setLoading(false);
    };

    if (fetching) return (
        <div className="p-20 flex justify-center">
            <Loader2 className="animate-spin text-servweld-blue" size={40} />
        </div>
    );

    return (
        <form onSubmit={handleSubmit} className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Text Content */}
                <div className="space-y-6">
                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        <Type className="text-servweld-blue" size={24} />
                        Textos da Hero
                    </h2>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Título Principal (HTML permitido)</label>
                            <textarea
                                value={heroData.title}
                                onChange={(e) => setHeroData({ ...heroData, title: e.target.value })}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-servweld-blue outline-none min-h-[100px]"
                                placeholder="Use <br /> para quebras de linha"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Subtítulo / Descrição</label>
                            <textarea
                                value={heroData.subtitle}
                                onChange={(e) => setHeroData({ ...heroData, subtitle: e.target.value })}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-servweld-blue outline-none min-h-[120px]"
                            />
                        </div>
                    </div>
                </div>

                {/* Media Content */}
                <div className="space-y-6">
                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        <Play className="text-servweld-blue" size={24} />
                        Vídeo de Fundo
                    </h2>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Link do YouTube (Embed)</label>
                        <input
                            type="text"
                            value={heroData.video_url}
                            onChange={(e) => setHeroData({ ...heroData, video_url: e.target.value })}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-servweld-blue outline-none"
                            placeholder="https://www.youtube.com/embed/..."
                        />
                        <p className="mt-2 text-xs text-gray-400">Certifique-se de usar o link de "incorporação" (embed) do YouTube.</p>
                    </div>

                    <div className="aspect-video rounded-2xl bg-black overflow-hidden border border-gray-100 shadow-inner flex items-center justify-center">
                        {heroData.video_url ? (
                            <iframe
                                src={heroData.video_url}
                                className="w-full h-full pointer-events-none"
                                title="Preview"
                            />
                        ) : (
                            <Play className="text-white/20" size={48} />
                        )}
                    </div>
                </div>
            </div>

            {/* Contact Information Section [NEW] */}
            <div className="pt-8 border-t border-gray-100 space-y-6">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <Globe className="text-servweld-blue" size={24} />
                    Contatos Globais (WhatsApp & Email)
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">WhatsApp (Apenas Números)</label>
                        <input
                            type="text"
                            value={contactData.whatsapp}
                            onChange={(e) => setContactData({ ...contactData, whatsapp: e.target.value.replace(/\D/g, '') })}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-servweld-blue outline-none"
                            placeholder="Ex: 556132346622"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">WhatsApp (Exibição)</label>
                        <input
                            type="text"
                            value={contactData.whatsapp_display}
                            onChange={(e) => setContactData({ ...contactData, whatsapp_display: e.target.value })}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-servweld-blue outline-none"
                            placeholder="Ex: (61) 3234-6622"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">E-mail de Contato</label>
                        <input
                            type="email"
                            value={contactData.email}
                            onChange={(e) => setContactData({ ...contactData, email: e.target.value })}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-servweld-blue outline-none"
                            placeholder="contato@servweld.com.br"
                        />
                    </div>
                </div>
                <p className="text-sm text-gray-400">Ao alterar aqui, todos os botões de WhatsApp e informações de contato do site serão atualizados automaticamente.</p>
            </div>

            {/* Buttons Section */}
            <div className="pt-8 border-t border-gray-100 space-y-6">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <MousePointer2 className="text-servweld-blue" size={24} />
                    Botões de Ação
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-6 bg-blue-50/50 rounded-2xl border border-blue-100 space-y-4">
                        <h3 className="font-bold text-servweld-blue">Botão Principal</h3>
                        <input
                            type="text"
                            placeholder="Texto do Botão"
                            value={heroData.primary_button_text}
                            onChange={(e) => setHeroData({ ...heroData, primary_button_text: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none"
                        />
                        <input
                            type="text"
                            placeholder="Link (ex: /locacao)"
                            value={heroData.primary_button_link}
                            onChange={(e) => setHeroData({ ...heroData, primary_button_link: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none"
                        />
                    </div>

                    <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100 space-y-4">
                        <h3 className="font-bold text-gray-700">Botão Secundário</h3>
                        <input
                            type="text"
                            placeholder="Texto do Botão"
                            value={heroData.secondary_button_text}
                            onChange={(e) => setHeroData({ ...heroData, secondary_button_text: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none"
                        />
                        <input
                            type="text"
                            placeholder="Link (ex: /assistencia)"
                            value={heroData.secondary_button_link}
                            onChange={(e) => setHeroData({ ...heroData, secondary_button_link: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none"
                        />
                    </div>
                </div>
            </div>

            <div className="pt-8 border-t border-gray-100">
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-servweld-blue text-white py-4 rounded-xl font-bold hover:bg-opacity-90 transition-all flex items-center justify-center gap-3 shadow-lg shadow-servweld-blue/20"
                >
                    {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                    Salvar Alterações do Portal
                </button>
            </div>
        </form>
    );
};

export default SettingsForm;
