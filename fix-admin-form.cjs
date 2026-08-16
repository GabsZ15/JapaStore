const fs = require('fs');
let code = fs.readFileSync('src/pages/AdminPage.tsx', 'utf8');

// Find the form starting with `<form onSubmit={handleSubmit} className="flex flex-col gap-4">`
const formStart = `<form onSubmit={handleSubmit} className="flex flex-col gap-4">`;
const formEnd = `            </form>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Form Section */}
            <section className="w-full lg:w-1/3">`;

const startIdx = code.indexOf(formStart);
if (startIdx === -1) {
  // Let's try to match the exact string since it might have changed
  // Wait, I will just use regex to replace between `<form onSubmit={handleSubmit} className="flex flex-col gap-4">` and `</form>`
  console.log("Could not find exact form start");
}

const replacement = `<form onSubmit={handleSubmit} className="flex flex-col gap-6">
              {/* Informações Principais */}
              <div className="bg-zinc-50 dark:bg-zinc-900/50 p-5 rounded-md border border-zinc-200 dark:border-zinc-800 space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-900 dark:text-white mb-4 pb-2 border-b border-zinc-200 dark:border-zinc-800">
                  Informações Principais
                </h3>
                
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 mb-2">Nome do Produto *</label>
                  <input 
                    type="text" 
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-3 text-sm focus:outline-none focus:border-zinc-900 dark:focus:border-white transition-colors dark:text-white rounded-md"
                    placeholder="Ex: Tênis Nike Air Max"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 mb-2">Preço (R$) *</label>
                    <input 
                      type="number" 
                      step="0.01"
                      min="0"
                      required
                      value={price}
                      onChange={e => setPrice(e.target.value)}
                      className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-3 text-sm focus:outline-none focus:border-zinc-900 dark:focus:border-white transition-colors dark:text-white rounded-md"
                      placeholder="Ex: 299.99"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 mb-2">Categoria *</label>
                    <select 
                      required
                      value={category}
                      onChange={e => setCategory(e.target.value)}
                      className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-3 text-sm focus:outline-none focus:border-zinc-900 dark:focus:border-white transition-colors dark:text-white rounded-md appearance-none"
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
                    className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-3 text-sm focus:outline-none focus:border-zinc-900 dark:focus:border-white transition-colors dark:text-white rounded-md resize-none"
                    placeholder="Breve descrição do produto..."
                  />
                </div>
              </div>

              {/* Imagens */}
              <div className="bg-zinc-50 dark:bg-zinc-900/50 p-5 rounded-md border border-zinc-200 dark:border-zinc-800 space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-900 dark:text-white mb-4 pb-2 border-b border-zinc-200 dark:border-zinc-800">
                  Imagens do Produto
                </h3>
                
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 mb-2">Imagem Principal *</label>
                  <div 
                    className={\`relative border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-colors \${
                      isDragging 
                        ? 'border-zinc-900 bg-zinc-100 dark:border-white dark:bg-zinc-800' 
                        : 'border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 hover:bg-zinc-50 dark:hover:bg-zinc-900'
                    }\`}
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
                      <div className="relative w-full aspect-square max-h-48 flex items-center justify-center">
                        <img src={imageUrl} alt="Preview" className="max-w-full max-h-full object-contain rounded-md shadow-sm" />
                        <button 
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setImageUrl('');
                            if (fileInputRef.current) fileInputRef.current.value = '';
                          }}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors shadow-md"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="py-6 flex flex-col items-center">
                        <div className="w-12 h-12 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-4">
                          <Upload className="w-6 h-6 text-zinc-400" />
                        </div>
                        <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 mb-1">
                          Toque ou arraste a imagem aqui
                        </p>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400">
                          PNG, JPG ou WEBP (Max. 5MB)
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 mb-2 mt-4">Imagens Adicionais</label>
                  <div className="flex flex-col gap-4">
                    <button
                      type="button"
                      onClick={() => extraFilesInputRef.current?.click()}
                      className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-3 text-sm font-bold uppercase tracking-wider hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors dark:text-white rounded-md border-dashed flex items-center justify-center gap-2"
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
                      <div className="grid grid-cols-3 gap-2">
                        {extraImages.map((img, index) => (
                          <div key={index} className="relative aspect-square bg-zinc-100 dark:bg-zinc-800 rounded-md overflow-hidden group">
                            <img src={img} alt={\`Extra \${index + 1}\`} className="w-full h-full object-cover" />
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
                </div>
              </div>

              {/* Variações */}
              <div className="bg-zinc-50 dark:bg-zinc-900/50 p-5 rounded-md border border-zinc-200 dark:border-zinc-800 space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-900 dark:text-white mb-4 pb-2 border-b border-zinc-200 dark:border-zinc-800">
                  Tamanhos e Estoque
                </h3>
                
                <div className="flex items-center justify-between mb-4">
                  <label className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={useAdvancedInventory}
                      onChange={(e) => setUseAdvancedInventory(e.target.checked)}
                      className="w-4 h-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900"
                    />
                    Estoque Avançado (Por Cor/Tamanho)
                  </label>
                </div>

                {useAdvancedInventory ? (
                  <div className="space-y-6">
                    {variants.map((variant, vIndex) => (
                      <div key={vIndex} className="p-4 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-md relative shadow-sm">
                        <button 
                          type="button"
                          onClick={() => {
                            const newVariants = [...variants];
                            newVariants.splice(vIndex, 1);
                            setVariants(newVariants);
                          }}
                          className="absolute top-4 right-4 text-zinc-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                        
                        <div className="mb-4 pr-8">
                          <label className="block text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 mb-2">Cor (ex: Branco)</label>
                          <input 
                            type="text" 
                            value={variant.color}
                            onChange={e => {
                              const newVariants = [...variants];
                              newVariants[vIndex].color = e.target.value;
                              setVariants(newVariants);
                            }}
                            className="w-full max-w-xs bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-2 text-sm focus:outline-none focus:border-zinc-900 dark:focus:border-white transition-colors dark:text-white rounded-md"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 mb-2">Tamanhos e Estoque</label>
                          <div className="grid grid-cols-1 gap-2 mb-2">
                            {variant.sizes.map((size, sIndex) => (
                              <div key={sIndex} className="flex items-center gap-2">
                                <input 
                                  type="text" 
                                  placeholder="Tam"
                                  value={size.name}
                                  onChange={e => {
                                    const newVariants = [...variants];
                                    newVariants[vIndex].sizes[sIndex].name = e.target.value;
                                    setVariants(newVariants);
                                  }}
                                  className="w-20 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-2 text-sm focus:outline-none focus:border-zinc-900 dark:focus:border-white transition-colors dark:text-white rounded-md text-center"
                                />
                                <input 
                                  type="number" 
                                  min="0"
                                  placeholder="Qtd"
                                  value={size.stock}
                                  onChange={e => {
                                    const newVariants = [...variants];
                                    newVariants[vIndex].sizes[sIndex].stock = parseInt(e.target.value) || 0;
                                    setVariants(newVariants);
                                  }}
                                  className="w-20 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-2 text-sm focus:outline-none focus:border-zinc-900 dark:focus:border-white transition-colors dark:text-white rounded-md text-center"
                                />
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
                            className="text-xs font-bold uppercase tracking-wider text-zinc-500 hover:text-zinc-900 dark:hover:text-white flex items-center gap-1 transition-colors mt-3"
                          >
                            <Plus className="h-3 w-3" />
                            Adicionar Tamanho
                          </button>
                        </div>
                      </div>
                    ))}
                    <button 
                      type="button"
                      onClick={() => setVariants([...variants, { color: '', sizes: [{ name: '', stock: 0 }] }])}
                      className="w-full p-3 border-2 border-dashed border-zinc-300 dark:border-zinc-700 text-zinc-500 hover:border-zinc-900 hover:text-zinc-900 dark:hover:border-white dark:hover:text-white transition-colors rounded-md text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      Adicionar Nova Cor
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 mb-2">Cores (separadas por vírgula)</label>
                      <input 
                        type="text" 
                        value={colors}
                        onChange={e => setColors(e.target.value)}
                        className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-3 text-sm focus:outline-none focus:border-zinc-900 dark:focus:border-white transition-colors dark:text-white rounded-md mb-4"
                        placeholder="Ex: Branco, Preto, Azul"
                      />
                      <label className="block text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 mb-2">Tamanhos (separados por vírgula)</label>
                      <input 
                        type="text" 
                        value={sizes}
                        onChange={e => setSizes(e.target.value)}
                        className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-3 text-sm focus:outline-none focus:border-zinc-900 dark:focus:border-white transition-colors dark:text-white rounded-md"
                        placeholder="Ex: P, M, G, GG"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Configurações */}
              <div className="bg-zinc-50 dark:bg-zinc-900/50 p-5 rounded-md border border-zinc-200 dark:border-zinc-800 space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-900 dark:text-white mb-4 pb-2 border-b border-zinc-200 dark:border-zinc-800">
                  Configurações
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center md:mt-8">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="checkbox"
                        checked={allowInstallments}
                        onChange={(e) => setAllowInstallments(e.target.checked)}
                        className="w-4 h-4 text-zinc-900 dark:text-white bg-zinc-100 dark:bg-zinc-900 border-zinc-300 dark:border-zinc-700 rounded focus:ring-zinc-900 dark:focus:ring-white"
                      />
                      <span className="text-sm font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">Permite parcelamento?</span>
                    </label>
                  </div>
                  <div>
                    <label className={\`block text-xs font-bold uppercase tracking-wider mb-2 transition-colors \${allowInstallments ? 'text-zinc-900 dark:text-zinc-100' : 'text-zinc-400 dark:text-zinc-600'}\`}>Número Máx. de Parcelas</label>
                    <input 
                      type="number" 
                      min="1"
                      max="12"
                      disabled={!allowInstallments}
                      value={maxInstallments}
                      onChange={e => setMaxInstallments(e.target.value)}
                      className={\`w-full border p-3 text-sm focus:outline-none rounded-md transition-colors \${allowInstallments ? 'bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 focus:border-zinc-900 dark:focus:border-white dark:text-white' : 'bg-zinc-100 dark:bg-zinc-900 border-zinc-100 dark:border-zinc-800 text-zinc-400 dark:text-zinc-600 cursor-not-allowed'}\`}
                      placeholder="Ex: 10"
                    />
                  </div>
                </div>
              </div>

              {/* Botões */}
              <div className="flex gap-3 pt-2">
                {editingId && (
                  <button 
                    type="button"
                    onClick={resetForm}
                    className="flex-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white font-bold uppercase tracking-wider text-xs py-4 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors rounded-md"
                  >
                    Cancelar
                  </button>
                )}
                <button 
                  type="submit" 
                  className="flex-[2] bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-bold uppercase tracking-wider text-xs py-4 hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors rounded-md flex items-center justify-center gap-2 shadow-md"
                >
                  <Save className="h-4 w-4" />
                  {editingId ? 'Atualizar Produto' : 'Salvar Produto'}
                </button>
              </div>

            </form>`;

const regex = /<form onSubmit=\{handleSubmit\} className="flex flex-col gap-4">([\s\S]*?)<\/form>/;
code = code.replace(regex, replacement);

fs.writeFileSync('src/pages/AdminPage.tsx', code);
