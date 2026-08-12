import re

with open('src/components/Footer.tsx', 'r') as f:
    content = f.read()

content = content.replace("import { useAdmin } from '../contexts/AdminContext';", "import { useAdmin } from '../contexts/AdminContext';\nimport { useSettings } from '../contexts/SettingsContext';")
content = content.replace("const { enableAdminMode } = useAdmin();", "const { enableAdminMode } = useAdmin();\n  const { settings } = useSettings();")

content = content.replace(
    "Streetwear e moda casual para quem busca atitude e minimalismo. O melhor do design contemporâneo focado em qualidade e exclusividade.",
    "{settings.siteContent.footer.aboutText}"
)
content = content.replace(
    "contato@japastore.com.br",
    "{settings.siteContent.contact.email}"
)
content = content.replace(
    "Seg. a Sex. das 09h às 18h",
    "{settings.siteContent.contact.businessHours}"
)

with open('src/components/Footer.tsx', 'w') as f:
    f.write(content)
