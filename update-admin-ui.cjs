const fs = require('fs');
let code = fs.readFileSync('src/pages/AdminPage.tsx', 'utf8');

const advancedUI = `
              <div className="mb-6 p-4 border border-zinc-200 dark:border-zinc-800 rounded-md bg-zinc-50 dark:bg-zinc-900/50">
                <div className="flex items-center justify-between mb-4">
                  <label className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={useAdvancedInventory}
                      onChange={(e) => setUseAdvancedInventory(e.target.checked)}
                      className="w-4 h-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900"
                    />
                    Controle de Estoque Avançado (Cores e Tamanhos Específicos)
                  </label>
                </div>

                {useAdvancedInventory ? (
                  <div className="space-y-6">
                    {variants.map((variant, vIndex) => (
                      <div key={vIndex} className="p-4 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-md relative">
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
                          <label className="block text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 mb-2">Tamanhos e Estoque desta Cor</label>
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 mb-2">
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
                                  className="w-16 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-2 text-sm focus:outline-none focus:border-zinc-900 dark:focus:border-white transition-colors dark:text-white rounded-md text-center"
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
                            className="text-xs font-bold uppercase tracking-wider text-zinc-500 hover:text-zinc-900 dark:hover:text-white flex items-center gap-1 transition-colors"
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 mb-2">Cores do Produto (separadas por vírgula)</label>
                      <input 
                        type="text" 
                        value={colors}
                        onChange={e => setColors(e.target.value)}
                        className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-3 text-sm focus:outline-none focus:border-zinc-900 dark:focus:border-white transition-colors dark:text-white rounded-md mb-4"
                        placeholder="Ex: Branco, Preto, Azul"
                      />
                      <label className="block text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 mb-2">Tamanhos Disponíveis (separados por vírgula)</label>
                      <input 
                        type="text" 
                        value={sizes}
                        onChange={e => setSizes(e.target.value)}
                        className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-3 text-sm focus:outline-none focus:border-zinc-900 dark:focus:border-white transition-colors dark:text-white rounded-md"
                        placeholder="Ex: P, M, G, GG ou 38, 40, 42"
                      />
                    </div>
                  </div>
                )}
              </div>
`;

code = code.replace(
  `<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 mb-2">Cores do Produto (separadas por vírgula)</label>
                  <input 
                    type="text" 
                    value={colors}
                    onChange={e => setColors(e.target.value)}
                    className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-3 text-sm focus:outline-none focus:border-zinc-900 dark:focus:border-white transition-colors dark:text-white rounded-md mb-4"
                    placeholder="Ex: Branco, Preto, Azul"
                  />
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 mb-2">Tamanhos Disponíveis (separados por vírgula)</label>
                  <input 
                    type="text" 
                    value={sizes}
                    onChange={e => setSizes(e.target.value)}
                    className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-3 text-sm focus:outline-none focus:border-zinc-900 dark:focus:border-white transition-colors dark:text-white rounded-md"
                    placeholder="Ex: P, M, G, GG ou 38, 40, 42"
                  />
                </div>
                <div>`,
  advancedUI + `\n                <div>`
);

fs.writeFileSync('src/pages/AdminPage.tsx', code);
