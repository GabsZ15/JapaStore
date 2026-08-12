import re

with open('src/pages/SearchPage.tsx', 'r') as f:
    content = f.read()

content = content.replace("import { ProductCard } from '../components/ProductCard';", "import { ProductCard } from '../components/ProductCard';\nimport { useSettings } from '../contexts/SettingsContext';")
content = content.replace("export function SearchPage() {", "export function SearchPage() {\n  const { settings } = useSettings();\n  const texts = settings.siteContent.searchPage;")
content = content.replace("setError('Não foi possível realizar a busca no momento.');", "setError(texts.errorText);")
content = re.sub(r'>\s*Resultados da busca\s*<', '>{texts.title}<', content)
content = re.sub(r'Mostrando resultados para:\s*<span', '{texts.showingResultsFor} <span', content)
content = re.sub(r"'Digite algo para buscar em nossa loja.'", "texts.emptyStateText", content)
content = re.sub(r'>\s*Buscando produtos...\s*<', '>{texts.searchingText}<', content)
content = re.sub(r'>\s*Nenhum produto encontrado para sua busca no momento.\s*<', '>{texts.noResultsText}<', content)

with open('src/pages/SearchPage.tsx', 'w') as f:
    f.write(content)
