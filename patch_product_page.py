import re

with open('src/pages/ProductPage.tsx', 'r') as f:
    content = f.read()

target_import = "import { useCart } from '../contexts/CartContext';"
replacement_import = "import { useCart } from '../contexts/CartContext';\nimport { ShippingCalculator } from '../components/ShippingCalculator';"
content = content.replace(target_import, replacement_import)

target_render = """            {/* Description */}
            {product.description && (
              <div className="border-t border-zinc-200 dark:border-zinc-800 pt-8">"""
replacement_render = """            {/* Description */}
            {product.description && (
              <div className="border-t border-zinc-200 dark:border-zinc-800 pt-8">"""
content = content.replace(target_render, replacement_render)

target_end_render = """                </div>
              </div>
            )}
            
          </div>"""
replacement_end_render = """                </div>
              </div>
            )}
            
            <ShippingCalculator product={product} />
          </div>"""
content = content.replace(target_end_render, replacement_end_render)

with open('src/pages/ProductPage.tsx', 'w') as f:
    f.write(content)
