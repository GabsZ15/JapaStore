import { createClient } from '@supabase/supabase-js';

export default async function handler(req: any, res: any) {
  // CORS setup for Vercel
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { destinationCep, weight, height, width, length } = req.body;
    
    if (!destinationCep) {
      return res.status(400).json({ error: 'CEP de destino não informado.' });
    }

    // Setup Supabase Client
    let supabaseUrl = process.env.VITE_SUPABASE_URL || '';
    const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || '';

    if (supabaseUrl === 'https://kqxluuxtnicsvwzmqjtk.supabase.co') {
      supabaseUrl = 'https://kqxluxtynicsvwzmqjtk.supabase.co';
    }
    
    if (!supabaseUrl || !supabaseKey) {
      return res.status(500).json({ error: 'Configuração do Supabase ausente.' });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch settings from Supabase to get origin CEP and token
    const { data, error } = await supabase.from('settings').select('site_content').eq('id', 1).single();
    if (error) {
      console.error('Error fetching settings for SuperFrete:', error);
    }

    let siteContent = data?.site_content || {};
    if (typeof siteContent === 'string') {
      try {
        siteContent = JSON.parse(siteContent);
      } catch(e) {}
    }

    const superfreteConfig = siteContent?.superfrete || {};
    const originCep = superfreteConfig.originCep;
    const dbToken = superfreteConfig.token;

    // Use the token configured in the Admin panel (saved in Supabase)
    const apiToken = dbToken;

    if (!apiToken) {
      return res.status(500).json({ error: 'Token da SuperFrete não configurado no painel Admin.' });
    }

    if (!originCep) {
      return res.status(500).json({ error: 'CEP de origem não configurado no painel Admin.' });
    }

    // Format CEPs
    const fromCep = originCep.replace(/\D/g, '');
    const toCep = destinationCep.replace(/\D/g, '');

    if (fromCep.length !== 8 || toCep.length !== 8) {
      return res.status(400).json({ error: 'CEP inválido.' });
    }

    // SuperFrete Payload
    const payload = {
      from: { postal_code: fromCep },
      to: { postal_code: toCep },
      services: "1,2,17,3,4", // Correios PAC, Sedex, Mini, Jadlog Package, Jadlog Com
      options: {
        own_hand: false,
        receipt: false,
        insurance_value: 0,
        use_insurance_value: false
      },
      products: [
        {
          id: "1",
          width: width || 10,
          height: height || 10,
          length: length || 10,
          weight: weight || 0.3,
          unitary_value: 10, 
          quantity: 1
        }
      ]
    };

    const sfResponse = await fetch('https://api.superfrete.com/api/v0/calculator', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiToken}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'User-Agent': 'SuperFrete/1.0'
      },
      body: JSON.stringify(payload)
    });

    const result = await sfResponse.json();
    
    if (!sfResponse.ok) {
      return res.status(sfResponse.status).json(result);
    }
    
    // If Superfrete returns { error: "...", message: "..." }
    if (result.error) {
      return res.status(400).json({ error: result.error, message: result.message });
    }

    res.json(result);
  } catch (err: any) {
    console.error('SuperFrete API Error:', err);
    res.status(500).json({ error: 'Erro interno ao calcular frete.', details: err.message });
  }
}
