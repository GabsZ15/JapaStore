import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# Add import
content = content.replace("import { AdminPage } from './pages/AdminPage';", "import { AdminPage } from './pages/AdminPage';\nimport { ProductPage } from './pages/ProductPage';")

# Add Route
content = content.replace('<Route path="/favoritos" element={<FavoritosPage />} />', '<Route path="/favoritos" element={<FavoritosPage />} />\n          <Route path="/produto/:id" element={<ProductPage />} />')

with open('src/App.tsx', 'w') as f:
    f.write(content)
