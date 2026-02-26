import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Save, ArrowLeft, Loader2, Image as ImageIcon, Upload, X, Plus, Trash2 } from 'lucide-react';

const ProductForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(!!id);
    const [uploading, setUploading] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        category: 'MIG/MAG',
        type: '',
        amperage: 0,
        description: '',
        image_url: '',
        specifications: {}
    });

    const [newSpec, setNewSpec] = useState({ key: '', value: '' });

    useEffect(() => {
        if (id) fetchProduct();
    }, [id]);

    const fetchProduct = async () => {
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('id', id)
            .single();

        if (data) {
            setFormData({
                ...data,
                specifications: data.specifications || {}
            });
        }
        setFetching(false);
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
            const filePath = `products/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('products')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('products')
                .getPublicUrl(filePath);

            setFormData({ ...formData, image_url: publicUrl });
        } catch (error) {
            alert('Erro ao carregar imagem: ' + error.message);
        } finally {
            setUploading(false);
        }
    };

    const addSpec = () => {
        if (!newSpec.key || !newSpec.value) return;
        setFormData({
            ...formData,
            specifications: {
                ...formData.specifications,
                [newSpec.key]: newSpec.value
            }
        });
        setNewSpec({ key: '', value: '' });
    };

    const removeSpec = (key) => {
        const updatedSpecs = { ...formData.specifications };
        delete updatedSpecs[key];
        setFormData({ ...formData, specifications: updatedSpecs });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const { error } = id
            ? await supabase.from('products').update(formData).eq('id', id)
            : await supabase.from('products').insert([formData]);

        if (!error) {
            navigate('/admin');
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
            <div className="max-w-3xl mx-auto">
                <button
                    onClick={() => navigate('/admin')}
                    className="flex items-center gap-2 text-gray-500 hover:text-servweld-blue mb-8 transition-colors group"
                >
                    <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    Voltar para o Dashboard
                </button>

                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-8 border-b border-gray-50 bg-gray-50/50">
                        <h1 className="text-2xl font-bold text-gray-900">
                            {id ? 'Editar Equipamento' : 'Novo Equipamento'}
                        </h1>
                        <p className="text-gray-500 mt-1">Preencha os detalhes técnicos do equipamento</p>
                    </div>

                    <form onSubmit={handleSubmit} className="p-8 space-y-8">
                        {/* Basic Info Section */}
                        <div className="space-y-6">
                            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                <span className="w-1.5 h-6 bg-servweld-blue rounded-full" />
                                Informações Básicas
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Nome do Equipamento</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-servweld-blue focus:border-transparent outline-none transition-all"
                                        required
                                        placeholder="Ex: MIG/MAG 250A"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Categoria</label>
                                    <select
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-servweld-blue focus:border-transparent outline-none transition-all"
                                    >
                                        <option>MIG/MAG</option>
                                        <option>TIG</option>
                                        <option>Eletrodo</option>
                                        <option>Corte</option>
                                        <option>Ar Comprimido</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Tipo / Subcategoria</label>
                                    <input
                                        type="text"
                                        value={formData.type}
                                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-servweld-blue focus:border-transparent outline-none transition-all"
                                        placeholder="Ex: Inversora, Retificador..."
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Amperagem (A)</label>
                                    <input
                                        type="number"
                                        value={formData.amperage}
                                        onChange={(e) => setFormData({ ...formData, amperage: parseInt(e.target.value) })}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-servweld-blue focus:border-transparent outline-none transition-all"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Imagem do Produto</label>
                                    <div className="flex items-center gap-4">
                                        {formData.image_url ? (
                                            <div className="relative w-16 h-16 rounded-lg border border-gray-200 overflow-hidden group">
                                                <img src={formData.image_url} alt="Preview" className="w-full h-full object-contain p-2" />
                                                <button
                                                    type="button"
                                                    onClick={() => setFormData({ ...formData, image_url: '' })}
                                                    className="absolute inset-0 bg-black/40 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <X size={16} />
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="w-16 h-16 rounded-lg bg-gray-50 border-2 border-dashed border-gray-200 flex items-center justify-center text-gray-400">
                                                <ImageIcon size={24} />
                                            </div>
                                        )}
                                        <label className="flex-1 flex items-center justify-center h-16 bg-gray-50 text-servweld-blue rounded-xl border-2 border-dashed border-servweld-blue/20 cursor-pointer hover:bg-servweld-blue/5 transition-all text-sm font-bold">
                                            {uploading ? <Loader2 className="animate-spin" size={20} /> : <Upload size={20} className="mr-2" />}
                                            {uploading ? 'Carregando...' : 'Trocar Foto'}
                                            <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} disabled={uploading} />
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Technical Specifications Section */}
                        <div className="space-y-6 pt-8 border-t border-gray-100">
                            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                <span className="w-1.5 h-6 bg-servweld-blue rounded-full" />
                                Especificações Técnicas
                            </h2>
                            <p className="text-sm text-gray-500 italic">Adicione campos como: Voltagem, Peso, Ciclo de Trabalho, etc.</p>

                            <div className="space-y-3">
                                {Object.entries(formData.specifications).map(([key, value]) => (
                                    <div key={key} className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl border border-gray-100 group">
                                        <div className="flex-1 font-bold text-gray-700">{key}:</div>
                                        <div className="flex-1 text-gray-600">{value}</div>
                                        <button
                                            type="button"
                                            onClick={() => removeSpec(key)}
                                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                ))}
                            </div>

                            <div className="flex flex-col md:flex-row gap-3 bg-servweld-blue/5 p-4 rounded-2xl border border-servweld-blue/10">
                                <input
                                    type="text"
                                    placeholder="Nome (ex: Peso)"
                                    value={newSpec.key}
                                    onChange={(e) => setNewSpec({ ...newSpec, key: e.target.value })}
                                    className="flex-1 px-4 py-2 bg-white border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-servweld-blue"
                                />
                                <input
                                    type="text"
                                    placeholder="Valor (ex: 10kg)"
                                    value={newSpec.value}
                                    onChange={(e) => setNewSpec({ ...newSpec, value: e.target.value })}
                                    className="flex-1 px-4 py-2 bg-white border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-servweld-blue"
                                />
                                <button
                                    type="button"
                                    onClick={addSpec}
                                    className="px-6 py-2 bg-servweld-blue text-white rounded-lg font-bold hover:bg-opacity-90 transition-all flex items-center justify-center gap-2"
                                >
                                    <Plus size={20} />
                                    Adicionar
                                </button>
                            </div>
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Descrição Longa</label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-servweld-blue focus:border-transparent outline-none transition-all min-h-[120px]"
                                placeholder="Destaque os principais diferenciais deste equipamento..."
                            />
                        </div>

                        <div className="pt-6 border-t border-gray-50">
                            <button
                                type="submit"
                                disabled={loading || uploading}
                                className="w-full bg-servweld-blue text-white py-4 rounded-xl font-bold hover:bg-opacity-90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-servweld-blue/20 disabled:bg-gray-300 disabled:shadow-none"
                            >
                                {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                                {id ? 'Salvar Alterações' : 'Cadastrar Equipamento'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ProductForm;
