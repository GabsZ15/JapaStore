import re

with open('src/components/Header.tsx', 'r') as f:
    content = f.read()

content = content.replace("export function Header() {", "import { useSettings } from '../contexts/SettingsContext';\n\nexport function Header() {\n  const { settings } = useSettings();\n  const texts = settings.siteContent.header;")
content = content.replace("placeholder=\"O que você procura?\"", "placeholder={texts.searchPlaceholder}")
content = content.replace(">{isDarkMode ? 'Modo Claro' : 'Modo Escuro'}<", ">{isDarkMode ? texts.lightModeText : texts.darkModeText}<")
content = content.replace(">Sair da conta<", ">{texts.logoutText}<")
content = content.replace(">Entrar / Cadastrar<", ">{texts.loginText}<")
content = content.replace(">Meus Favoritos<", ">{texts.favoritesText}<")

with open('src/components/Header.tsx', 'w') as f:
    f.write(content)
