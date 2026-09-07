# 🛍️ JapaStore — Streetwear E-Commerce Web Application

![React](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Express](https://img.shields.io/badge/Express-4.21-000000?style=for-the-badge&logo=express&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-2.112-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-6.2-646CFF?style=for-the-badge&logo=vite&logoColor=white)

Projeto de e-commerce voltado para vestuário e produtos de moda streetwear. A aplicação utiliza **React** com **TypeScript** no front-end e um servidor **Node.js/Express** integrado ao banco de dados relacional **Supabase** no back-end.

---

## 🚀 Funcionalidades

### **Front-End & Interface**
- 🛒 **Vitrine de Produtos:** Navegação por categorias (Camisetas, Bermudas, Moletons, Acessórios e Lançamentos).
- 🔍 **Busca de Produtos:** Filtro dinâmico para localização rápida de itens.
- 🛍️ **Carrinho de Compras (Cart Drawer):** Componente em gaveta lateral para gerenciamento de itens no carrinho.
- ❤️ **Lista de Favoritos:** Salvamento e exibição de itens favoritados via Context API.
- 🚚 **Cálculo de Frete:** Modal interativo para inserção de CEP e consulta de frete.

### **Painel Administrativo & Back-End**
- ⚙️ **Editor de Conteúdo:** Interface de administração (`AdminPage`) para atualização dos textos, banners e links da loja.
- 🔐 **Autenticação & Segurança:** Cliente Supabase configurado com tabela de produtos e configurações protegidas por políticas RLS (*Row Level Security*).
- 📦 **API de Frete:** Rota customizada em Express (`/api/shipping/calculate`) integrada com a API da SuperFrete.

---

## 🛠️ Tecnologias Utilizadas

### **Front-End**
- **React 19** com **TypeScript**
- **Tailwind CSS (v4)**
- **Framer Motion (`motion`)**
- **Lucide React** (Ícones)
- **React Router v7**

### **Back-End & Banco de Dados**
- **Node.js** & **Express**
- **Supabase** (PostgreSQL / `@supabase/supabase-js`)
- **SuperFrete API** (Cálculo de envios)

---

## 📁 Estrutura do Projeto

```text
JapaStore/
├── api/
│   └── shipping/         # Rota de cálculo de frete
├── public/               # Imagens estáticas e banners
├── src/
│   ├── components/       # Componentes reutilizáveis (Header, CartDrawer, Hero, etc.)
│   │   └── admin/        # Componentes da área administrativa
│   ├── contexts/         # Contextos React (Cart, Auth, Favorites, Settings, Admin)
│   ├── lib/              # Inicialização do cliente Supabase
│   ├── pages/            # Páginas da aplicação (HomePage, ProductPage, AdminPage, etc.)
│   ├── utils/            # Utilitários e manipuladores de dados
│   ├── App.tsx           # Configuração de rotas principais
│   └── main.tsx          # Ponto de entrada do React
├── database.sql          # Script SQL para criação das tabelas no Supabase
├── server.ts             # Servidor Express integrado ao Vite Dev Server
└── package.json          # Dependências do projeto
```

---

## 🔧 Como Executar o Projeto Localmente

### **Pré-requisitos**
- Node.js (v18 ou superior)
- npm ou bun

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
   Crie um arquivo `.env` na raiz do projeto contendo as chaves do seu projeto Supabase:
   ```env
   VITE_SUPABASE_URL=sua_url_do_supabase
   VITE_SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase
   ```

4. **Configurar o Banco de Dados:**
   Execute o script `database.sql` no **SQL Editor** do Supabase para criar as tabelas `products` e `settings`.

5. **Iniciar o ambiente de desenvolvimento:**
   ```bash
   npm run dev
   ```
   Acesse a aplicação em `http://localhost:3000`.

---

## 🧠 Aprendizados Práticos

- **Gerenciamento de Estado Global:** Uso da React Context API para isolar a regra de negócio do carrinho, favoritos e configurações do painel.
- **Integração de APIs:** Comunicação entre a SPA React e rotas de servidor Express integradas a serviços de terceiros.
- **Banco de Dados Relacional:** Estruturação de tabelas no PostgreSQL e aplicação de permissões no Supabase.
