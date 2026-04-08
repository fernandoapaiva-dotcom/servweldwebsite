import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { 
    Plus, 
    Edit2, 
    Trash2, 
    Globe, 
    Layers, 
    ShieldCheck, 
    Settings, 
    ExternalLink, 
    Save, 
    X,
    Loader2,
    ToggleLeft,
    ToggleRight
} from 'lucide-react';
import * as LucideIcons from 'lucide-react';

const ToolsManagement = () => {
    const [tools, setTools] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [editingTool, setEditingTool] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        url: '',
        description: '',
        icon: 'Layers',
        image_url: '',
        color: 'from-blue-600 to-indigo-600',
        is_active: true
    });

    useEffect(() => {
        fetchTools();
    }, []);

    const fetchTools = async () => {
        // Since the table might not exist yet, we'll try to fetch or use initial data
        try {
            const { data, error } = await supabase
                .from('internal_tools')
                .select('*')
                .order('name');

            if (!error && data) {
                setTools(data);
            } else {
                // Initial demo data if table doesn't exist (handled by Supabase error)
                setTools([
                    { id: 1, name: 'Credos', url: 'http://167.234.252.109/login', description: 'Rastreabilidade de Soldagem', icon: 'ShieldCheck', image_url: '', color: 'from-blue-600 to-indigo-600', is_active: true },
                    { id: 2, name: 'Tradutor PDF', url: '#', description: 'Tradução Técnica AI', icon: 'Layers', image_url: '', color: 'from-emerald-500 to-teal-600', is_active: true }
                ]);
            }
        } catch (e) {
            console.error(e);
        }
        setLoading(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setActionLoading(true);

        // This would interact with the 'internal_tools' table
        // For now, we'll update the local state to show progress
        if (editingTool) {
            setTools(tools.map(t => t.id === editingTool.id ? { ...t, ...formData } : t));
            alert('Configuração atualizada! (Simulado por agora, requer tabela no Supabase)');
        } else {
            const newTool = { ...formData, id: Date.now() };
            setTools([...tools, newTool]);
            alert('Nova ferramenta adicionada! (Simulado)');
        }

        setShowForm(false);
        setEditingTool(null);
        setActionLoading(false);
        setFormData({ name: '', url: '', description: '', icon: 'Layers', color: 'from-blue-600 to-indigo-600', is_active: true });
    };

    const handleEdit = (tool) => {
        setEditingTool(tool);
        setFormData(tool);
        setShowForm(true);
    };

    const handleDelete = (id) => {
        if (window.confirm('Tem certeza que deseja remover esta ferramenta do Hub?')) {
            setTools(tools.filter(t => t.id !== id));
        }
    };

    const toggleStatus = (tool) => {
        setTools(tools.map(t => t.id === tool.id ? { ...t, is_active: !t.is_active } : t));
    };

    const IconPreview = ({ name }) => {
        const Icon = LucideIcons[name] || LucideIcons.Layers;
        return <Icon size={20} />;
    };

    if (loading) return <div className="p-20 flex justify-center"><Loader2 className="animate-spin text-servweld-blue" size={40} /></div>;

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        <Globe className="text-servweld-blue" size={24} />
                        Gerenciador do Hub Interno
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">Configure as ferramentas que aparecem na Área Restrita / Hub.</p>
                </div>
                <button
                    onClick={() => {
                        setShowForm(!showForm);
                        setEditingTool(null);
                        setFormData({ name: '', url: '', description: '', icon: 'Layers', color: 'from-blue-600 to-indigo-600', is_active: true });
                    }}
                    className="bg-servweld-blue text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-opacity-90 transition-all text-sm"
                >
                    {showForm ? <X size={18} /> : <Plus size={18} />}
                    {showForm ? 'Cancelar' : 'Nova Ferramenta'}
                </button>
            </div>

            {showForm && (
                <form onSubmit={handleSubmit} className="bg-blue-50/50 p-8 rounded-2xl border border-blue-100 space-y-6 animate-in zoom-in-95 duration-300">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Nome do Sistema</label>
                            <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-servweld-blue"
                                placeholder="ex: Credos Dashboard"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">URL de Destino</label>
                            <input
                                type="url"
                                required
                                value={formData.url}
                                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-servweld-blue"
                                placeholder="http://167..."
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-bold text-gray-700 mb-2">Descrição Breve</label>
                            <input
                                type="text"
                                required
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-servweld-blue"
                                placeholder="O que este sistema faz?"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">URL da Imagem (Logo Customizada)</label>
                            <input
                                type="url"
                                value={formData.image_url}
                                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-servweld-blue"
                                placeholder="https://exemplo.com/logo.png"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Ícone (Nome Lucide)</label>
                            <div className="flex gap-3">
                                <input
                                    type="text"
                                    value={formData.icon}
                                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                                    className="flex-1 px-4 py-3 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-servweld-blue"
                                    placeholder="ShieldCheck, Layers, Rocket..."
                                />
                                <div className="w-14 h-14 bg-white border border-gray-200 rounded-xl flex items-center justify-center text-servweld-blue overflow-hidden">
                                    {formData.image_url ? (
                                        <img src={formData.image_url} alt="" className="w-full h-full object-cover" />
                                    ) : (
                                        <IconPreview name={formData.icon} />
                                    )}
                                </div>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Gradiente (Tailwind classes)</label>
                            <input
                                type="text"
                                value={formData.color}
                                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-servweld-blue"
                                placeholder="from-blue-600 to-indigo-600"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={actionLoading}
                        className="bg-servweld-blue text-white px-8 py-3 rounded-xl font-bold hover:bg-opacity-90 transition-all flex items-center gap-2 shadow-lg shadow-servweld-blue/20"
                    >
                        {actionLoading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                        {editingTool ? 'Salvar Mudanças' : 'Adicionar ao Hub'}
                    </button>
                </form>
            )}

            <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Sistema</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Link</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {tools.map((tool) => (
                            <tr key={tool.id} className="hover:bg-gray-50/50 transition-colors group">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-10 h-10 bg-gradient-to-tr ${tool.color} rounded-lg flex items-center justify-center text-white shadow-sm shrink-0`}>
                                            <IconPreview name={tool.icon} />
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900">{tool.name}</p>
                                            <p className="text-xs text-gray-400 max-w-[200px] truncate">{tool.description}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <a href={tool.url} target="_blank" rel="noreferrer" className="text-sm text-servweld-blue hover:underline flex items-center gap-1">
                                        {tool.url.substring(0, 30)}...
                                        <ExternalLink size={12} />
                                    </a>
                                </td>
                                <td className="px-6 py-4">
                                    <button 
                                        onClick={() => toggleStatus(tool)}
                                        className={`flex items-center gap-2 text-xs font-bold px-3 py-1 rounded-full transition-all ${tool.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'}`}
                                    >
                                        {tool.is_active ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
                                        {tool.is_active ? 'ATIVO' : 'OCULTO'}
                                    </button>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <button onClick={() => handleEdit(tool)} className="p-2 text-gray-400 hover:text-servweld-blue rounded-lg hover:bg-servweld-blue/5 transition-all"><Edit2 size={18} /></button>
                                        <button onClick={() => handleDelete(tool.id)} className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-all"><Trash2 size={18} /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            
            <div className="p-6 bg-blue-50 rounded-2xl border border-blue-100 flex items-center justify-between">
                <div className="flex gap-4 items-center">
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-servweld-blue shadow-sm">
                        <Settings size={24} />
                    </div>
                    <div>
                        <p className="font-bold text-blue-900">Dica de Configuração</p>
                        <p className="text-sm text-blue-700">As ordens e cores definidas aqui serão refletidas instantaneamente para todos os funcionários no Hub.</p>
                    </div>
                </div>
                <a href="/hub" target="_blank" className="bg-white text-servweld-blue px-4 py-2 rounded-lg text-sm font-bold shadow-sm hover:shadow-md transition-all flex items-center gap-2">
                    Visualizar Hub
                    <ExternalLink size={16} />
                </a>
            </div>
        </div>
    );
};

export default ToolsManagement;
