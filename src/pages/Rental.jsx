import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, SlidersHorizontal, CheckCircle2, Search, X, Loader2 } from 'lucide-react';
import { rentalProducts as staticProducts } from '../data/products';
import { supabase } from '../lib/supabase';
import SEO from '../components/SEO';
import { useContact } from '../context/ContactContext';

const Rental = () => {
    const { whatsapp } = useContact();
    const [products, setProducts] = useState(staticProducts);
    const [loading, setLoading] = useState(true);
    const [filterCategory, setFilterCategory] = useState('All');
    const [filterAmperage, setFilterAmperage] = useState('All');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .order('created_at', { ascending: false });

            if (!error && data && data.length > 0) {
                setProducts(data);
            }
        } catch (err) {
            console.error('Error fetching dynamic products:', err);
        } finally {
            setLoading(false);
        }
    };

    const categories = ['All', ...new Set(products.map(p => p.category))];
    const amperages = ['All', '100', '200', '250', '315', '400', '450'];

    const filteredProducts = products.filter(product => {
        const categoryMatch = filterCategory === 'All' || product.category === filterCategory;
        const amperageMatch = filterAmperage === 'All' || (product.amperage && product.amperage.toString() === filterAmperage);
        return categoryMatch && amperageMatch;
    });

    const FilterSidebar = () => (
        <div className="space-y-8">
            <div>
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <Filter size={18} className="text-servweld-blue" />
                    Categorias
                </h3>
                <div className="flex flex-col gap-2">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setFilterCategory(cat)}
                            className={`text-left px-4 py-2 rounded-lg transition-all ${filterCategory === cat
                                ? 'bg-servweld-blue text-white shadow-md'
                                : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                                }`}
                        >
                            {cat === 'All' ? 'Todas as Categorias' : cat}
                        </button>
                    ))}
                </div>
            </div>

            <div>
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <SlidersHorizontal size={18} className="text-servweld-blue" />
                    Amperagem (A)
                </h3>
                <div className="grid grid-cols-2 gap-2">
                    {amperages.map(amp => (
                        <button
                            key={amp}
                            onClick={() => setFilterAmperage(amp)}
                            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${filterAmperage === amp
                                ? 'bg-servweld-blue text-white shadow-md'
                                : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                                }`}
                        >
                            {amp === 'All' ? 'Todas' : `${amp}A`}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );

    return (
        <>
            <SEO
                title="Locação de Equipamentos"
                description="Confira nosso catálogo de locação: MIG/MAG, TIG, Corte Plasma e compressores. Equipamentos revisados para sua obra ou indústria."
            />

            <div className="bg-gray-50 min-h-screen py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-12">
                        <h1 className="text-4xl font-extrabold mb-4">Catálogo de Locação</h1>
                        <p className="text-gray-600">Encontre o equipamento ideal para seu projeto com filtros avançados.</p>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Desktop Sidebar */}
                        <aside className="hidden lg:block w-64 shrink-0 transition-opacity">
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-28">
                                <FilterSidebar />
                            </div>
                        </aside>

                        {/* Mobile Filter Button */}
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="lg:hidden flex items-center justify-center gap-2 bg-white p-4 rounded-xl shadow-sm border border-gray-100 font-bold text-servweld-blue mb-6"
                        >
                            <Filter size={20} />
                            Filtrar Equipamentos
                        </button>

                        {/* Product Grid */}
                        <main className="flex-grow">
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                <AnimatePresence mode="popLayout">
                                    {loading ? (
                                        <div className="col-span-full py-20 flex flex-col items-center gap-4 text-gray-400">
                                            <Loader2 size={40} className="animate-spin text-servweld-blue" />
                                            <p>Carregando equipamentos...</p>
                                        </div>
                                    ) : filteredProducts.length > 0 ? (
                                        filteredProducts.map((product) => (
                                            <motion.div
                                                layout
                                                key={product.id}
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.9 }}
                                                transition={{ duration: 0.2 }}
                                                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-gray-100 flex flex-col"
                                            >
                                                <div className="h-48 bg-gray-100 flex items-center justify-center relative overflow-hidden group">
                                                    {product.image_url ? (
                                                        <img
                                                            src={product.image_url}
                                                            alt={product.name}
                                                            className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-500"
                                                        />
                                                    ) : (
                                                        <Search className="text-gray-400 opacity-20 group-hover:scale-150 transition-transform duration-500" size={100} />
                                                    )}
                                                    <div className="absolute top-4 left-4">
                                                        <span className="bg-servweld-blue text-white text-[10px] uppercase font-bold px-2 py-1 rounded shadow-sm">
                                                            {product.category}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="p-6 flex-grow flex flex-col">
                                                    <div className="mb-4">
                                                        <h3 className="text-xl font-bold mb-1">{product.name}</h3>
                                                        <p className="text-gray-500 text-sm">{product.type}</p>
                                                    </div>

                                                    <div className="space-y-2 mb-6 text-sm text-gray-600">
                                                        <div className="flex items-center gap-2">
                                                            <CheckCircle2 size={16} className="text-green-500" />
                                                            <span>{product.amperage > 0 ? `${product.amperage} Amperes` : 'Especializado'}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <CheckCircle2 size={16} className="text-green-500" />
                                                            <span>Manutenção Preventiva Inclusa</span>
                                                        </div>
                                                    </div>

                                                    <p className="text-gray-600 text-sm mb-6 line-clamp-3">
                                                        {product.description}
                                                    </p>

                                                    {product.specifications && Object.keys(product.specifications).length > 0 && (
                                                        <div className="mb-6 rounded-xl border border-gray-100 overflow-hidden bg-gray-50/50">
                                                            <div className="bg-gray-100 px-3 py-1.5 text-[10px] uppercase font-bold text-gray-500 tracking-wider">
                                                                Especificações Técnicas
                                                            </div>
                                                            <div className="divide-y divide-gray-100">
                                                                {Object.entries(product.specifications).map(([key, value]) => (
                                                                    <div key={key} className="flex justify-between px-3 py-2 text-xs">
                                                                        <span className="font-medium text-gray-500">{key}</span>
                                                                        <span className="font-bold text-gray-900 text-right">{value}</span>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}

                                                    <div className="mt-auto">
                                                        <a
                                                            href={`https://wa.me/${whatsapp}?text=Olá, gostaria de saber a disponibilidade do equipamento: ${product.name}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="w-full btn-outline justify-center border-servweld-blue/30"
                                                        >
                                                            Consultar Disponibilidade
                                                        </a>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))
                                    ) : (
                                        <div className="col-span-full py-20 text-center">
                                            <div className="bg-white p-12 rounded-3xl shadow-sm border border-dashed border-gray-300">
                                                <p className="text-xl text-gray-500">Nenhum equipamento encontrado com estes filtros.</p>
                                                <button
                                                    onClick={() => { setFilterCategory('All'); setFilterAmperage('All'); }}
                                                    className="mt-4 text-servweld-blue font-bold hover:underline"
                                                >
                                                    Limpar Filtros
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </main>
                    </div>
                </div>
            </div>

            {/* Mobile Sidebar Modal */}
            <AnimatePresence>
                {isSidebarOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsSidebarOpen(false)}
                            className="fixed inset-0 bg-black/50 z-[60]"
                        />
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            className="fixed right-0 top-0 h-full w-4/5 max-w-sm bg-white z-[70] shadow-2xl p-6"
                        >
                            <div className="flex justify-between items-center mb-8">
                                <h2 className="text-2xl font-bold">Filtros</h2>
                                <button onClick={() => setIsSidebarOpen(false)} className="p-2 hover:bg-gray-100 rounded-full">
                                    <X size={24} />
                                </button>
                            </div>
                            <FilterSidebar />
                            <button
                                onClick={() => setIsSidebarOpen(false)}
                                className="w-full btn-primary justify-center mt-12 py-4"
                            >
                                Ver {filteredProducts.length} Resultados
                            </button>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
};

export default Rental;
