import re

with open('src/pages/HomePage.tsx', 'r') as f:
    content = f.read()

content = content.replace("import { ProductGrid } from '../components/ProductGrid';", "import { ProductGrid } from '../components/ProductGrid';\nimport { HomeCategories } from '../components/HomeCategories';")

content = content.replace("<Benefits />", "<HomeCategories />\n      <Benefits />")

with open('src/pages/HomePage.tsx', 'w') as f:
    f.write(content)
