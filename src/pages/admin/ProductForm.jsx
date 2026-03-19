import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Save, ArrowLeft, Loader2, Image as ImageIcon, Upload, X, Plus, Trash2, GripVertical, Pencil, Check } from 'lucide-react';

// Standard spec order for ALL products
const STANDARD_SPEC_KEYS = [
    'Tensão de Alimentação',
    'Corrente de Saída (Min/Max)',
    'Ciclo de Trabalho',
    'Fator de Potência',
    'Peso',
    'Dimensões (C x L x A)',
    'Grau de Proteção',
    'Norma',
];

const DEFAULT_SPECS = () =>
    STANDARD_SPEC_KEYS.reduce((acc, key) => {
        acc[key] = '';
        return acc;
    }, {});

const ProductForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(!!id);
    const [uploading, setUploading] = useState(false);
    const [uploadingLogo, setUploadingLogo] = useState(false);
    const [lightbox, setLightbox] = useState(false);

    // Specs stored as ordered array: [{key, value}]
    const [specs, setSpecs] = useState(
        STANDARD_SPEC_KEYS.map(k => ({ key: k, value: '' }))
    );
    const [newSpec, setNewSpec] = useState({ key: '', value: '' });
    const [editingIdx, setEditingIdx] = useState(null); // index being edited
    const [editingSpec, setEditingSpec] = useState({ key: '', value: '' });
    const [categories, setCategories] = useState(['MIG/MAG', 'TIG', 'Eletrodo', 'Corte', 'Ar Comprimido']);
    const [newCategory, setNewCategory] = useState('');
    const [showNewCategory, setShowNewCategory] = useState(false);

    // Drag-and-drop state
    const dragIdx = useRef(null);
    const dragOverIdx = useRef(null);

    const [formData, setFormData] = useState({
        name: '',
        category: 'MIG/MAG',
        type: '',
        amperage: 0,
        description: '',
        image_url: '',
        manufacturer_logo_url: '',
        manufacturer_name: '',
        display_order: null,
        specifications: {}
    });

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
                name: data.name || '',
                category: data.category || 'MIG/MAG',
                type: data.type || '',
                amperage: data.amperage || 0,
                description: data.description || '',
                image_url: data.image_url || '',
                manufacturer_logo_url: data.manufacturer_logo_url || '',
                manufacturer_name: data.manufacturer_name || '',
                display_order: data.display_order ?? null,
                specifications: data.specifications || {}
            });

            // Build ordered specs: standard keys first (preserving saved values), then extra
            const saved = data.specifications || {};
            const ordered = STANDARD_SPEC_KEYS.map(k => ({ key: k, value: saved[k] ?? '' }));
            const extras = Object.entries(saved)
                .filter(([k]) => !STANDARD_SPEC_KEYS.includes(k))
                .map(([k, v]) => ({ key: k, value: v }));
            setSpecs([...ordered, ...extras]);
        }
        setFetching(false);
    };

    // Convert specs array -> object for saving (skip empty values)
    const specsToObject = () =>
        specs.reduce((acc, { key, value }) => {
            if (key.trim() && value.trim()) acc[key.trim()] = value.trim();
            return acc;
        }, {});

    // ---- Upload handlers ----
    const handleFileUpload = async (e, field) => {
        const file = e.target.files[0];
        if (!file) return;

        const isLogo = field === 'manufacturer_logo_url';
        if (isLogo) setUploadingLogo(true); else setUploading(true);

        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
            const folder = isLogo ? 'logos' : 'products';
            const filePath = `${folder}/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('products')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('products')
                .getPublicUrl(filePath);

            setFormData(prev => ({ ...prev, [field]: publicUrl }));
        } catch (error) {
            alert('Erro ao carregar imagem: ' + error.message);
        } finally {
            if (isLogo) setUploadingLogo(false); else setUploading(false);
        }
    };

    // ---- Spec management ----
    const addSpec = () => {
        if (!newSpec.key.trim()) return;
        setSpecs(prev => [...prev, { key: newSpec.key.trim(), value: newSpec.value.trim() }]);
        setNewSpec({ key: '', value: '' });
    };

    const removeSpec = (idx) => {
        setSpecs(prev => prev.filter((_, i) => i !== idx));
    };

    const startEdit = (idx) => {
        setEditingIdx(idx);
        setEditingSpec({ key: specs[idx].key, value: specs[idx].value });
    };

    const saveEdit = () => {
        if (editingIdx === null) return;
        setSpecs(prev => prev.map((s, i) =>
            i === editingIdx ? { key: editingSpec.key.trim(), value: editingSpec.value.trim() } : s
        ));
        setEditingIdx(null);
    };

    // ---- Drag to reorder specs ----
    const onDragStart = (idx) => { dragIdx.current = idx; };
    const onDragEnter = (idx) => { dragOverIdx.current = idx; };
    const onDragEnd = () => {
        const from = dragIdx.current;
        const to = dragOverIdx.current;
        if (from === null || to === null || from === to) return;
        const updated = [...specs];
        const [moved] = updated.splice(from, 1);
        updated.splice(to, 0, moved);
        setSpecs(updated);
        dragIdx.current = null;
        dragOverIdx.current = null;
    };

    // ---- Category ----
    const addCategory = () => {
        const cat = newCategory.trim();
        if (!cat || categories.includes(cat)) return;
        setCategories(prev => [...prev, cat]);
        setFormData(prev => ({ ...prev, category: cat }));
        setNewCategory('');
        setShowNewCategory(false);
    };

    // ---- Submit ----
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const payload = { ...formData, specifications: specsToObject() };

        const { error } = id
            ? await supabase.from('products').update(payload).eq('id', id)
            : await supabase.from('products').insert([payload]);

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

                    <form onSubmit={handleSubmit} className="p-8 space-y-10">

                        {/* ── BASIC INFO ── */}
                        <section className="space-y-6">
                            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                <span className="w-1.5 h-6 bg-servweld-blue rounded-full" />
                                Informações Básicas
                            </h2>

                            {/* Name */}
                            <div>
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

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Category */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Categoria</label>
                                    <div className="flex gap-2">
                                        <select
                                            value={formData.category}
                                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                            className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-servweld-blue focus:border-transparent outline-none transition-all"
                                        >
                                            {categories.map(cat => <option key={cat}>{cat}</option>)}
                                        </select>
                                        <button
                                            type="button"
                                            onClick={() => setShowNewCategory(v => !v)}
                                            className="px-3 py-3 bg-servweld-blue/10 text-servweld-blue rounded-xl hover:bg-servweld-blue/20 transition-all"
                                            title="Criar nova categoria"
                                        >
                                            <Plus size={18} />
                                        </button>
                                    </div>
                                    {showNewCategory && (
                                        <div className="flex gap-2 mt-2">
                                            <input
                                                type="text"
                                                value={newCategory}
                                                onChange={(e) => setNewCategory(e.target.value)}
                                                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCategory())}
                                                placeholder="Nome da nova categoria"
                                                className="flex-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-servweld-blue text-sm"
                                            />
                                            <button type="button" onClick={addCategory} className="px-4 py-2 bg-servweld-blue text-white rounded-xl text-sm font-bold hover:bg-opacity-90 transition-all">
                                                Criar
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {/* Type */}
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

                                {/* Amperage */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Amperagem (A)</label>
                                    <input
                                        type="number"
                                        value={formData.amperage}
                                        onChange={(e) => setFormData({ ...formData, amperage: parseInt(e.target.value) || 0 })}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-servweld-blue focus:border-transparent outline-none transition-all"
                                    />
                                </div>

                                {/* Display Order */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Ordem de Exibição</label>
                                    <input
                                        type="number"
                                        value={formData.display_order ?? ''}
                                        onChange={(e) => setFormData({ ...formData, display_order: e.target.value !== '' ? parseInt(e.target.value) : null })}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-servweld-blue focus:border-transparent outline-none transition-all"
                                        placeholder="Ex: 1, 2, 3..."
                                    />
                                    <p className="text-xs text-gray-400 mt-1">Menor número aparece primeiro no site</p>
                                </div>
                            </div>
                        </section>

                        {/* ── IMAGES ── */}
                        <section className="space-y-6 pt-8 border-t border-gray-100">
                            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                <span className="w-1.5 h-6 bg-servweld-blue rounded-full" />
                                Imagens
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Product Image */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Foto do Equipamento</label>
                                    <div className="flex items-center gap-4">
                                        {formData.image_url ? (
                                            <div
                                                className="relative w-20 h-20 rounded-lg border border-gray-200 overflow-hidden group cursor-zoom-in"
                                                onClick={() => setLightbox(true)}
                                            >
                                                <img src={formData.image_url} alt="Preview" className="w-full h-full object-contain p-2" />
                                                <button
                                                    type="button"
                                                    onClick={(e) => { e.stopPropagation(); setFormData({ ...formData, image_url: '' }); }}
                                                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <X size={12} />
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="w-20 h-20 rounded-lg bg-gray-50 border-2 border-dashed border-gray-200 flex items-center justify-center text-gray-400">
                                                <ImageIcon size={24} />
                                            </div>
                                        )}
                                        <label className="flex-1 flex items-center justify-center h-14 bg-gray-50 text-servweld-blue rounded-xl border-2 border-dashed border-servweld-blue/20 cursor-pointer hover:bg-servweld-blue/5 transition-all text-sm font-bold">
                                            {uploading ? <Loader2 className="animate-spin" size={20} /> : <Upload size={20} className="mr-2" />}
                                            {uploading ? 'Carregando...' : 'Escolher Foto'}
                                            <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'image_url')} disabled={uploading} />
                                        </label>
                                    </div>
                                </div>

                                {/* Manufacturer Logo */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Logo do Fabricante</label>
                                    <div className="flex items-center gap-4">
                                        {formData.manufacturer_logo_url ? (
                                            <div className="relative w-20 h-20 rounded-lg border border-gray-200 overflow-hidden group bg-white">
                                                <img src={formData.manufacturer_logo_url} alt="Logo" className="w-full h-full object-contain p-2" />
                                                <button
                                                    type="button"
                                                    onClick={() => setFormData({ ...formData, manufacturer_logo_url: '' })}
                                                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <X size={12} />
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="w-20 h-20 rounded-lg bg-gray-50 border-2 border-dashed border-gray-200 flex items-center justify-center text-gray-400">
                                                <ImageIcon size={24} />
                                            </div>
                                        )}
                                        <label className="flex-1 flex items-center justify-center h-14 bg-gray-50 text-servweld-blue rounded-xl border-2 border-dashed border-servweld-blue/20 cursor-pointer hover:bg-servweld-blue/5 transition-all text-sm font-bold">
                                            {uploadingLogo ? <Loader2 className="animate-spin" size={20} /> : <Upload size={20} className="mr-2" />}
                                            {uploadingLogo ? 'Carregando...' : 'Escolher Logo'}
                                            <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'manufacturer_logo_url')} disabled={uploadingLogo} />
                                        </label>
                                    </div>
                                    <input
                                        type="text"
                                        value={formData.manufacturer_name}
                                        onChange={(e) => setFormData({ ...formData, manufacturer_name: e.target.value })}
                                        className="mt-2 w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-servweld-blue text-sm"
                                        placeholder="Nome do Fabricante (ex: ESAB, Lincoln Electric)"
                                    />
                                </div>
                            </div>
                        </section>

                        {/* ── DESCRIPTION ── */}
                        <section className="space-y-4 pt-8 border-t border-gray-100">
                            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                <span className="w-1.5 h-6 bg-servweld-blue rounded-full" />
                                Descrição Completa
                            </h2>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-servweld-blue focus:border-transparent outline-none transition-all"
                                style={{ minHeight: '160px', resize: 'vertical' }}
                                placeholder="Destaque os principais diferenciais deste equipamento. A descrição completa será exibida no site."
                            />
                        </section>

                        {/* ── TECHNICAL SPECIFICATIONS ── */}
                        <section className="space-y-6 pt-8 border-t border-gray-100">
                            <div>
                                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                    <span className="w-1.5 h-6 bg-servweld-blue rounded-full" />
                                    Especificações Técnicas
                                </h2>
                                <p className="text-sm text-gray-500 mt-1 italic">
                                    Arraste <GripVertical size={14} className="inline" /> para reordenar. Clique em <Pencil size={12} className="inline" /> para editar um campo.
                                </p>
                            </div>

                            {/* Spec rows */}
                            <div className="space-y-2">
                                {specs.map((spec, idx) => (
                                    <div
                                        key={idx}
                                        draggable
                                        onDragStart={() => onDragStart(idx)}
                                        onDragEnter={() => onDragEnter(idx)}
                                        onDragEnd={onDragEnd}
                                        onDragOver={(e) => e.preventDefault()}
                                        className="flex items-center gap-2 bg-gray-50 p-3 rounded-xl border border-gray-100 group cursor-grab active:cursor-grabbing"
                                    >
                                        <GripVertical size={18} className="text-gray-300 group-hover:text-gray-400 shrink-0" />

                                        {editingIdx === idx ? (
                                            <>
                                                <input
                                                    type="text"
                                                    value={editingSpec.key}
                                                    onChange={(e) => setEditingSpec({ ...editingSpec, key: e.target.value })}
                                                    className="flex-1 px-2 py-1 bg-white border border-servweld-blue/30 rounded-lg text-sm font-bold outline-none"
                                                />
                                                <input
                                                    type="text"
                                                    value={editingSpec.value}
                                                    onChange={(e) => setEditingSpec({ ...editingSpec, value: e.target.value })}
                                                    onKeyDown={(e) => e.key === 'Enter' && saveEdit()}
                                                    className="flex-1 px-2 py-1 bg-white border border-servweld-blue/30 rounded-lg text-sm outline-none"
                                                    placeholder="Valor"
                                                />
                                                <button type="button" onClick={saveEdit} className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-all">
                                                    <Check size={18} />
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <div className="flex-1 font-bold text-gray-700 text-sm">{spec.key}</div>
                                                <div className="flex-1 text-gray-600 text-sm">{spec.value || <span className="text-gray-300 italic">—</span>}</div>
                                                <button type="button" onClick={() => startEdit(idx)} className="p-2 text-gray-300 hover:text-servweld-blue hover:bg-servweld-blue/5 rounded-lg transition-all">
                                                    <Pencil size={16} />
                                                </button>
                                                <button type="button" onClick={() => removeSpec(idx)} className="p-2 text-gray-300 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
                                                    <Trash2 size={16} />
                                                </button>
                                            </>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* Add custom spec */}
                            <div className="flex flex-col md:flex-row gap-3 bg-servweld-blue/5 p-4 rounded-2xl border border-servweld-blue/10">
                                <input
                                    type="text"
                                    placeholder="Nome da especificação"
                                    value={newSpec.key}
                                    onChange={(e) => setNewSpec({ ...newSpec, key: e.target.value })}
                                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSpec())}
                                    className="flex-1 px-4 py-2 bg-white border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-servweld-blue text-sm"
                                />
                                <input
                                    type="text"
                                    placeholder="Valor"
                                    value={newSpec.value}
                                    onChange={(e) => setNewSpec({ ...newSpec, value: e.target.value })}
                                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSpec())}
                                    className="flex-1 px-4 py-2 bg-white border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-servweld-blue text-sm"
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
                        </section>

                        {/* ── SUBMIT ── */}
                        <div className="pt-6 border-t border-gray-50">
                            <button
                                type="submit"
                                disabled={loading || uploading || uploadingLogo}
                                className="w-full bg-servweld-blue text-white py-4 rounded-xl font-bold hover:bg-opacity-90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-servweld-blue/20 disabled:bg-gray-300 disabled:shadow-none"
                            >
                                {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                                {id ? 'Salvar Alterações' : 'Cadastrar Equipamento'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* ── IMAGE LIGHTBOX ── */}
            {lightbox && formData.image_url && (
                <div
                    className="fixed inset-0 bg-black/80 z-[200] flex items-center justify-center p-4"
                    onClick={() => setLightbox(false)}
                >
                    <button className="absolute top-4 right-4 text-white bg-white/10 hover:bg-white/20 rounded-full p-2 transition-all">
                        <X size={28} />
                    </button>
                    <img
                        src={formData.image_url}
                        alt="Visualização"
                        className="max-w-full max-h-[90vh] object-contain rounded-2xl shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            )}
        </div>
    );
};

export default ProductForm;
