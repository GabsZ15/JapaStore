import re

with open('src/types.ts', 'r') as f:
    content = f.read()

# Add to SiteContent interface
interface_addition = """  pages: {
    lancamentos: { title: string; subtitle: string; gridTitle: string; ctaText: string };
    roupas: { title: string; subtitle: string; gridTitle: string; ctaText: string };
    tenis: { title: string; subtitle: string; gridTitle: string; ctaText: string };
    sale: { title: string; subtitle: string; gridTitle: string; ctaText: string };
    moletons: { title: string; subtitle: string; gridTitle: string; ctaText: string };
    camisetas: { title: string; subtitle: string; gridTitle: string; ctaText: string };
    bermudas: { title: string; subtitle: string; gridTitle: string; ctaText: string };
  };
  homeCategories?: {
    items: {
      id: string;
      title: string;
      imageUrl: string;
      linkTo: string;
    }[];
  };"""

content = re.sub(r'  pages: \{[^\}]+\};', interface_addition, content)

# Add to defaultSiteContent
default_addition = """  pages: {
    lancamentos: { title: "Lançamentos", subtitle: "Confira as novidades da Japastore. Novas coleções e peças exclusivas adicionadas recentemente.", gridTitle: "Últimos Lançamentos", ctaText: "Voltar ao início" },
    roupas: { title: "Roupas", subtitle: "Explore nossa linha completa de vestuário streetwear. Camisetas oversized, moletons, calças cargo e mais.", gridTitle: "Todas as Roupas", ctaText: "Ver lançamentos" },
    tenis: { title: "Tênis", subtitle: "Os melhores sneakers para complementar o seu visual streetwear. Modelos exclusivos e confortáveis.", gridTitle: "Sneakers Exclusivos", ctaText: "Ir para sale" },
    sale: { title: "Sale", subtitle: "Aproveite nossos descontos imperdíveis. Peças selecionadas com descontos.", gridTitle: "Ofertas Ativas", ctaText: "Ver novidades" },
    moletons: { title: "Moletons", subtitle: "Conforto e estilo para os dias mais frios. Moletons pesados e com caimento perfeito.", gridTitle: "Moletons", ctaText: "Voltar ao início" },
    camisetas: { title: "Camisetas", subtitle: "Camisetas com as melhores estampas e qualidade premium.", gridTitle: "Camisetas", ctaText: "Voltar ao início" },
    bermudas: { title: "Bermudas", subtitle: "Bermudas para o seu dia a dia com conforto streetwear.", gridTitle: "Bermudas", ctaText: "Voltar ao início" }
  },
  homeCategories: {
    items: [
      {
        id: "moletons",
        title: "Moletons",
        imageUrl: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=600",
        linkTo: "/moletons"
      },
      {
        id: "camisetas",
        title: "Camisetas",
        imageUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=600",
        linkTo: "/camisetas"
      },
      {
        id: "bermudas",
        title: "Bermudas",
        imageUrl: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?auto=format&fit=crop&q=80&w=600",
        linkTo: "/bermudas"
      }
    ]
  },"""

content = re.sub(r'  pages: \{[\s\S]*?\},', default_addition, content)

with open('src/types.ts', 'w') as f:
    f.write(content)

