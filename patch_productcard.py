import re

with open('src/components/ProductCard.tsx', 'r') as f:
    content = f.read()

# Add useNavigate
content = content.replace("import { useSettings } from '../contexts/SettingsContext';", "import { useSettings } from '../contexts/SettingsContext';\nimport { useNavigate } from 'react-router-dom';")

# Add hook inside component
content = content.replace("const { settings } = useSettings();", "const { settings } = useSettings();\n  const navigate = useNavigate();")

# Add onClick to outer div
content = content.replace('<div className="group cursor-pointer flex flex-col h-full">', '<div onClick={() => navigate(`/produto/${product.id}`)} className="group cursor-pointer flex flex-col h-full">')

with open('src/components/ProductCard.tsx', 'w') as f:
    f.write(content)
