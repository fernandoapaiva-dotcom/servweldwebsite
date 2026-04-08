// Servweld: Manual de deploy desta função:
// npx supabase functions deploy notify-resume --project-ref [SEU_PROJECT_ID]

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY")

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Chamada de preflight do CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { full_name, email, phone, area, resume_url } = await req.json()

    console.log(`Recebido currículo de ${full_name} para a área ${area}`);

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'Servweld Recrutamento <onboarding@resend.dev>', // No plano grátis ele usa este e-mail padrão
        to: ['comercial@servweld.com.br'],
        subject: `Novo Currículo: ${full_name} (${area})`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 12px; overflow: hidden;">
            <div style="background-color: #0061FF; padding: 30px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 24px;">Novo Candidato Recebido</h1>
            </div>
            <div style="padding: 30px; color: #333;">
              <p>Olá Equipe Comercial,</p>
              <p>Um novo currículo foi enviado através do site da Servweld.</p>
              
              <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p><strong>Nome:</strong> ${full_name}</p>
                <p><strong>E-mail:</strong> ${email}</p>
                <p><strong>Telefone:</strong> ${phone}</p>
                <p><strong>Área de Interesse:</strong> ${area}</p>
              </div>

              <div style="text-align: center; margin-top: 30px;">
                <a href="${resume_url}" style="background-color: #0061FF; color: white; padding: 14px 25px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                  Visualizar Currículo (PDF)
                </a>
              </div>
            </div>
            <div style="background-color: #f4f4f4; padding: 20px; text-align: center; font-size: 12px; color: #999;">
              Este é um e-mail automático do sistema Servweld Intelligence Technology.
            </div>
          </div>
        `,
      }),
    })

    const data = await res.json()

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
