import re

with open('src/types.ts', 'r') as f:
    content = f.read()

type_addition = """  authModal: {
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
  benefits: { title: string; desc: string }[];"""

content = content.replace("  benefits: { title: string; desc: string }[];", type_addition)

default_addition = """  authModal: {
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
  benefits: ["""

content = content.replace("  benefits: [", default_addition)

with open('src/types.ts', 'w') as f:
    f.write(content)
