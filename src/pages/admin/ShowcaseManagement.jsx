import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../../lib/supabase';
import { Plus, Trash2, Loader2, Image as ImageIcon, X, Save, GripVertical, Wand2 } from 'lucide-react';

const ShowcaseManagement = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);
    const [newItemName, setNewItemName] = useState('');
    const [newItemImage, setNewItemImage] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const fileInputRef = useRef(null);

    useEffect(() => {
        fetchShowcase();
    }, []);

    const fetchShowcase = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('site_showcase')
                .select('*')
                .order('display_order', { ascending: true });

            if (error) throw error;
            setItems(data || []);
        } catch (err) {
            console.error('Error fetching showcase:', err);
            setError('Falha ao carregar o carrossel.');
        } finally {
            setLoading(false);
        }
    };

    const removeWhiteBackground = (imgElement) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = imgElement.width;
        canvas.height = imgElement.height;
        ctx.drawImage(imgElement, 0, 0);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        // Sensibilidade para o "branco" (240-255)
        const threshold = 240;

        for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            
            // Se as três cores forem muito claras (perto do branco)
            if (r > threshold && g > threshold && b > threshold) {
                data[i + 3] = 0; // Torna transparente
            }
        }

        ctx.putImageData(imageData, 0, 0);
        return new Promise((resolve) => {
            canvas.toBlob((blob) => {
                resolve(blob);
            }, 'image/png');
        });
    };

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            setNewItemImage(file);
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
        }
    };

    const handleAddItem = async () => {
        if (!newItemName || !newItemImage) {
            setError('Por favor, insira o nome e selecione uma imagem.');
            return;
        }

        try {
            setUploading(true);
            setProcessing(true);
            setError(null);

            let finalBlob = newItemImage;

            // Se for JPG ou o usuário quiser, podemos processar a imagem
            // Aqui vamos processar sempre para garantir o PNG transparente como pedido
            const img = new Image();
            img.src = previewUrl;
            await new Promise((resolve) => (img.onload = resolve));

            finalBlob = await removeWhiteBackground(img);

            // 1. Upload to Storage
            const fileName = `${Date.now()}-showcase.png`;
            const filePath = `showcase/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('products')
                .upload(filePath, finalBlob);

            if (uploadError) throw uploadError;

            // 2. Get Public URL
            const { data: { publicUrl } } = supabase.storage
                .from('products')
                .getPublicUrl(filePath);

            // 3. Save to Database
            const { error: dbError } = await supabase
                .from('site_showcase')
                .insert([{ 
                    name: newItemName, 
                    image_url: publicUrl,
                    display_order: items.length + 1
                }]);

            if (dbError) throw dbError;

            // Reset form
            setNewItemName('');
            setNewItemImage(null);
            setPreviewUrl(null);
            if (fileInputRef.current) fileInputRef.current.value = '';
            
            fetchShowcase();
        } catch (err) {
            console.error('Error adding item:', err);
            setError('Falha ao adicionar o equipamento.');
        } finally {
            setUploading(false);
            setProcessing(false);
        }
    };

    const handleDelete = async (id, url) => {
        if (!window.confirm('Excluir este equipamento do carrossel?')) return;

        try {
            const { error: dbError } = await supabase
                .from('site_showcase')
                .delete()
                .eq('id', id);

            if (dbError) throw dbError;

            // Try storage delete
            if (url.includes('showcase/')) {
                const path = url.split('products/')[1];
                await supabase.storage.from('products').remove([path]);
            }

            setItems(items.filter(item => item.id !== id));
        } catch (err) {
            console.error('Error deleting:', err);
            alert('Erro ao excluir.');
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
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-servweld-black">Gerenciar Carrossel (Home)</h2>
                    <p className="text-gray-500 text-sm">Adicione os equipamentos que aparecem no destaque da página inicial.</p>
                    <div className="mt-2 text-xs font-bold text-servweld-blue flex items-center gap-1">
                        <Wand2 size={14} /> Sistema de remoção de fundo branco automático ativado.
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                    <div className="md:col-span-1">
                        <label className="block text-xs font-black uppercase text-gray-400 mb-2 tracking-widest">Nome do Equipamento</label>
                        <input
                            type="text"
                            value={newItemName}
                            onChange={(e) => setNewItemName(e.target.value)}
                            placeholder="Ex: MIG/MAG 400A"
                            className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-servweld-blue outline-none transition-all"
                        />
                    </div>

                    <div className="md:col-span-1">
                        <label className="block text-xs font-black uppercase text-gray-400 mb-2 tracking-widest">Imagem (JPG/PNG)</label>
                        <div className="flex gap-4">
                            <label className="flex-1 cursor-pointer">
                                <div className="px-4 py-3 bg-gray-50 border border-dashed border-gray-200 rounded-xl hover:bg-gray-100 transition-all flex items-center justify-center gap-2 text-gray-500 text-sm">
                                    <ImageIcon size={18} />
                                    {newItemImage ? newItemImage.name.substring(0, 15) + '...' : 'Selecionar Foto'}
                                </div>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleFileSelect}
                                />
                            </label>
                            {previewUrl && (
                                <div className="w-12 h-12 rounded-lg bg-gray-50 border border-gray-100 overflow-hidden shrink-0">
                                    <img src={previewUrl} alt="Preview" className="w-full h-full object-contain" />
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="md:col-span-1">
                        <button
                            onClick={handleAddItem}
                            disabled={uploading || processing}
                            className="w-full btn-primary justify-center py-3 h-[48px]"
                        >
                            {uploading ? (
                                <>
                                    <Loader2 className="animate-spin" size={20} />
                                    {processing ? 'Removendo Fundo...' : 'Subindo...'}
                                </>
                            ) : (
                                <>
                                    <Plus size={20} />
                                    Adicionar ao Carrossel
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {error && (
                    <div className="mt-4 bg-red-50 text-red-600 p-3 rounded-xl text-sm flex items-center gap-2">
                        <X size={16} /> {error}
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {items.map((item, idx) => (
                    <div key={item.id} className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden group">
                        <div className="aspect-square bg-gray-50 flex items-center justify-center relative group">
                            <img
                                src={item.image_url}
                                alt={item.name}
                                className="max-w-[80%] max-h-[80%] object-contain drop-shadow-xl group-hover:scale-110 transition-transform duration-500"
                            />
                            <div className="absolute top-4 right-4 flex gap-2 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all">
                                <button
                                    onClick={() => handleDelete(item.id, item.image_url)}
                                    className="bg-red-500 text-white p-2 rounded-lg shadow-lg hover:bg-red-600"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                        <div className="p-5 text-center bg-white">
                            <h3 className="font-bold text-servweld-black truncate" title={item.name}>{item.name}</h3>
                        </div>
                    </div>
                ))}

                {items.length === 0 && (
                    <div className="col-span-full py-20 bg-white rounded-[3rem] border-2 border-dashed border-gray-100 flex flex-col items-center justify-center text-gray-400">
                        <ImageIcon size={48} className="mb-4 opacity-10" />
                        <p className="font-medium">Nenhum equipamento no carrossel ainda.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ShowcaseManagement;
