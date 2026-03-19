import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

const setupStorage = async () => {
    console.log('🚀 Iniciando configuração do Storage...');

    try {
        // 1. Verificar se o bucket existe
        const { data: buckets, error: listError } = await supabase.storage.listBuckets();
        if (listError) throw listError;

        const bucketName = 'products';
        const bucketExists = buckets.find(b => b.name === bucketName);

        if (!bucketExists) {
            console.log(`📦 Criando bucket "${bucketName}"...`);
            const { error: createError } = await supabase.storage.createBucket(bucketName, {
                public: true,
                allowedMimeTypes: ['image/*'],
                fileSizeLimit: 5242880 // 5MB
            });
            if (createError) throw createError;
            console.log('✅ Bucket criado com sucesso!');
        } else {
            console.log(`✅ Bucket "${bucketName}" já existe.`);
        }

        // 2. Garantir que o bucket seja público (caso já existisse mas estivesse privado)
        if (bucketExists && !bucketExists.public) {
            console.log('🔓 Tornando o bucket público...');
            const { error: updateError } = await supabase.storage.updateBucket(bucketName, {
                public: true
            });
            if (updateError) throw updateError;
        }

        console.log('✨ Configuração de Storage concluída!');
        console.log('Agora você pode tentar subir as fotos novamente no painel.');

    } catch (error) {
        console.error('❌ ERRO:', error.message);
    }
};

setupStorage();
