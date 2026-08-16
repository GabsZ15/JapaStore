const fs = require('fs');

let code = fs.readFileSync('src/pages/AdminPage.tsx', 'utf8');

// 1. Add newColorInput to state if missing
if (!code.includes('const [newColorInput, setNewColorInput] = useState')) {
  code = code.replace(
    "const [newSizeInput, setNewSizeInput] = useState('');",
    "const [newSizeInput, setNewSizeInput] = useState('');\n  const [newColorInput, setNewColorInput] = useState('');"
  );
}

// 2. Adjust column widths
code = code.replace(
  `<section className="w-full lg:w-1/3">`,
  `<section className="w-full lg:w-[45%]">`
);
code = code.replace(
  `<section className="w-full lg:w-2/3">`,
  `<section className="w-full lg:w-[55%]">`
);

// 3. Replace the entire <form>...</form> for the products section
const formRegex = /<form onSubmit=\{handleSubmit\} className="flex flex-col gap-6">([\s\S]*?)<\/form>/;

const newForm = `<form onSubmit={handleSubmit} className="flex flex-col gap-6">
              {/* Informações Principais */}
              <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm space-y-5">
                <h3 className="text-base font-black uppercase tracking-tight text-zinc-900 dark:text-white pb-3 border-b border-zinc-100 dark:border-zinc-800">
                  Informações Principais
                </h3>
                
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 mb-2">Nome do Produto *</label>
                  <input 
                    type="text" 
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-3 text-sm focus:outline-none focus:border-zinc-900 dark:focus:border-white transition-colors dark:text-white rounded-md"
                    placeholder="Ex: Tênis Nike Air Max"
                  />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 mb-2">Preço (R$) *</label>
                    <input 
                      type="number" 
                      step="0.01"
                      min="0"
                      required
                      value={price}
                      onChange={e => setPrice(e.target.value)}
                      className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-3 text-sm focus:outline-none focus:border-zinc-900 dark:focus:border-white transition-colors dark:text-white rounded-md"
                      placeholder="Ex: 299.99"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 mb-2">Categoria *</label>
                    <select 
                      required
                      value={category}
                      onChange={e => setCategory(e.target.value)}
                      className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-3 text-sm focus:outline-none focus:border-zinc-900 dark:focus:border-white transition-colors dark:text-white rounded-md appearance-none"
                    >
                      <option value="" disabled>Selecione</option>
                      <option value="Camiseta">Camisetas</option>
                      <option value="Bermuda">Bermudas</option>
                      <option value="Moletom">Moletons</option>
                      <option value="Acessorios">Acessórios</option>
                      {category && !['Camiseta', 'Bermuda', 'Moletom', 'Acessorios'].includes(category) && (
                        <option value={category}>{category} (Antigo)</option>
                      )}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 mb-2">Descrição Curta</label>
                  <textarea 
                    rows={3}
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-3 text-sm focus:outline-none focus:border-zinc-900 dark:focus:border-white transition-colors dark:text-white rounded-md resize-none"
                    placeholder="Breve descrição do produto..."
                  />
                </div>
              </div>

              {/* Imagens */}
              <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm space-y-5">
                <h3 className="text-base font-black uppercase tracking-tight text-zinc-900 dark:text-white pb-3 border-b border-zinc-100 dark:border-zinc-800">
                  Imagens do Produto
                </h3>
                
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 mb-2">Imagem Principal *</label>
                  <div 
                    className={\`relative border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-colors \${
                      isDragging 
                        ? 'border-zinc-900 bg-zinc-100 dark:border-white dark:bg-zinc-800' 
                        : 'border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 hover:bg-zinc-100 dark:hover:bg-zinc-900'
                    }\`}
                    style={{ minHeight: '240px' }}
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
                      <div className="relative w-full aspect-square max-h-56 flex items-center justify-center group">
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
                        <div className="w-16 h-16 bg-white dark:bg-zinc-800 rounded-full flex items-center justify-center mb-4 shadow-sm border border-zinc-100 dark:border-zinc-700">
                          <Upload className="w-6 h-6 text-zinc-400" />
                        </div>
                        <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100 mb-1">
                          Arraste ou clique para enviar
                        </p>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400">
                          PNG, JPG, WEBP (Max. 5MB)
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">Imagens Adicionais</label>
                  </div>
                  
                  <input 
                    type="file" 
                    accept="image/*" 
                    multiple
                    className="hidden" 
                    ref={extraFilesInputRef}
                    onChange={handleExtraFilesInput}
                  />
                  
                  <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
                    {extraImages.map((img, index) => (
                      <div key={index} className="relative aspect-square bg-zinc-100 dark:bg-zinc-800 rounded-md overflow-hidden group shadow-sm border border-zinc-200 dark:border-zinc-700">
                        <img src={img} alt={\`Extra \${index + 1}\`} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <button
                            type="button"
                            onClick={() => removeExtraImage(index)}
                            className="bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition-colors shadow-sm"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => extraFilesInputRef.current?.click()}
                      className="aspect-square rounded-md border-2 border-dashed border-zinc-300 dark:border-zinc-700 hover:border-zinc-900 dark:hover:border-white hover:bg-zinc-50 dark:hover:bg-zinc-900 flex flex-col items-center justify-center text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
                    >
                      <Plus className="w-6 h-6 mb-1" />
                      <span className="text-[10px] font-bold uppercase tracking-wider mt-1">Adicionar</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Variações */}
              <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800 gap-4 sm:gap-0">
                  <h3 className="text-base font-black uppercase tracking-tight text-zinc-900 dark:text-white">
                    Variações do Produto
                  </h3>
                  <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 cursor-pointer bg-zinc-50 dark:bg-zinc-950 px-3 py-2 rounded-md border border-zinc-200 dark:border-zinc-800 shadow-sm transition-colors hover:border-zinc-400 dark:hover:border-zinc-600">
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
                    <div className="bg-zinc-50 dark:bg-zinc-950 p-4 rounded-md border border-zinc-200 dark:border-zinc-800">
                      <p className="text-xs text-zinc-600 dark:text-zinc-400 font-medium mb-4">
                        Gerencie o estoque para cada combinação de cor e tamanho.
                      </p>
                      
                      <div className="space-y-4">
                        {variants.map((variant, vIndex) => (
                          <div key={vIndex} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden shadow-sm">
                            <div className="bg-zinc-100 dark:bg-zinc-800/50 px-4 py-3 flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800">
                              <div className="flex items-center gap-3 w-full max-w-sm">
                                <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">Cor:</span>
                                <input 
                                  type="text" 
                                  placeholder="Ex: Branco, Preto..."
                                  value={variant.color}
                                  onChange={e => {
                                    const newVariants = [...variants];
                                    newVariants[vIndex].color = e.target.value;
                                    setVariants(newVariants);
                                  }}
                                  className="flex-1 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-700 px-3 py-1.5 text-sm font-bold text-zinc-900 dark:text-white rounded-md focus:outline-none focus:border-zinc-900 dark:focus:border-white transition-colors"
                                />
                              </div>
                              <button 
                                type="button"
                                onClick={() => {
                                  const newVariants = [...variants];
                                  newVariants.splice(vIndex, 1);
                                  setVariants(newVariants);
                                }}
                                className="text-zinc-400 hover:text-red-500 transition-colors p-1"
                                title="Remover Cor"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                            
                            <div className="p-4">
                              <div className="grid grid-cols-12 gap-4 mb-2 text-xs font-bold uppercase tracking-wider text-zinc-500">
                                <div className="col-span-5">Tamanho</div>
                                <div className="col-span-5">Estoque</div>
                                <div className="col-span-2"></div>
                              </div>
                              
                              <div className="space-y-2">
                                {variant.sizes.map((size, sIndex) => (
                                  <div key={sIndex} className="grid grid-cols-12 gap-4 items-center">
                                    <div className="col-span-5">
                                      <input 
                                        type="text" 
                                        placeholder="Ex: M, 40"
                                        value={size.name}
                                        onChange={e => {
                                          const newVariants = [...variants];
                                          newVariants[vIndex].sizes[sIndex].name = e.target.value.toUpperCase();
                                          setVariants(newVariants);
                                        }}
                                        className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 px-3 py-2 text-sm font-bold focus:outline-none focus:border-zinc-900 dark:focus:border-white transition-colors dark:text-white rounded-md"
                                      />
                                    </div>
                                    <div className="col-span-5 relative">
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
                                        className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 px-3 py-2 text-sm focus:outline-none focus:border-zinc-900 dark:focus:border-white transition-colors dark:text-white rounded-md"
                                      />
                                    </div>
                                    <div className="col-span-2 flex justify-end">
                                      <button 
                                        type="button"
                                        onClick={() => {
                                          const newVariants = [...variants];
                                          newVariants[vIndex].sizes.splice(sIndex, 1);
                                          setVariants(newVariants);
                                        }}
                                        className="text-zinc-400 hover:text-red-500 transition-colors p-2 bg-zinc-50 dark:bg-zinc-800 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md border border-zinc-200 dark:border-zinc-700"
                                      >
                                        <X className="h-4 w-4" />
                                      </button>
                                    </div>
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
                                className="mt-4 text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center justify-center gap-2 transition-colors border border-dashed border-zinc-300 dark:border-zinc-700 py-2 w-full rounded-md"
                              >
                                <Plus className="h-4 w-4" />
                                Adicionar Tamanho
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <button 
                        type="button"
                        onClick={() => setVariants([...variants, { color: '', sizes: [{ name: '', stock: 0 }] }])}
                        className="mt-4 w-full py-4 border-2 border-dashed border-zinc-300 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:border-zinc-900 hover:text-zinc-900 dark:hover:border-white dark:hover:text-white hover:bg-white dark:hover:bg-zinc-900 transition-colors rounded-lg text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2"
                      >
                        <Plus className="h-5 w-5" />
                        Adicionar Nova Cor
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Cores Básicas */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 mb-3">Cores (Opcional)</label>
                      
                      <div className="flex flex-wrap gap-2 mb-3">
                        {colors.split(',').map(c => c.trim()).filter(Boolean).map((color, index) => (
                          <div key={index} className="flex items-center gap-1.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 px-3 py-1.5 rounded-md text-sm font-bold shadow-sm border border-zinc-200 dark:border-zinc-700">
                            <span>{color}</span>
                            <button 
                              type="button"
                              onClick={() => {
                                const newColors = colors.split(',').map(c => c.trim()).filter(Boolean);
                                newColors.splice(index, 1);
                                setColors(newColors.join(', '));
                              }}
                              className="ml-1 text-zinc-400 hover:text-red-500 transition-colors"
                            >
                              <X className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>

                      <div className="flex gap-2 max-w-sm">
                        <input 
                          type="text" 
                          value={newColorInput}
                          onChange={e => setNewColorInput(e.target.value)}
                          onKeyDown={e => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              const val = newColorInput.trim();
                              if (val) {
                                const currentColors = colors.split(',').map(c => c.trim()).filter(Boolean);
                                if (!currentColors.includes(val)) {
                                  setColors([...currentColors, val].join(', '));
                                }
                                setNewColorInput('');
                              }
                            }
                          }}
                          className="flex-1 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-2.5 text-sm focus:outline-none focus:border-zinc-900 dark:focus:border-white transition-colors dark:text-white rounded-md"
                          placeholder="Ex: Branco, Preto..."
                        />
                        <button 
                          type="button"
                          onClick={() => {
                            const val = newColorInput.trim();
                            if (val) {
                              const currentColors = colors.split(',').map(c => c.trim()).filter(Boolean);
                              if (!currentColors.includes(val)) {
                                setColors([...currentColors, val].join(', '));
                              }
                              setNewColorInput('');
                            }
                          }}
                          className="bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-bold uppercase tracking-wider px-4 rounded-md hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors flex items-center justify-center text-xs shadow-sm"
                        >
                          Adicionar Cor
                        </button>
                      </div>
                    </div>
                    
                    {/* Tamanhos Básicos */}
                    <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800">
                      <label className="block text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 mb-3">Tamanhos Disponíveis</label>
                      
                      <div className="flex flex-wrap gap-2 mb-3">
                        {sizes.split(',').map(s => s.trim()).filter(Boolean).map((size, index) => (
                          <div key={index} className="flex items-center gap-1.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 px-3 py-1.5 rounded-md text-sm font-bold shadow-sm border border-zinc-200 dark:border-zinc-700">
                            <span>{size}</span>
                            <button 
                              type="button"
                              onClick={() => {
                                const newSizes = sizes.split(',').map(s => s.trim()).filter(Boolean);
                                newSizes.splice(index, 1);
                                setSizes(newSizes.join(', '));
                              }}
                              className="ml-1 text-zinc-400 hover:text-red-500 transition-colors"
                            >
                              <X className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>

                      <div className="flex gap-2 max-w-sm">
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
                          className="flex-1 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-2.5 text-sm focus:outline-none focus:border-zinc-900 dark:focus:border-white transition-colors dark:text-white rounded-md"
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
                          className="bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-bold uppercase tracking-wider px-4 rounded-md hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors flex items-center justify-center text-xs shadow-sm"
                        >
                          Adicionar Tamanho
                        </button>
                      </div>
                      
                      <div className="mt-4 bg-zinc-50 dark:bg-zinc-950/50 p-3 rounded-md border border-zinc-200 dark:border-zinc-800 max-w-sm">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-2">Adicionar Rápido:</p>
                        <div className="flex flex-wrap gap-2">
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
                              className="text-xs font-bold bg-white dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 px-3 py-1.5 rounded-md transition-colors border border-zinc-200 dark:border-zinc-700 shadow-sm"
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

              {/* Configurações */}
              <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm space-y-5">
                <h3 className="text-base font-black uppercase tracking-tight text-zinc-900 dark:text-white pb-3 border-b border-zinc-100 dark:border-zinc-800">
                  Configurações
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-start">
                  <div className="flex flex-col gap-2">
                    <label className="flex items-center gap-3 cursor-pointer p-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-md">
                      <input 
                        type="checkbox"
                        checked={allowInstallments}
                        onChange={(e) => setAllowInstallments(e.target.checked)}
                        className="w-5 h-5 text-zinc-900 dark:text-white bg-white dark:bg-zinc-900 border-zinc-300 dark:border-zinc-700 rounded focus:ring-zinc-900 dark:focus:ring-white"
                      />
                      <span className="text-sm font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">Permitir parcelamento</span>
                    </label>
                  </div>
                  <div className={\`flex flex-col gap-2 transition-opacity duration-200 \${allowInstallments ? 'opacity-100' : 'opacity-50 pointer-events-none'}\`}>
                    <label className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">Número Máximo de Parcelas</label>
                    <input 
                      type="number" 
                      min="1"
                      max="12"
                      disabled={!allowInstallments}
                      value={maxInstallments}
                      onChange={e => setMaxInstallments(e.target.value)}
                      className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-3 text-sm font-bold focus:outline-none focus:border-zinc-900 dark:focus:border-white transition-colors dark:text-white rounded-md"
                      placeholder="Ex: 10"
                    />
                  </div>
                </div>
              </div>

              {/* Botões */}
              <div className="flex gap-4 pt-2">
                {editingId && (
                  <button 
                    type="button"
                    onClick={resetForm}
                    className="flex-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white font-bold uppercase tracking-wider text-sm py-4 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-700"
                  >
                    Cancelar
                  </button>
                )}
                <button 
                  type="submit" 
                  className="flex-[2] bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-bold uppercase tracking-wider text-sm py-4 hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors rounded-xl flex items-center justify-center gap-2 shadow-md border border-transparent"
                >
                  <Save className="h-5 w-5" />
                  {editingId ? 'Atualizar Produto' : 'Salvar Produto'}
                </button>
              </div>
            </form>`;

code = code.replace(formRegex, newForm);

fs.writeFileSync('src/pages/AdminPage.tsx', code);
