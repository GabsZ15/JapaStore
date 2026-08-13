export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  installments: number;
  imageUrl: string;
  discount?: number;
  category?: string;
  description?: string;
  outOfStock?: boolean;
  sizes?: string[];
  extraImages?: string[];
  selectedSize?: string;
  weight?: number;
  height?: number;
  width?: number;
  length?: number;
}

export interface SiteContent {
  superfrete?: {
    originCep: string;
    token: string;
  };
  pages: {
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
  };
  about: {
    title: string;
    paragraphs: string[];
    slogan: string;
    imageUrl: string;
  };
  faq: {
    title: string;
    subtitle: string;
    items: { question: string; answer: string }[];
  };
  contact: {
    title: string;
    subtitle: string;
    email: string;
    phone: string;
    businessHours: string;
    addressLine1: string;
    addressLine2: string;
  };
  heroBanners: {
    banner1: string;
    banner2: string;
  };
  footer: {
    aboutText: string;
  };
  header: {
    searchPlaceholder: string;
    loginText: string;
    logoutText: string;
    favoritesText: string;
    lightModeText: string;
    darkModeText: string;
  };
  productCard: {
    outOfStockBadge: string;
    installmentPrefix: string;
    installmentSuffix: string;
    cashPrefix: string;
    buyButton: string;
    unavailableButton: string;
  };
  searchPage: {
    title: string;
    showingResultsFor: string;
    emptyStateText: string;
    searchingText: string;
    errorText: string;
    noResultsText: string;
  };
  favoritesPage: {
    title: string;
    emptyStateTitle: string;
    emptyStateText: string;
    exploreButton: string;
  };
  cartDrawer: {
    title: string;
    emptyStateTitle: string;
    emptyStateText: string;
    startShoppingButton: string;
    totalText: string;
    checkoutButton: string;
    whatsappMessagePrefix: string;
    whatsappMessageTotal: string;
  };
  authModal: {
    loginTab: string;
    registerTab: string;
    emailLabel: string;
    emailPlaceholder: string;
    passwordLabel: string;
    forgotPasswordText: string;
    passwordPlaceholder: string;
    loginButton: string;
    loadingButton: string;
    nameLabel: string;
    namePlaceholder: string;
    createPasswordPlaceholder: string;
    registerButton: string;
    orAccessWith: string;
  };
  benefits: {
    title: string;
    desc: string;
  }[];
}

export const defaultSiteContent: SiteContent = {
  superfrete: {
    originCep: '',
    token: ''
  },
  pages: {
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
        id: "camisetas",
        title: "Camisetas",
        imageUrl: "/images/Camiseta.jpeg",
        linkTo: "/camisetas"
      },
      {
        id: "bermudas",
        title: "Bermudas",
        imageUrl: "/images/Bermuda.jpeg",
        linkTo: "/bermudas"
      },
      {
        id: "moletons",
        title: "Moletons",
        imageUrl: "/images/Moletom.jpeg",
        linkTo: "/moletons"
      }
    ]
  },
  about: {
    title: "Sobre a JapaStore",
    paragraphs: [
      "Nascida da paixão pela cultura urbana e pelo design minimalista, a JapaStore não é apenas uma loja de roupas, é um movimento de expressão autêntica através da moda.",
      "Acreditamos que o streetwear deve ser acessível, confortável e, acima de tudo, carregar atitude. Nossas peças são cuidadosamente selecionadas e desenvolvidas para quem vive a dinâmica das ruas, mas não abre mão da elegância sutil.",
      "Trabalhamos com materiais premium e modelagens exclusivas que se adaptam ao seu corpo e ao seu estilo de vida. Nosso compromisso é entregar não apenas vestuário, mas confiança."
    ],
    slogan: "Estilo que transforma.",
    imageUrl: "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&q=80"
  },
  faq: {
    title: "Perguntas Frequentes",
    subtitle: "Tudo o que você precisa saber sobre compras, entregas e suporte.",
    items: [
      { question: 'Como funciona a política de trocas?', answer: 'Você tem até 7 dias corridos após o recebimento do pedido para solicitar a troca ou devolução. O produto deve estar com a etiqueta original, sem indícios de uso e na embalagem original.' },
      { question: 'Qual o prazo de entrega?', answer: 'O prazo varia de acordo com a sua região e a modalidade de frete escolhida. Normalmente, pedidos para o Sudeste chegam em até 3 dias úteis, e para as demais regiões entre 5 a 10 dias úteis.' },
      { question: 'Quais são as formas de pagamento?', answer: 'Aceitamos PIX (com 5% de desconto), cartões de crédito (Visa, MasterCard, Elo) em até 12x.' },
      { question: 'Como rastrear meu pedido?', answer: 'Assim que o pedido for despachado, você receberá o código de rastreio por e-mail. Você também pode acompanhá-lo acessando sua conta na seção "Meus Pedidos".' },
      { question: 'As peças encolhem ao lavar?', answer: 'Nossas peças são pré-encolhidas no processo de fabricação. No entanto, recomendamos seguir rigorosamente as instruções de lavagem presentes na etiqueta de cada produto para garantir sua durabilidade.' }
    ]
  },
  contact: {
    title: "Fale Conosco",
    subtitle: "Estamos aqui para ajudar. Preencha o formulário ou utilize nossos canais de atendimento.",
    email: "contato@japastore.com.br",
    phone: "(11) 99999-9999",
    businessHours: "Segunda a Sexta, das 09h às 18h",
    addressLine1: "Av. Paulista, 1000 - Bela Vista",
    addressLine2: "São Paulo - SP, 01310-100"
  },
  heroBanners: {
    banner1: '/images/japastorebanner1.jpeg',
    banner2: '/images/japastorebanner2.jpeg'
  },
  footer: {
    aboutText: "Streetwear e moda casual para quem busca atitude e minimalismo. O melhor do design contemporâneo focado em qualidade e exclusividade."
  },
  header: {
    searchPlaceholder: "O que você procura?",
    loginText: "Entrar / Cadastrar",
    logoutText: "Sair da conta",
    favoritesText: "Meus Favoritos",
    lightModeText: "Modo Claro",
    darkModeText: "Modo Escuro"
  },
  productCard: {
    outOfStockBadge: "Esgotado",
    installmentPrefix: "ou",
    installmentSuffix: "x de",
    cashPrefix: "À vista",
    buyButton: "Comprar",
    unavailableButton: "Indisponível"
  },
  searchPage: {
    title: "Resultados da busca",
    showingResultsFor: "Mostrando resultados para:",
    emptyStateText: "Digite algo para buscar em nossa loja.",
    searchingText: "Buscando produtos...",
    errorText: "Não foi possível realizar a busca no momento.",
    noResultsText: "Nenhum produto encontrado para sua busca no momento."
  },
  favoritesPage: {
    title: "Seus Favoritos",
    emptyStateTitle: "Aqui estão os produtos que você marcou como favoritos.",
    emptyStateText: "Você ainda não tem nenhum produto salvo nos favoritos.",
    exploreButton: "Explorar Lançamentos"
  },
  cartDrawer: {
    title: "Sua Sacola",
    emptyStateTitle: "Sacola Vazia",
    emptyStateText: "Parece que você ainda não adicionou nenhum produto.",
    startShoppingButton: "Começar a Comprar",
    totalText: "Total",
    checkoutButton: "Finalizar no WhatsApp",
    whatsappMessagePrefix: "Olá! Gostaria de finalizar a seguinte compra:\n\n",
    whatsappMessageTotal: "\n*Total:"
  },
  authModal: {
    loginTab: "Entrar",
    registerTab: "Criar Conta",
    emailLabel: "E-mail",
    emailPlaceholder: "Seu e-mail",
    passwordLabel: "Senha",
    forgotPasswordText: "Esqueceu a senha?",
    passwordPlaceholder: "Sua senha",
    loginButton: "Entrar",
    loadingButton: "Aguarde...",
    nameLabel: "Nome Completo",
    namePlaceholder: "Seu nome",
    createPasswordPlaceholder: "Crie uma senha",
    registerButton: "Criar Conta",
    orAccessWith: "Ou acesse com"
  },
  benefits: [
    { title: "Compra 100% Segura", desc: "Seus dados estão protegidos. Utilizamos criptografia de ponta a ponta." },
    { title: "Frete Grátis", desc: "Entregamos sem custo adicional em compras acima de R$ 299 para todo o Brasil." },
    { title: "Parcele em até 12x", desc: "Condições especiais de pagamento no cartão de crédito ou 5% OFF no PIX." }
  ]
};
