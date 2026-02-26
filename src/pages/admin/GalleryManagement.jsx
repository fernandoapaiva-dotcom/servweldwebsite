import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Plus, Trash2, Loader2, Image as ImageIcon, X, Zap } from 'lucide-react';

const GalleryManagement = () => {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchImages();
    }, []);

    const fetchImages = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('gallery')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setImages(data || []);
        } catch (err) {
            console.error('Error fetching gallery:', err);
            setError('Falha ao carregar a galeria.');
        } finally {
            setLoading(false);
        }
    };

    const handleUpload = async (e) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        try {
            setUploading(true);
            setError(null);

            const uploadPromises = files.map(async (file) => {
                // 1. Upload to Storage
                const fileExt = file.name.split('.').pop();
                const fileName = `${Math.random()}.${fileExt}`;
                const filePath = `gallery/${fileName}`;

                const { error: uploadError } = await supabase.storage
                    .from('products')
                    .upload(filePath, file);

                if (uploadError) throw uploadError;

                // 2. Get Public URL
                const { data: { publicUrl } } = supabase.storage
                    .from('products')
                    .getPublicUrl(filePath);

                // 3. Save to Database
                const { error: dbError } = await supabase
                    .from('gallery')
                    .insert([{ url: publicUrl }]);

                if (dbError) throw dbError;
            });

            await Promise.all(uploadPromises);
            fetchImages();
        } catch (err) {
            console.error('Error uploading:', err);
            setError('Falha ao subir as imagens.');
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (id, url) => {
        if (!window.confirm('Tem certeza que deseja remover esta foto da galeria?')) return;

        try {
            // 1. Delete from Database
            const { error: dbError } = await supabase
                .from('gallery')
                .delete()
                .eq('id', id);

            if (dbError) throw dbError;

            // 2. Try to delete from storage if it's a supabase URL
            if (url.includes('products/gallery/')) {
                const path = url.split('products/')[1];
                await supabase.storage.from('products').remove([path]);
            }

            setImages(images.filter(img => img.id !== id));
        } catch (err) {
            console.error('Error deleting:', err);
            alert('Erro ao excluir a imagem.');
        }
    };

    const handleSeedGallery = async () => {
        try {
            setUploading(true);
            const initialPhotos = [
                '/assets/images/quem_somos/2023-07-21 (1).webp',
                '/assets/images/quem_somos/2023-07-21.webp',
                '/assets/images/quem_somos/488600283_1205481588246343_4657023859825849505_n.jpg',
                '/assets/images/quem_somos/488602423_1206476031480232_157961674803988907_n.jpg',
                '/assets/images/quem_somos/491848352_1218164106978091_1114730255081384490_n.jpg',
                '/assets/images/quem_somos/Já conhece ou ouviu falar nos consumíveis de solda TIG PYREX Os consumíveis Pyrex são componente.jpg',
                '/assets/images/quem_somos/SAE Ouro 2024!!! Obrigado @esab_brasil aqui a parceria é forte!!.jpg',
                '/assets/images/quem_somos/unnamed (1).webp',
                '/assets/images/quem_somos/unnamed (2).webp',
                '/assets/images/quem_somos/unnamed (3).jpg',
                '/assets/images/quem_somos/unnamed (4).webp',
                '/assets/images/quem_somos/unnamed (5).webp',
                '/assets/images/quem_somos/unnamed.webp'
            ];

            const { error: seedError } = await supabase
                .from('gallery')
                .insert(initialPhotos.map(url => ({ url })));

            if (seedError) throw seedError;
            fetchImages();
        } catch (err) {
            console.error('Error seeding gallery:', err);
            setError('Falha ao carregar fotos iniciais.');
        } finally {
            setUploading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center p-20">
                <Loader2 className="animate-spin text-servweld-blue" size={40} />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <div>
                    <h2 className="text-2xl font-bold text-servweld-black">Galeria Quem Somos</h2>
                    <p className="text-gray-500 text-sm">Gerencie as fotos que aparecem no carrossel da página de contato.</p>
                </div>

                <div className="flex gap-2">
                    {images.length === 0 && !loading && (
                        <button
                            onClick={handleSeedGallery}
                            disabled={uploading}
                            className="px-4 py-2 border border-servweld-blue text-servweld-blue rounded-xl font-bold hover:bg-servweld-blue hover:text-white transition-all text-sm flex items-center gap-2"
                        >
                            {uploading ? <Loader2 className="animate-spin" size={16} /> : <Zap size={16} />}
                            Carregar Fotos Iniciais
                        </button>
                    )}
                    <label className="btn-primary cursor-pointer flex items-center gap-2">
                        {uploading ? <Loader2 className="animate-spin" size={20} /> : <Plus size={20} />}
                        {uploading ? 'Subindo...' : 'Novas Fotos'}
                        <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={handleUpload}
                            disabled={uploading}
                            multiple
                        />
                    </label>
                </div>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-xl flex items-center gap-3">
                    <X size={20} />
                    {error}
                </div>
            )}

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {images.map((img) => (
                    <div key={img.id} className="relative group aspect-square rounded-xl overflow-hidden bg-gray-100 border border-gray-100">
                        <img
                            src={img.url}
                            alt="Gallery item"
                            className="w-full h-full object-cover transition-transform group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <button
                                onClick={() => handleDelete(img.id, img.url)}
                                className="bg-red-500 text-white p-3 rounded-full hover:bg-red-600 transition-colors shadow-lg"
                                title="Excluir imagem"
                            >
                                <Trash2 size={20} />
                            </button>
                        </div>
                    </div>
                ))}

                {images.length === 0 && (
                    <div className="col-span-full py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400">
                        <ImageIcon size={48} className="mb-4 opacity-20" />
                        <p>Nenhuma foto na galeria ainda.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default GalleryManagement;
