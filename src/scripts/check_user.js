import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // I'll pass this via --env-file or command line

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

const checkUser = async () => {
  try {
    const { data: { users }, error } = await supabase.auth.admin.listUsers();
    
    if (error) throw error;

    const targetEmail = 'webmaster@servweld.com.br';
    const user = users.find(u => u.email === targetEmail);

    if (user) {
      console.log(`✅ USUÁRIO ENCONTRADO: ${targetEmail}`);
      console.log(`ID: ${user.id}`);
      console.log(`Confirmado em: ${user.email_confirmed_at || 'MÃO CONFIRMADO'}`);
      console.log(`Último login: ${user.last_sign_in_at || 'Nunca'}`);
    } else {
      console.log(`❌ USUÁRIO NÃO ENCONTRADO: ${targetEmail}`);
      console.log('Total de usuários na base:', users.length);
    }

  } catch (error) {
    console.error('❌ ERRO:', error.message);
  }
};

checkUser();
