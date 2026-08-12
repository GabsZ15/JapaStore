import re

with open('src/types.ts', 'r') as f:
    content = f.read()

content = content.replace("title: \"Meus Favoritos\",", "title: \"Seus Favoritos\",")
content = content.replace("emptyStateTitle: \"Sua lista de favoritos está vazia\",", "emptyStateTitle: \"Aqui estão os produtos que você marcou como favoritos.\",")
content = content.replace("emptyStateText: \"Comece a adicionar produtos para facilitar suas compras.\",", "emptyStateText: \"Você ainda não tem nenhum produto salvo nos favoritos.\",")
with open('src/types.ts', 'w') as f:
    f.write(content)

with open('src/pages/FavoritosPage.tsx', 'r') as f:
    content = f.read()

content = content.replace("import { Heart } from 'lucide-react';", "import { Heart } from 'lucide-react';\nimport { useSettings } from '../contexts/SettingsContext';")
content = content.replace("export function FavoritosPage() {", "export function FavoritosPage() {\n  const { settings } = useSettings();\n  const texts = settings.siteContent.favoritesPage;")

content = re.sub(r'>\s*Seus Favoritos\s*<', '>{texts.title}<', content)
content = re.sub(r'>\s*Aqui estão os produtos que você marcou como favoritos.\s*<', '>{texts.emptyStateTitle}<', content)
content = re.sub(r'>\s*Você ainda não tem nenhum produto salvo nos favoritos.\s*<', '>{texts.emptyStateText}<', content)

with open('src/pages/FavoritosPage.tsx', 'w') as f:
    f.write(content)
