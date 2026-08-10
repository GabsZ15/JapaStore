-- 1. LIMPAR TABELAS ANTIGAS (Isso garante que não haverá erro de "relation already exists")
DROP TABLE IF EXISTS public.products CASCADE;
DROP TABLE IF EXISTS public.settings CASCADE;

-- 2. CRIAR TABELA DE PRODUTOS
CREATE TABLE public.products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  price NUMERIC NOT NULL,
  installments INTEGER DEFAULT 1,
  discount INTEGER,
  category TEXT,
  description TEXT,
  image_url TEXT,
  out_of_stock BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. CRIAR TABELA DE CONFIGURAÇÕES
CREATE TABLE public.settings (
  id INTEGER PRIMARY KEY DEFAULT 1,
  top_bar_text TEXT,
  hero_title TEXT,
  hero_subtitle TEXT,
  carousel_title TEXT,
  whatsapp_number TEXT,
  nav_link1 TEXT,
  nav_link2 TEXT,
  nav_link3 TEXT,
  nav_link4 TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. INSERIR CONFIGURAÇÕES INICIAIS
INSERT INTO public.settings (id, top_bar_text, hero_title, hero_subtitle, carousel_title, whatsapp_number, nav_link1, nav_link2, nav_link3, nav_link4)
VALUES (
  1, 
  'FRETE GRÁTIS PARA TODO BRASIL ACIMA DE R$ 299', 
  'NOVA COLEÇÃO ESTELAR', 
  'O futuro do streetwear já chegou. Peças exclusivas com design minimalista e conforto máximo para o seu dia a dia.', 
  'Camisetas Para Todos os Momentos',
  '5511999999999',
  'Lançamentos',
  'Roupas',
  'Tênis',
  'Sale'
);

-- 5. ATIVAR SEGURANÇA A NÍVEL DE LINHA (RLS)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- 6. CRIAR POLÍTICAS DE ACESSO
-- Como nosso admin usa apenas uma senha simples no front-end, vamos liberar acesso público 
-- para leitura e escrita por enquanto.
CREATE POLICY "Enable all access for all users on products" ON public.products FOR ALL USING (true);
CREATE POLICY "Enable all access for all users on settings" ON public.settings FOR ALL USING (true);
