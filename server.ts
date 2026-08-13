import express from 'express';
import path from 'path';

import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();



async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Setup Supabase Client for backend
  const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
  const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || '';
  const supabase = createClient(supabaseUrl, supabaseKey);

  app.post('/api/shipping/calculate', async (req, res) => {
    try {
      const { destinationCep, weight, height, width, length } = req.body;
      
      if (!destinationCep) {
        return res.status(400).json({ error: 'CEP de destino não informado.' });
      }

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

      // Token in .env has priority, fallback to DB
      const apiToken = process.env.SUPERFRETE_TOKEN || dbToken;

      if (!apiToken) {
        return res.status(500).json({ error: 'Token da SuperFrete não configurado no painel ou no ambiente.' });
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
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
