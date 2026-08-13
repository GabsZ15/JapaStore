import re

with open('src/pages/AdminPage.tsx', 'r') as f:
    content = f.read()

# Add states for product dimensions
target_state = """  const [sizes, setSizes] = useState<string>('');
  const [extraImages, setExtraImages] = useState<string[]>([]);"""
replacement_state = """  const [sizes, setSizes] = useState<string>('');
  const [extraImages, setExtraImages] = useState<string[]>([]);
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [width, setWidth] = useState('');
  const [length, setLength] = useState('');"""
content = content.replace(target_state, replacement_state)

# Populate states on edit
target_edit = """    setSizes(product.sizes?.join(', ') || '');
    setExtraImages(product.extraImages || []);"""
replacement_edit = """    setSizes(product.sizes?.join(', ') || '');
    setExtraImages(product.extraImages || []);
    setWeight(product.weight?.toString() || '');
    setHeight(product.height?.toString() || '');
    setWidth(product.width?.toString() || '');
    setLength(product.length?.toString() || '');"""
content = content.replace(target_edit, replacement_edit)

# Clear states on cancel/new
target_clear = """    setSizes('');
    setExtraImages([]);"""
replacement_clear = """    setSizes('');
    setExtraImages([]);
    setWeight('');
    setHeight('');
    setWidth('');
    setLength('');"""
content = content.replace(target_clear, replacement_clear)

# Parse inputs in handleSubmit
target_submit = """    const parsedExtraImages = extraImages;
    const finalDescription = stringifyProductDescription(description, parsedSizes, parsedExtraImages);"""
replacement_submit = """    const parsedExtraImages = extraImages;
    const finalDescription = stringifyProductDescription(
      description, parsedSizes, parsedExtraImages, 
      weight ? parseFloat(weight.replace(',', '.')) : undefined,
      height ? parseFloat(height.replace(',', '.')) : undefined,
      width ? parseFloat(width.replace(',', '.')) : undefined,
      length ? parseFloat(length.replace(',', '.')) : undefined
    );"""
content = content.replace(target_submit, replacement_submit)

# Add HTML inputs for product dimensions
target_inputs = """              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                  Tamanhos (separados por vírgula)
                </label>"""
replacement_inputs = """              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Peso (kg)</label>
                  <input type="text" value={weight} onChange={e => setWeight(e.target.value)} placeholder="Ex: 0.5" className="w-full px-4 py-2 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 rounded-md" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Altura (cm)</label>
                  <input type="text" value={height} onChange={e => setHeight(e.target.value)} placeholder="Ex: 10" className="w-full px-4 py-2 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 rounded-md" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Largura (cm)</label>
                  <input type="text" value={width} onChange={e => setWidth(e.target.value)} placeholder="Ex: 20" className="w-full px-4 py-2 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 rounded-md" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Comprim. (cm)</label>
                  <input type="text" value={length} onChange={e => setLength(e.target.value)} placeholder="Ex: 20" className="w-full px-4 py-2 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 rounded-md" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                  Tamanhos (separados por vírgula)
                </label>"""
content = content.replace(target_inputs, replacement_inputs)

with open('src/pages/AdminPage.tsx', 'w') as f:
    f.write(content)
