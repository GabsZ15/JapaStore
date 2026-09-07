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

  // Validate allowed HTTP methods for admin product management
  if (!['POST', 'PUT', 'DELETE'].includes(req.method)) {
    return res.status(405).json({ error: 'Método não permitido para rota de produtos administrativos.' });
  }

  try {
    // Validate admin credentials and server environment variables
    const authResult = validateAdminRequest(req);
    if (!authResult.isValid || !authResult.supabaseAdmin) {
      return res.status(authResult.statusCode || 401).json({ error: authResult.errorMessage });
    }

    const supabaseAdmin = authResult.supabaseAdmin;

    // Parse JSON body safely if string
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch (e) {
        return res.status(400).json({ error: 'Corpo da requisição inválido (JSON malformado).' });
      }
    }
    body = body || {};

    if (req.method === 'POST') {
      const { name, price, category, image_url, imageUrl, description, installments } = body;
      const finalImageUrl = image_url || imageUrl;

      if (!name || price === undefined || price === null || !category || !finalImageUrl) {
        return res.status(400).json({ error: 'Campos obrigatórios ausentes: name, price, category, image_url.' });
      }

      const priceNum = typeof price === 'string' ? parseFloat(price.replace(',', '.')) : Number(price);
      if (isNaN(priceNum) || priceNum < 0) {
        return res.status(400).json({ error: 'Preço inválido.' });
      }

      const installmentsNum = installments ? Number(installments) : 1;

      const { data, error } = await supabaseAdmin
        .from('products')
        .insert({
          name,
          price: priceNum,
          category,
          image_url: finalImageUrl,
          description: description || '',
          installments: isNaN(installmentsNum) ? 1 : installmentsNum
        })
        .select()
        .single();

      if (error) {
        return res.status(500).json({ error: 'Erro ao cadastrar produto no banco de dados.', details: error.message });
      }

      return res.status(201).json({ success: true, product: data, message: 'Produto criado com sucesso.' });
    }

    if (req.method === 'PUT') {
      const { id, name, price, category, image_url, imageUrl, description, installments } = body;

      if (!id) {
        return res.status(400).json({ error: 'ID do produto é obrigatório para atualização.' });
      }

      const updatePayload: Record<string, any> = {};
      if (name !== undefined) updatePayload.name = name;
      if (price !== undefined) {
        const priceNum = typeof price === 'string' ? parseFloat(price.replace(',', '.')) : Number(price);
        if (isNaN(priceNum) || priceNum < 0) {
          return res.status(400).json({ error: 'Preço inválido.' });
        }
        updatePayload.price = priceNum;
      }
      if (category !== undefined) updatePayload.category = category;
      const finalImageUrl = image_url || imageUrl;
      if (finalImageUrl !== undefined) updatePayload.image_url = finalImageUrl;
      if (description !== undefined) updatePayload.description = description;
      if (installments !== undefined) {
        const instNum = Number(installments);
        updatePayload.installments = isNaN(instNum) ? 1 : instNum;
      }

      const { data, error } = await supabaseAdmin
        .from('products')
        .update(updatePayload)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        return res.status(500).json({ error: 'Erro ao atualizar produto no banco de dados.', details: error.message });
      }

      return res.status(200).json({ success: true, product: data, message: 'Produto atualizado com sucesso.' });
    }

    if (req.method === 'DELETE') {
      const id = body.id || req.query?.id;

      if (!id) {
        return res.status(400).json({ error: 'ID do produto é obrigatório para exclusão.' });
      }

      const { error } = await supabaseAdmin
        .from('products')
        .delete()
        .eq('id', id);

      if (error) {
        return res.status(500).json({ error: 'Erro ao excluir produto no banco de dados.', details: error.message });
      }

      return res.status(200).json({ success: true, id, message: 'Produto excluído com sucesso.' });
    }
  } catch (err: any) {
    return res.status(500).json({
      error: 'Erro interno no servidor ao processar requisição administrativa de produtos.',
      details: err.message
    });
  }
}

