import re

with open('src/pages/AdminPage.tsx', 'r') as f:
    content = f.read()

# 1. Update state type
content = content.replace("const [extraImages, setExtraImages] = useState<string>('');", "const [extraImages, setExtraImages] = useState<string[]>([]);")

# 2. Add ref and handlers for extra images
handlers = """  const extraFilesInputRef = useRef<HTMLInputElement>(null);

  const handleExtraFilesInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach(file => handleExtraFileSelect(file));
    }
  };

  const handleExtraFileSelect = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Por favor, selecione arquivos de imagem válidos.');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setExtraImages(prev => [...prev, reader.result as string]);
    };
    reader.readAsDataURL(file);
  };

  const removeExtraImage = (index: number) => {
    setExtraImages(prev => prev.filter((_, i) => i !== index));
  };
"""
# find where `const fileInputRef = useRef<HTMLInputElement>(null);` is, insert handlers after it
content = content.replace("const fileInputRef = useRef<HTMLInputElement>(null);", "const fileInputRef = useRef<HTMLInputElement>(null);\n" + handlers)

# 3. Update parsedExtraImages in handleSubmit
content = content.replace("const parsedExtraImages = extraImages.split(',').map(s => s.trim()).filter(s => s !== '');", "const parsedExtraImages = extraImages;")

# 4. Update handleEdit mapping
content = content.replace("setExtraImages((product.extraImages || []).join(', '));", "setExtraImages(product.extraImages || []);")

# 5. Update resetForm
content = content.replace("setExtraImages('');", "setExtraImages([]);")

# 6. Replace UI for Imagens Adicionais
ui_old = """<div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 mb-2">Imagens Adicionais (URLs separadas por vírgula)</label>
                  <input 
                    type="text" 
                    value={extraImages}
                    onChange={e => setExtraImages(e.target.value)}
                    className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-3 text-sm focus:outline-none focus:border-zinc-900 dark:focus:border-white transition-colors dark:text-white rounded-md"
                    placeholder="Ex: https://img.com/1.jpg, https://img.com/2.jpg"
                  />
                </div>"""

ui_new = """<div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 mb-2">Imagens Adicionais</label>
                  <div className="flex flex-col gap-4">
                    <button
                      type="button"
                      onClick={() => extraFilesInputRef.current?.click()}
                      className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-3 text-sm font-bold uppercase tracking-wider hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors dark:text-white rounded-md border-dashed flex items-center justify-center gap-2"
                    >
                      <ImagePlus className="w-5 h-5" /> Adicionar Imagens
                    </button>
                    <input 
                      type="file" 
                      accept="image/*" 
                      multiple
                      className="hidden" 
                      ref={extraFilesInputRef}
                      onChange={handleExtraFilesInput}
                    />
                    
                    {extraImages.length > 0 && (
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                        {extraImages.map((img, index) => (
                          <div key={index} className="relative aspect-square bg-zinc-100 dark:bg-zinc-800 rounded-md overflow-hidden group">
                            <img src={img} alt={`Extra ${index + 1}`} className="w-full h-full object-cover" />
                            <button
                              type="button"
                              onClick={() => removeExtraImage(index)}
                              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>"""

content = content.replace(ui_old, ui_new)

# Add ImagePlus to lucide-react imports if it exists, or check if it's there
with open('src/pages/AdminPage.tsx', 'w') as f:
    f.write(content)
