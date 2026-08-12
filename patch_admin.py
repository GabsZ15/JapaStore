import re

with open('src/pages/AdminPage.tsx', 'r') as f:
    content = f.read()

# Imports
content = content.replace("import { mapSupabaseProduct } from '../utils/productUtils';", "import { mapSupabaseProduct, stringifyProductDescription } from '../utils/productUtils';")

# State
state_old = "const [description, setDescription] = useState('');"
state_new = """const [description, setDescription] = useState('');
  const [sizes, setSizes] = useState<string>('');
  const [extraImages, setExtraImages] = useState<string>('');"""
content = content.replace(state_old, state_new)

# handleEdit
edit_old = "setDescription(product.description || '');"
edit_new = """setDescription(product.description || '');
    setSizes((product.sizes || []).join(', '));
    setExtraImages((product.extraImages || []).join(', '));"""
content = content.replace(edit_old, edit_new)

# handleSubmit (payload)
# We need to construct the description
desc_logic = """const priceNum = parseFloat(price.replace(',', '.'));
    const installmentsNum = allowInstallments ? parseInt(maxInstallments) : 1;
    
    const parsedSizes = sizes.split(',').map(s => s.strip().trim()).filter(s => s !== '');
    const parsedExtraImages = extraImages.split(',').map(s => s.strip().trim()).filter(s => s !== '');
    const finalDescription = stringifyProductDescription(description, parsedSizes, parsedExtraImages);"""

content = content.replace("const priceNum = parseFloat(price.replace(',', '.'));\n    const installmentsNum = allowInstallments ? parseInt(maxInstallments) : 1;", desc_logic.replace(".strip()", ""))

content = content.replace("description\n          })", "description: finalDescription\n          })")
content = content.replace("description\n          });", "description: finalDescription\n          });")

# reset form
reset_old = "setDescription('');"
reset_new = "setDescription('');\n      setSizes('');\n      setExtraImages('');"
content = content.replace(reset_old, reset_new)

# Form fields
form_old = """<div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 mb-2">Descrição Curta</label>
                <textarea 
                  rows={3}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-3 text-sm focus:outline-none focus:border-zinc-900 dark:focus:border-white transition-colors dark:text-white rounded-md resize-none"
                  placeholder="Breve descrição do produto..."
                />
              </div>"""

form_new = form_old + """
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 mb-2">Tamanhos Disponíveis (separados por vírgula)</label>
                  <input 
                    type="text" 
                    value={sizes}
                    onChange={e => setSizes(e.target.value)}
                    className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-3 text-sm focus:outline-none focus:border-zinc-900 dark:focus:border-white transition-colors dark:text-white rounded-md"
                    placeholder="Ex: P, M, G, GG ou 38, 40, 42"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 mb-2">Imagens Adicionais (URLs separadas por vírgula)</label>
                  <input 
                    type="text" 
                    value={extraImages}
                    onChange={e => setExtraImages(e.target.value)}
                    className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-3 text-sm focus:outline-none focus:border-zinc-900 dark:focus:border-white transition-colors dark:text-white rounded-md"
                    placeholder="Ex: https://img.com/1.jpg, https://img.com/2.jpg"
                  />
                </div>
              </div>
"""
content = content.replace(form_old, form_new)

with open('src/pages/AdminPage.tsx', 'w') as f:
    f.write(content)

