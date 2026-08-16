const fs = require('fs');

let code = fs.readFileSync('src/pages/AdminPage.tsx', 'utf8');

// We need to inject a new state for newSize, but we can just use a local variable in the component?
// No, React needs state for an input. Let's add `newSizeInput` to state.
if (!code.includes('const [newSizeInput, setNewSizeInput]')) {
  code = code.replace(
    "const [useAdvancedInventory, setUseAdvancedInventory] = useState(false);",
    "const [useAdvancedInventory, setUseAdvancedInventory] = useState(false);\n  const [newSizeInput, setNewSizeInput] = useState('');"
  );
}

// Imagens section
const imagesRegex = /\{\/\* Imagens \*\/\}([\s\S]*?)\{\/\* Variações \*\/\}/;
const newImages = `{/* Imagens */}
              <div className="bg-zinc-50 dark:bg-zinc-900/50 p-5 rounded-md border border-zinc-200 dark:border-zinc-800 space-y-6">
                <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-900 dark:text-white pb-2 border-b border-zinc-200 dark:border-zinc-800">
                  Imagens do Produto
                </h3>
                
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Imagem Principal */}
                  <div className="lg:col-span-5">
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 mb-2">Imagem Principal *</label>
                    <div 
                      className={\`relative border-2 border-dashed rounded-md p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-colors \${
                        isDragging 
                          ? 'border-zinc-900 bg-zinc-100 dark:border-white dark:bg-zinc-800' 
                          : 'border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 hover:bg-zinc-50 dark:hover:bg-zinc-900'
                      }\`}
                      style={{ minHeight: '200px' }}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        ref={fileInputRef}
                        onChange={handleFileInput}
                      />
                      
                      {imageUrl ? (
                        <div className="relative w-full aspect-square max-h-48 flex items-center justify-center group">
                          <img src={imageUrl} alt="Preview" className="max-w-full max-h-full object-contain rounded-md shadow-sm" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-md flex items-center justify-center">
                            <button 
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setImageUrl('');
                                if (fileInputRef.current) fileInputRef.current.value = '';
                              }}
                              className="bg-red-500 text-white rounded-full p-3 hover:bg-red-600 transition-colors shadow-md"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="py-4 flex flex-col items-center">
                          <div className="w-12 h-12 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-3">
                            <Upload className="w-5 h-5 text-zinc-400" />
                          </div>
                          <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 mb-1">
                            Arraste ou clique
                          </p>
                          <p className="text-xs text-zinc-500 dark:text-zinc-400">
                            PNG, JPG, WEBP
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Imagens Adicionais */}
                  <div className="lg:col-span-7 flex flex-col">
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">Galeria de Imagens</label>
                      <button
                        type="button"
                        onClick={() => extraFilesInputRef.current?.click()}
                        className="text-xs font-bold uppercase tracking-wider text-zinc-500 hover:text-zinc-900 dark:hover:text-white flex items-center gap-1 transition-colors"
                      >
                        <Plus className="w-3 h-3" /> Adicionar
                      </button>
                    </div>
                    
                    <input 
                      type="file" 
                      accept="image/*" 
                      multiple
                      className="hidden" 
                      ref={extraFilesInputRef}
                      onChange={handleExtraFilesInput}
                    />
                    
                    <div className="flex-1 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-md p-4 flex flex-col">
                      {extraImages.length > 0 ? (
                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                          {extraImages.map((img, index) => (
                            <div key={index} className="relative aspect-square bg-zinc-100 dark:bg-zinc-800 rounded-md overflow-hidden group shadow-sm border border-zinc-200 dark:border-zinc-700">
                              <img src={img} alt={\`Extra \${index + 1}\`} className="w-full h-full object-cover" />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <button
                                  type="button"
                                  onClick={() => removeExtraImage(index)}
                                  className="bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors shadow-sm"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          ))}
                          <button
                            type="button"
                            onClick={() => extraFilesInputRef.current?.click()}
                            className="aspect-square rounded-md border-2 border-dashed border-zinc-300 dark:border-zinc-700 hover:border-zinc-900 dark:hover:border-white hover:bg-zinc-50 dark:hover:bg-zinc-900 flex flex-col items-center justify-center text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
                          >
                            <ImagePlus className="w-6 h-6 mb-1" />
                            <span className="text-[10px] font-bold uppercase tracking-wider">Adicionar</span>
                          </button>
                        </div>
                      ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-center py-8">
                          <ImagePlus className="w-8 h-8 text-zinc-300 dark:text-zinc-700 mb-3" />
                          <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-4 max-w-[200px]">
                            Adicione imagens complementares do seu produto
                          </p>
                          <button
                            type="button"
                            onClick={() => extraFilesInputRef.current?.click()}
                            className="bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white font-bold uppercase tracking-wider text-xs px-4 py-2 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors rounded-md border border-zinc-200 dark:border-zinc-700"
                          >
                            Selecionar Imagens
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Variações */}`;

code = code.replace(imagesRegex, newImages);

// Tamanhos e Estoque section
const varsRegex = /\{\/\* Variações \*\/\}([\s\S]*?)\{\/\* Configurações \*\/\}/;
const newVars = `{/* Variações */}
              <div className="bg-zinc-50 dark:bg-zinc-900/50 p-5 rounded-md border border-zinc-200 dark:border-zinc-800 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-zinc-200 dark:border-zinc-800 gap-4 sm:gap-0">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-900 dark:text-white">
                    Variações do Produto
                  </h3>
                  <label className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 cursor-pointer bg-white dark:bg-zinc-950 px-3 py-1.5 rounded-md border border-zinc-200 dark:border-zinc-800 shadow-sm">
                    <input 
                      type="checkbox" 
                      checked={useAdvancedInventory}
                      onChange={(e) => setUseAdvancedInventory(e.target.checked)}
                      className="w-4 h-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900"
                    />
                    Estoque Avançado
                  </label>
                </div>

                {useAdvancedInventory ? (
                  <div className="space-y-6">
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      Controle o estoque de cada cor e tamanho individualmente.
                    </p>
                    {variants.map((variant, vIndex) => (
                      <div key={vIndex} className="p-5 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg relative shadow-sm">
                        <button 
                          type="button"
                          onClick={() => {
                            const newVariants = [...variants];
                            newVariants.splice(vIndex, 1);
                            setVariants(newVariants);
                          }}
                          className="absolute top-4 right-4 text-zinc-400 hover:text-red-500 transition-colors p-1"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                        
                        <div className="mb-5 pr-8">
                          <label className="block text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 mb-2">Cor da Variação *</label>
                          <input 
                            type="text" 
                            placeholder="Ex: Branco, Preto, Azul Marinho..."
                            value={variant.color}
                            onChange={e => {
                              const newVariants = [...variants];
                              newVariants[vIndex].color = e.target.value;
                              setVariants(newVariants);
                            }}
                            className="w-full max-w-sm bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-2.5 text-sm focus:outline-none focus:border-zinc-900 dark:focus:border-white transition-colors dark:text-white rounded-md"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 mb-3">Tamanhos Disponíveis e Estoque</label>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-3">
                            {variant.sizes.map((size, sIndex) => (
                              <div key={sIndex} className="flex items-center gap-2 bg-zinc-50 dark:bg-zinc-900 p-2 rounded-md border border-zinc-200 dark:border-zinc-800">
                                <input 
                                  type="text" 
                                  placeholder="Tam"
                                  value={size.name}
                                  onChange={e => {
                                    const newVariants = [...variants];
                                    newVariants[vIndex].sizes[sIndex].name = e.target.value.toUpperCase();
                                    setVariants(newVariants);
                                  }}
                                  className="w-16 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-700 p-1.5 text-sm font-bold text-center focus:outline-none focus:border-zinc-900 dark:focus:border-white transition-colors dark:text-white rounded-md"
                                />
                                <span className="text-zinc-400">→</span>
                                <div className="flex-1 flex items-center relative">
                                  <input 
                                    type="number" 
                                    min="0"
                                    placeholder="0"
                                    value={size.stock}
                                    onChange={e => {
                                      const newVariants = [...variants];
                                      newVariants[vIndex].sizes[sIndex].stock = parseInt(e.target.value) || 0;
                                      setVariants(newVariants);
                                    }}
                                    className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-700 p-1.5 pl-3 text-sm focus:outline-none focus:border-zinc-900 dark:focus:border-white transition-colors dark:text-white rounded-md"
                                  />
                                  <span className="absolute right-3 text-[10px] uppercase font-bold text-zinc-400">un</span>
                                </div>
                                <button 
                                  type="button"
                                  onClick={() => {
                                    const newVariants = [...variants];
                                    newVariants[vIndex].sizes.splice(sIndex, 1);
                                    setVariants(newVariants);
                                  }}
                                  className="text-zinc-400 hover:text-red-500 transition-colors p-1"
                                >
                                  <X className="h-4 w-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                          <button 
                            type="button"
                            onClick={() => {
                              const newVariants = [...variants];
                              newVariants[vIndex].sizes.push({ name: '', stock: 0 });
                              setVariants(newVariants);
                            }}
                            className="text-xs font-bold uppercase tracking-wider text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white flex items-center gap-1 transition-colors bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 px-3 py-2 rounded-md border border-zinc-200 dark:border-zinc-800"
                          >
                            <Plus className="h-3 w-3" />
                            Novo Tamanho
                          </button>
                        </div>
                      </div>
                    ))}
                    <button 
                      type="button"
                      onClick={() => setVariants([...variants, { color: '', sizes: [{ name: '', stock: 0 }] }])}
                      className="w-full p-4 border-2 border-dashed border-zinc-300 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:border-zinc-900 hover:text-zinc-900 dark:hover:border-white dark:hover:text-white hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors rounded-lg text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2"
                    >
                      <Plus className="h-5 w-5" />
                      Adicionar Cor
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 mb-2">Cores (opcional)</label>
                      <input 
                        type="text" 
                        value={colors}
                        onChange={e => setColors(e.target.value)}
                        className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-3 text-sm focus:outline-none focus:border-zinc-900 dark:focus:border-white transition-colors dark:text-white rounded-md mb-2"
                        placeholder="Ex: Branco, Preto, Azul"
                      />
                      <p className="text-xs text-zinc-500">Pode deixar em branco se o produto não tiver cores variadas.</p>
                    </div>
                    
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 mb-2">Tamanhos Disponíveis</label>
                      
                      <div className="flex flex-wrap gap-2 mb-3">
                        {sizes.split(',').map(s => s.trim()).filter(Boolean).map((size, index) => (
                          <div key={index} className="flex items-center gap-1 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 px-3 py-1.5 rounded-md text-sm font-bold shadow-sm">
                            <span>{size}</span>
                            <button 
                              type="button"
                              onClick={() => {
                                const newSizes = sizes.split(',').map(s => s.trim()).filter(Boolean);
                                newSizes.splice(index, 1);
                                setSizes(newSizes.join(', '));
                              }}
                              className="ml-1 opacity-70 hover:opacity-100 transition-opacity"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                      </div>

                      <div className="flex gap-2">
                        <input 
                          type="text" 
                          value={newSizeInput}
                          onChange={e => setNewSizeInput(e.target.value.toUpperCase())}
                          onKeyDown={e => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              const val = newSizeInput.trim();
                              if (val) {
                                const currentSizes = sizes.split(',').map(s => s.trim()).filter(Boolean);
                                if (!currentSizes.includes(val)) {
                                  setSizes([...currentSizes, val].join(', '));
                                }
                                setNewSizeInput('');
                              }
                            }
                          }}
                          className="flex-1 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-3 text-sm focus:outline-none focus:border-zinc-900 dark:focus:border-white transition-colors dark:text-white rounded-md"
                          placeholder="Ex: P, 40, Único"
                        />
                        <button 
                          type="button"
                          onClick={() => {
                            const val = newSizeInput.trim();
                            if (val) {
                              const currentSizes = sizes.split(',').map(s => s.trim()).filter(Boolean);
                              if (!currentSizes.includes(val)) {
                                setSizes([...currentSizes, val].join(', '));
                              }
                              setNewSizeInput('');
                            }
                          }}
                          className="bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white font-bold uppercase px-4 rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors border border-zinc-200 dark:border-zinc-700 flex items-center justify-center text-xs"
                        >
                          Add
                        </button>
                      </div>
                      
                      {/* Presets de Tamanho Rápidos */}
                      <div className="mt-4">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-2">Adicionar Rápido:</p>
                        <div className="flex flex-wrap gap-1.5">
                          {['P', 'M', 'G', 'GG', 'XG', '38', '39', '40', '41', '42'].map(preset => (
                            <button
                              key={preset}
                              type="button"
                              onClick={() => {
                                const currentSizes = sizes.split(',').map(s => s.trim()).filter(Boolean);
                                if (!currentSizes.includes(preset)) {
                                  setSizes([...currentSizes, preset].join(', '));
                                }
                              }}
                              className="text-xs bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 px-2 py-1 rounded transition-colors border border-zinc-200 dark:border-zinc-700"
                            >
                              {preset}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Configurações */}`;

code = code.replace(varsRegex, newVars);

fs.writeFileSync('src/pages/AdminPage.tsx', code);
