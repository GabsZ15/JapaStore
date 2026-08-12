import re

with open('src/components/AuthModal.tsx', 'r') as f:
    content = f.read()

content = content.replace("export function AuthModal({ isOpen, onClose }: AuthModalProps) {", "import { useSettings } from '../contexts/SettingsContext';\n\nexport function AuthModal({ isOpen, onClose }: AuthModalProps) {\n  const { settings } = useSettings();\n  const texts = settings.siteContent.authModal;")

content = re.sub(r'>\s*Entrar\s*</button>', '>{texts.loginTab}</button>', content, count=1)
content = re.sub(r'>\s*Criar Conta\s*</button>', '>{texts.registerTab}</button>', content, count=1)
content = re.sub(r'>E-mail</label>', '>{texts.emailLabel}</label>', content)
content = re.sub(r'>Senha</label>', '>{texts.passwordLabel}</label>', content)
content = re.sub(r'>Nome Completo</label>', '>{texts.nameLabel}</label>', content)
content = re.sub(r'placeholder="Seu e-mail"', 'placeholder={texts.emailPlaceholder}', content)
content = re.sub(r'placeholder="Sua senha"', 'placeholder={texts.passwordPlaceholder}', content)
content = re.sub(r'placeholder="Seu nome"', 'placeholder={texts.namePlaceholder}', content)
content = re.sub(r'placeholder="Crie uma senha"', 'placeholder={texts.createPasswordPlaceholder}', content)
content = re.sub(r'>Esqueceu a senha\?<', '>{texts.forgotPasswordText}<', content)
content = content.replace("loading ? 'Aguarde...' : 'Entrar'", "loading ? texts.loadingButton : texts.loginButton")
content = content.replace("loading ? 'Aguarde...' : 'Criar Conta'", "loading ? texts.loadingButton : texts.registerButton")
content = re.sub(r'>Ou acesse com<', '>{texts.orAccessWith}<', content)

with open('src/components/AuthModal.tsx', 'w') as f:
    f.write(content)
