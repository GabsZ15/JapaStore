import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

imports = """import { FavoritosPage } from './pages/FavoritosPage';
import { MoletonsPage } from './pages/MoletonsPage';
import { CamisetasPage } from './pages/CamisetasPage';
import { BermudasPage } from './pages/BermudasPage';"""

content = content.replace("import { FavoritosPage } from './pages/FavoritosPage';", imports)

routes = """<Route path="/favoritos" element={<FavoritosPage />} />
          <Route path="/moletons" element={<MoletonsPage />} />
          <Route path="/camisetas" element={<CamisetasPage />} />
          <Route path="/bermudas" element={<BermudasPage />} />"""

content = content.replace('<Route path="/favoritos" element={<FavoritosPage />} />', routes)

with open('src/App.tsx', 'w') as f:
    f.write(content)
