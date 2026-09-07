import { validateAdminRequest } from './_adminAuth';

export default async function handler(req: any, res: any) {
  // CORS setup for Vercel Serverless Function
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, X-Admin-Secret'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Validate allowed HTTP method for admin settings update
  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Método não permitido para rota de configurações administrativas.' });
  }

  try {
    // Validate admin credentials and server environment variables
    const authResult = validateAdminRequest(req);
    if (!authResult.isValid || !authResult.supabaseAdmin) {
      return res.status(authResult.statusCode || 401).json({ error: authResult.errorMessage });
    }

    const supabaseAdmin = authResult.supabaseAdmin;

    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch (e) {
        return res.status(400).json({ error: 'Corpo da requisição inválido (JSON malformado).' });
      }
    }
    body = body || {};

    const {
      topBarText,
      heroTitle,
      heroSubtitle,
      carouselTitle,
      whatsappNumber,
      navLink1,
      navLink2,
      navLink3,
      navLink4,
      siteContent
    } = body;

    const payload: Record<string, any> = {
      id: 1,
      updated_at: new Date().toISOString()
    };

    if (topBarText !== undefined) payload.top_bar_text = topBarText;
    if (heroTitle !== undefined) payload.hero_title = heroTitle;
    if (heroSubtitle !== undefined) payload.hero_subtitle = heroSubtitle;
    if (carouselTitle !== undefined) payload.carousel_title = carouselTitle;
    if (whatsappNumber !== undefined) payload.whatsapp_number = whatsappNumber;
    if (navLink1 !== undefined) payload.nav_link1 = navLink1;
    if (navLink2 !== undefined) payload.nav_link2 = navLink2;
    if (navLink3 !== undefined) payload.nav_link3 = navLink3;
    if (navLink4 !== undefined) payload.nav_link4 = navLink4;
    if (siteContent !== undefined) payload.site_content = siteContent;

    // First attempt to upsert with all payload fields (including site_content)
    let { data, error } = await supabaseAdmin
      .from('settings')
      .upsert(payload)
      .select()
      .single();

    if (error && error.code === '42703') {
      // Column site_content missing in DB fallback
      delete payload.site_content;
      const retryResult = await supabaseAdmin
        .from('settings')
        .upsert(payload)
        .select()
        .single();
      data = retryResult.data;
      error = retryResult.error;
    }

    if (error) {
      return res.status(500).json({ error: 'Erro ao atualizar configurações no banco de dados.', details: error.message });
    }

    return res.status(200).json({ success: true, settings: data, message: 'Configurações atualizadas com sucesso.' });
  } catch (err: any) {
    return res.status(500).json({
      error: 'Erro interno no servidor ao processar requisição administrativa de configurações.',
      details: err.message
    });
  }
}

