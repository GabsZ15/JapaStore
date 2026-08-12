import re

# FAQ Page
with open('src/pages/FaqPage.tsx', 'r') as f:
    content = f.read()

content = content.replace("export function FaqPage() {", "import { useSettings } from '../contexts/SettingsContext';\n\nexport function FaqPage() {\n  const { settings } = useSettings();\n  const content = settings.siteContent.faq;")
content = content.replace("faqs.map((faq", "content.items.map((faq")
content = re.sub(r'const faqs: FaqItem\[\] = \[.*?\];', '', content, flags=re.DOTALL)
content = re.sub(r'<h1 className="([^"]*)">.*?</h1>', r'<h1 className="\1">{content.title}</h1>', content, flags=re.DOTALL)
content = re.sub(r'(<p className="text-zinc-500 dark:text-zinc-400 font-medium">\s*)(.*?)(\s*</p>)', r'\1{content.subtitle}\3', content)

with open('src/pages/FaqPage.tsx', 'w') as f:
    f.write(content)

# Contato Page
with open('src/pages/ContatoPage.tsx', 'r') as f:
    content = f.read()

content = content.replace("export function ContatoPage() {", "import { useSettings } from '../contexts/SettingsContext';\n\nexport function ContatoPage() {\n  const { settings } = useSettings();\n  const content = settings.siteContent.contact;")
content = re.sub(r'<h1 className="([^"]*)">.*?</h1>', r'<h1 className="\1">{content.title}</h1>', content, flags=re.DOTALL)
content = re.sub(r'(<p className="text-zinc-500 dark:text-zinc-400 font-medium">\s*)(.*?)(\s*</p>)', r'\1{content.subtitle}\3', content, count=1)
content = content.replace("contato@japastore.com.br", "{content.email}")
content = content.replace("(11) 99999-9999", "{content.phone}")
content = content.replace("Segunda a Sexta, das 09h às 18h", "{content.businessHours}")
content = content.replace("Av. Paulista, 1000 - Bela Vista", "{content.addressLine1}")
content = content.replace("São Paulo - SP, 01310-100", "{content.addressLine2}")

with open('src/pages/ContatoPage.tsx', 'w') as f:
    f.write(content)
