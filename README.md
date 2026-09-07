# 🛍️ JapaStore — Streetwear E-Commerce Web Application

O **JapaStore** é uma aplicação de e-commerce voltada para o segmento de vestuário e cultura streetwear. A aplicação foi desenvolvida utilizando **React 19** com **TypeScript** no front-end e arquitetura serverless no back-end via **Vercel Serverless Functions**, conectando-se ao banco de dados relacional **Supabase (PostgreSQL)** e integrando-se à API de logística da **SuperFrete**.

---

## 🚀 Funcionalidades

### **Front-End & Experiência do Usuário**
- 🛒 **Vitrine de Produtos:** Navegação por categorias (Camisetas, Bermudas, Moletons, Acessórios, Tênis, Roupas e Lançamentos).
- 🔍 **Busca Dinâmica:** Sistema de pesquisa rápida com filtragem de itens por palavras-chave.
- 🛍️ **Carrinho de Compras (Cart Drawer):** Componente em gaveta lateral para inclusão, alteração de quantidades e remoção de itens.
- ❤️ **Lista de Favoritos:** Salvamento e gerenciamento persistente dos produtos favoritos.
- 🚚 **Cálculo de Frete:** Integração com a API da SuperFrete para cálculo dinâmico de prazos e valores de envio com base no CEP do comprador.

### **Painel Administrativo & Segurança Back-End**
- ⚙️ **Gerenciamento de Produtos e Configurações:** Interface administrativa (`AdminPage`) protegida para criação, edição e exclusão de produtos, além da personalização de banners, textos e links da loja.
- 🔒 **Proteção RLS (Row Level Security):** Banco de dados Supabase configurado com regras de controle de acesso. Clientes públicos possuem acesso de leitura (`SELECT`), enquanto mutações (`INSERT`, `UPDATE`, `DELETE`) são restritas no banco de dados.
- 🛡️ **Rotas Serverless Protegidas:** Mutações administrativas gerenciadas por endpoints isolados em `api/admin/*`, autenticados por cabeçalho de segredo (`X-Admin-Secret`) e executados com a chave de serviço (`SUPABASE_SERVICE_ROLE_KEY`) no servidor.

---

## 🛠️ Tecnologias Utilizadas

### **Front-End**
- **React 19** com **TypeScript**
- **Tailwind CSS**
- **Lucide React** (Ícones)
- **React Router v7**

### **Back-End & Infraestrutura**
- **Vercel Serverless Functions** (`api/admin/*`, `api/shipping/*`)
- **Express / Node.js** (Servidor integrado para desenvolvimento local)
- **Supabase** (PostgreSQL / `@supabase/supabase-js`)
- **SuperFrete API** (Cálculo de envios postais)

---

## 📁 Estrutura do Projeto

```text
JapaStore/
├── api/                             # Endpoints Serverless (Vercel Backend)
│   ├── admin/                       # Rotas protegidas administrativas
│   │   ├── _adminAuth.ts            # Helper de autenticação e validação do segredo
│   │   ├── products.ts              # Endpoint de cadastro/edição/exclusão de produtos
│   │   └── settings.ts              # Endpoint de atualização de configurações
│   └── shipping/
│       └── calculate.ts             # Endpoint de cálculo de frete (SuperFrete)
│
├── public/                          # Imagens estáticas e logotipo da loja
├── src/                             # Código fonte da aplicação SPA
│   ├── components/                  # Componentes React organizados por domínios
│   │   ├── admin/                   # Componentes do painel administrativo
│   │   ├── auth/                    # Modais e fluxos de autenticação
│   │   ├── cart/                    # Componente do carrinho lateral
│   │   ├── common/                  # Componentes globais (Scroll, ErrorBoundary)
│   │   ├── home/                    # Banners e seções da página inicial
│   │   ├── layout/                  # Cabeçalho, rodapé e navegação
│   │   ├── product/                 # Cards, grids e calculadora de frete
│   │   └── index.ts                 # Centralizador de exportação de componentes
│   ├── contexts/                    # Contextos Globais (Cart, Auth, Favorites, Settings, Admin)
│   ├── hooks/                       # Custom hooks centralizados
│   ├── lib/                         # Cliente de integração com o Supabase
│   ├── pages/                       # Páginas principais da loja e do painel admin
│   ├── utils/                       # Utilitários e manipuladores de dados
│   ├── App.tsx                      # Rotas da aplicação
│   ├── main.tsx                     # Ponto de entrada do React
│   └── types.ts                     # Definições de interfaces e tipos TypeScript
├── .env.example                     # Modelo de variáveis de ambiente (sem segredos)
├── .gitignore                       # Regras de segurança e arquivos ignorados no Git
├── database.sql                     # Script SQL oficial com tabelas e políticas RLS
├── server.ts                        # Servidor Express para desenvolvimento local
└── package.json                     # Dependências do projeto
```

---

## 🔧 Como Executar o Projeto Localmente

### **Pré-requisitos**
- **Node.js** (v18 ou superior)
- **NPM** ou **Bun**

### **Passo a Passo**

1. **Clonar o repositório:**
   ```bash
   git clone https://github.com/GabsZ15/JapaStore.git
   cd JapaStore
   ```

2. **Instalar as dependências:**
   ```bash
   npm install
   ```

3. **Configurar as Variáveis de Ambiente:**
   Crie um arquivo `.env` na raiz do projeto baseado no `.env.example`:
   ```env
   VITE_SUPABASE_URL=https://seu-projeto.supabase.co
   VITE_SUPABASE_ANON_KEY=sua-chave-anon-publica
   SUPABASE_SERVICE_ROLE_KEY=sua-chave-service-role-privada
   ADMIN_SECRET_KEY=seu-segredo-de-cabecalho-admin
   SUPERFRETE_TOKEN=seu-token-da-superfrete
   ```

4. **Configurar o Banco de Dados:**
   Execute o script `database.sql` no **SQL Editor** do Supabase para criar as tabelas `products` e `settings` e aplicar as políticas de segurança RLS.

5. **Iniciar o ambiente de desenvolvimento:**
   ```bash
   npm run dev
   ```
   Acesse a aplicação no navegador em `http://localhost:3000`.

---

## 🔐 Segurança e Variáveis de Ambiente

As chaves privadas e tokens de API foram projetados para execução no ambiente do servidor:
- `SUPABASE_SERVICE_ROLE_KEY`, `ADMIN_SECRET_KEY` e `SUPERFRETE_TOKEN` não são enviadas ao navegador e não possuem o prefixo `VITE_`.
- O cliente público do Supabase (`VITE_SUPABASE_ANON_KEY`) possui acesso de leitura no PostgreSQL através de políticas RLS.

---

## 🤖 Uso de Inteligência Artificial (AI-Assisted Development)

Este projeto foi construído com apoio de ferramentas de **Inteligência Artificial Generativa** como assistente de produtividade técnica no ciclo de desenvolvimento.

- **Atuação da IA:** Apoio na estruturação inicial de componentes, diagnóstico de erros de TypeScript e suporte na otimização de consultas e rotas.
- **Condução Humana:** Definição dos requisitos de negócio, arquitetura de segurança (RLS e serverless), design de interface, testes funcionais e integração final conduzidos autonomamente pelo desenvolvedor.

---

## 🧠 Aprendizados Práticos

- **Arquitetura Serverless & Jamstack:** Separação entre aplicação SPA no cliente e rotas de escrita protegidas no servidor.
- **Segurança em Bancos Relacionais:** Configuração de Row Level Security (RLS) no PostgreSQL via Supabase.
- **Integração de APIs de Logística:** Comunicação assíncrona com webservices de cálculo de frete.
