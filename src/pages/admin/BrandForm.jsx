import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Save, ArrowLeft, Loader2, Image as ImageIcon, Upload, X, Globe } from 'lucide-react';

const BrandForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(!!id);
    const [uploading, setUploading] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        logo_url: '',
        url: ''
    });

    useEffect(() => {
        if (id) fetchBrand();
    }, [id]);

    const fetchBrand = async () => {
        const { data, error } = await supabase
            .from('brands')
            .select('*')
            .eq('id', id)
            .single();

        if (data) setFormData(data);
        setFetching(false);
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `brand_${Math.random().toString(36).substring(2)}.${fileExt}`;
            const filePath = `brands/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('products') // Using the same bucket for simplicity
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('products')
                .getPublicUrl(filePath);

            setFormData({ ...formData, logo_url: publicUrl });
        } catch (error) {
            alert('Erro ao carregar logo: ' + error.message);
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const { error } = id
            ? await supabase.from('brands').update(formData).eq('id', id)
            : await supabase.from('brands').insert([formData]);

        if (!error) {
            navigate('/admin?tab=brands');
        } else {
            alert('Erro ao salvar: ' + error.message);
            setLoading(false);
        }
    };

    if (fetching) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <Loader2 className="animate-spin text-servweld-blue" size={40} />
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8">
            <div className="max-w-xl mx-auto">
                <button
                    onClick={() => navigate('/admin?tab=brands')}
                    className="flex items-center gap-2 text-gray-500 hover:text-servweld-blue mb-8 transition-colors group"
                >
                    <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    Voltar para Marcas
                </button>

                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-8 border-b border-gray-50 bg-gray-50/50">
                        <h1 className="text-2xl font-bold text-gray-900">
                            {id ? 'Editar Marca' : 'Nova Marca'}
                        </h1>
                        <p className="text-gray-500 mt-1">Configure o logo e o link do fabricante</p>
                    </div>

                    <form onSubmit={handleSubmit} className="p-8 space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Nome da Marca</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-servweld-blue focus:border-transparent outline-none transition-all"
                                required
                                placeholder="Ex: ESAB, Boxer, Balmer..."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Link do Site Oficial</label>
                            <div className="relative">
                                <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="url"
                                    value={formData.url}
                                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-servweld-blue focus:border-transparent outline-none transition-all"
                                    placeholder="https://exemplo.com.br"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Logo do Fabricante</label>
                            <div className="space-y-4">
                                <div className="flex items-center gap-4">
                                    {formData.logo_url ? (
                                        <div className="relative w-32 h-32 rounded-xl border border-gray-200 overflow-hidden group bg-white shadow-inner">
                                            <img src={formData.logo_url} alt="Preview" className="w-full h-full object-contain p-4" />
                                            <button
                                                type="button"
                                                onClick={() => setFormData({ ...formData, logo_url: '' })}
                                                className="absolute inset-0 bg-black/40 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <X size={24} />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="w-32 h-32 rounded-xl bg-gray-50 border-2 border-dashed border-gray-200 flex items-center justify-center text-gray-400">
                                            <ImageIcon size={40} />
                                        </div>
                                    )}

                                    <div className="flex-1">
                                        <label className="flex flex-col items-center justify-center w-full px-4 py-8 bg-gray-50 text-servweld-blue rounded-xl border-2 border-dashed border-servweld-blue/20 cursor-pointer hover:bg-servweld-blue/5 transition-all group">
                                            {uploading ? (
                                                <Loader2 className="animate-spin" size={24} />
                                            ) : (
                                                <>
                                                    <Upload className="mb-2 group-hover:-translate-y-1 transition-transform" size={24} />
                                                    <span className="text-xs font-bold uppercase tracking-wider">Carregar Logo</span>
                                                </>
                                            )}
                                            <input
                                                type="file"
                                                className="hidden"
                                                accept="image/*"
                                                onChange={handleFileUpload}
                                                disabled={uploading}
                                            />
                                        </label>
                                    </div>
                                </div>
                                <input
                                    type="text"
                                    value={formData.logo_url}
                                    onChange={(e) => setFormData({ ...formData, logo_url: e.target.value })}
                                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs outline-none focus:ring-1 focus:ring-servweld-blue"
                                    placeholder="Ou cole a URL do logo aqui..."
                                />
                            </div>
                        </div>

                        <div className="pt-6 border-t border-gray-50">
                            <button
                                type="submit"
                                disabled={loading || uploading}
                                className="w-full bg-servweld-blue text-white py-4 rounded-xl font-bold hover:bg-opacity-90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-servweld-blue/20 disabled:bg-gray-300 disabled:shadow-none"
                            >
                                {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                                {id ? 'Salvar Alterações' : 'Cadastrar Marca'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default BrandForm;
