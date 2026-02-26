import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Plus, Edit2, Trash2, LogOut, Package, Search, ExternalLink, ShieldCheck, Globe, Settings as SettingsIcon, Users, Image as ImageIcon, Menu, X } from 'lucide-react';
import SettingsForm from './SettingsForm';
import UserManagement from './UserManagement';
import GalleryManagement from './GalleryManagement';

const Dashboard = () => {
    const [products, setProducts] = useState([]);
    const [brands, setBrands] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const activeTab = searchParams.get('tab') || 'products';

    useEffect(() => {
        checkUser();
        if (activeTab === 'products') {
            fetchProducts();
        } else {
            fetchBrands();
        }
    }, [activeTab]);

    const checkUser = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) navigate('/admin/login');
    };

    const fetchProducts = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .order('created_at', { ascending: false });

        if (!error && data) setProducts(data);
        setLoading(false);
    };

    const fetchBrands = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('brands')
            .select('*')
            .order('name', { ascending: true });

        if (!error && data) setBrands(data);
        setLoading(false);
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/admin/login');
    };

    const handleDeleteProduct = async (id) => {
        if (window.confirm('Tem certeza que deseja excluir este equipamento?')) {
            const { error } = await supabase
                .from('products')
                .delete()
                .eq('id', id);

            if (!error) {
                setProducts(products.filter(p => p.id !== id));
            }
        }
    };

    const handleDeleteBrand = async (id) => {
        if (window.confirm('Tem certeza que deseja excluir esta marca?')) {
            const { error } = await supabase
                .from('brands')
                .delete()
                .eq('id', id);

            if (!error) {
                setBrands(brands.filter(b => b.id !== id));
            }
        }
    };

    const filteredItems = activeTab === 'products'
        ? products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.category.toLowerCase().includes(searchTerm.toLowerCase()))
        : brands.filter(b => b.name.toLowerCase().includes(searchTerm.toLowerCase()));

    const ProductsTable = () => (
        <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead>
                    <tr className="bg-gray-50 text-gray-400 text-xs font-bold uppercase tracking-wider">
                        <th className="px-6 py-4">Equipamento</th>
                        <th className="px-6 py-4">Categoria</th>
                        <th className="px-6 py-4 text-center">Ações</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                    {loading ? (
                        <tr><td colSpan="3" className="px-6 py-20 text-center text-gray-400">Carregando...</td></tr>
                    ) : filteredItems.length === 0 ? (
                        <tr><td colSpan="3" className="px-6 py-20 text-center text-gray-500">Nenhum equipamento encontrado.</td></tr>
                    ) : (
                        filteredItems.map((p) => (
                            <tr key={p.id} className="hover:bg-gray-50 transition-colors group">
                                <td className="px-6 py-5">
                                    <div className="font-bold text-gray-900 group-hover:text-servweld-blue transition-colors">{p.name}</div>
                                    <div className="text-sm text-gray-400">{p.type} • {p.amperage}A</div>
                                </td>
                                <td className="px-6 py-5">
                                    <span className="px-3 py-1 bg-servweld-blue/5 text-servweld-blue text-xs font-bold rounded-full">{p.category}</span>
                                </td>
                                <td className="px-6 py-5">
                                    <div className="flex items-center justify-center gap-2">
                                        <button onClick={() => navigate(`/admin/editor/${p.id}`)} className="p-2 text-gray-400 hover:text-servweld-blue hover:bg-servweld-blue/5 rounded-lg transition-all"><Edit2 size={18} /></button>
                                        <button onClick={() => handleDeleteProduct(p.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"><Trash2 size={18} /></button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );

    const BrandsTable = () => (
        <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead>
                    <tr className="bg-gray-50 text-gray-400 text-xs font-bold uppercase tracking-wider">
                        <th className="px-6 py-4">Fabricante</th>
                        <th className="px-6 py-4">Website</th>
                        <th className="px-6 py-4 text-center">Ações</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                    {loading ? (
                        <tr><td colSpan="3" className="px-6 py-20 text-center text-gray-400">Carregando...</td></tr>
                    ) : filteredItems.length === 0 ? (
                        <tr><td colSpan="3" className="px-6 py-20 text-center text-gray-500">Nenhuma marca encontrada.</td></tr>
                    ) : (
                        filteredItems.map((b) => (
                            <tr key={b.id} className="hover:bg-gray-50 transition-colors group">
                                <td className="px-6 py-5">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-white border border-gray-100 rounded-lg p-1 flex items-center justify-center shrink-0">
                                            {b.logo_url ? <img src={b.logo_url} alt={b.name} className="max-w-full max-h-full object-contain" /> : <ShieldCheck className="text-gray-200" />}
                                        </div>
                                        <div className="font-bold text-gray-900 group-hover:text-servweld-blue transition-colors">{b.name}</div>
                                    </div>
                                </td>
                                <td className="px-6 py-5">
                                    <a href={b.url} target="_blank" rel="noreferrer" className="text-sm text-gray-400 hover:text-servweld-blue flex items-center gap-1 transition-colors">
                                        {b.url?.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '') || '---'}
                                        <ExternalLink size={12} />
                                    </a>
                                </td>
                                <td className="px-6 py-5">
                                    <div className="flex items-center justify-center gap-2">
                                        <button onClick={() => navigate(`/admin/marcas/editor/${b.id}`)} className="p-2 text-gray-400 hover:text-servweld-blue hover:bg-servweld-blue/5 rounded-lg transition-all"><Edit2 size={18} /></button>
                                        <button onClick={() => handleDeleteBrand(b.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"><Trash2 size={18} /></button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );

    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Mobile Toggle */}
            <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="lg:hidden fixed top-4 right-4 z-[60] bg-servweld-blue text-white p-3 rounded-xl shadow-lg"
            >
                {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Sidebar Overlay */}
            {menuOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-[50] lg:hidden"
                    onClick={() => setMenuOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`w-64 bg-white border-r border-gray-100 flex flex-col fixed h-full z-[55] transition-transform duration-300 lg:translate-x-0 ${menuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="p-8 border-b border-gray-50">
                    <h2 className="text-xl font-bold text-servweld-blue">Servweld Admin</h2>
                </div>
                <nav className="flex-1 p-4 space-y-2">
                    {[
                        { id: 'products', label: 'Equipamentos', icon: <Package size={20} /> },
                        { id: 'brands', label: 'Marcas / Fabricantes', icon: <ShieldCheck size={20} /> },
                        { id: 'gallery', label: 'Galeria (Quem Somos)', icon: <ImageIcon size={20} /> },
                        { id: 'settings', label: 'Portal (Home)', icon: <SettingsIcon size={20} /> },
                        { id: 'users', label: 'Gestão de Time', icon: <Users size={20} /> },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => {
                                navigate(`/admin?tab=${tab.id}`);
                                setMenuOpen(false);
                            }}
                            className={`flex items-center gap-3 p-3 w-full rounded-xl font-medium transition-all ${activeTab === tab.id ? 'bg-servweld-blue/5 text-servweld-blue' : 'text-gray-500 hover:bg-gray-50'}`}
                        >
                            {tab.icon}
                            {tab.label}
                        </button>
                    ))}
                </nav>
                <div className="p-4 border-t border-gray-50">
                    <button onClick={handleLogout} className="flex items-center gap-3 p-3 w-full text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all">
                        <LogOut size={20} />
                        Sair
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-4 md:p-8 lg:ml-64 min-h-screen">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            {activeTab === 'products' ? 'Gerenciar Equipamentos' :
                                activeTab === 'brands' ? 'Gerenciar Fabricantes' :
                                    activeTab === 'gallery' ? 'Gerenciar Galeria' :
                                        activeTab === 'users' ? 'Administradores do Sistema' :
                                            'Configurações de Layout'}
                        </h1>
                        <p className="text-gray-500 mt-1">
                            {activeTab === 'products' ? 'Adicione, edite ou remova itens da área de locação' :
                                activeTab === 'brands' ? 'Gerencie as logomarcas e links de assistência' :
                                    activeTab === 'users' ? 'Gerencie quem pode acessar este painel' :
                                        'Ajuste os textos e mídias da página principal'}
                        </p>
                    </div>
                    {['products', 'brands'].includes(activeTab) && (
                        <button
                            onClick={() => navigate(activeTab === 'products' ? '/admin/editor' : '/admin/marcas/editor')}
                            className="bg-servweld-blue text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-opacity-90 transition-all shadow-lg shadow-servweld-blue/20"
                        >
                            <Plus size={20} />
                            {activeTab === 'products' ? 'Novo Equipamento' : 'Nova Marca'}
                        </button>
                    )}
                </div>

                {activeTab === 'settings' ? (
                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
                        <SettingsForm />
                    </div>
                ) : activeTab === 'users' ? (
                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
                        <UserManagement />
                    </div>
                ) : activeTab === 'gallery' ? (
                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
                        <GalleryManagement />
                    </div>
                ) : (
                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-6 border-b border-gray-50 flex flex-col md:flex-row gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    placeholder={`Buscar por ${activeTab === 'products' ? 'nome ou categoria' : 'fabricante'}...`}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-servweld-blue outline-none transition-all"
                                />
                            </div>
                        </div>

                        {activeTab === 'products' ? <ProductsTable /> : <BrandsTable />}

                        <div className="p-4 bg-gray-50 border-t border-gray-100 text-xs text-gray-400 flex justify-between items-center">
                            <span>Total: {filteredItems.length} itens</span>
                            <a href={activeTab === 'products' ? '/locacao' : '/assistencia'} target="_blank" className="flex items-center gap-1 hover:text-servweld-blue transition-colors">
                                Ver site público <ExternalLink size={12} />
                            </a>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default Dashboard;
