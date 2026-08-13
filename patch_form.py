import re

with open('src/components/CartDrawer.tsx', 'r') as f:
    content = f.read()

content = content.replace('max-w-sm', 'max-w-md')

old_form = """            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-white mb-2">Nome Completo</label>
                <input 
                  type="text" name="name" value={formData.name} onChange={handleInputChange} 
                  className={`w-full p-3 bg-zinc-50 dark:bg-zinc-900 border ${formErrors.name ? 'border-red-500' : 'border-zinc-200 dark:border-zinc-800'} focus:outline-none focus:border-zinc-900 dark:focus:border-white transition-colors rounded-sm text-sm dark:text-white`} 
                />
                {formErrors.name && <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>}
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-white mb-2">CPF</label>
                <input 
                  type="text" name="cpf" value={formData.cpf} onChange={handleInputChange} placeholder="000.000.000-00"
                  className={`w-full p-3 bg-zinc-50 dark:bg-zinc-900 border ${formErrors.cpf ? 'border-red-500' : 'border-zinc-200 dark:border-zinc-800'} focus:outline-none focus:border-zinc-900 dark:focus:border-white transition-colors rounded-sm text-sm dark:text-white`} 
                />
                {formErrors.cpf && <p className="text-red-500 text-xs mt-1">{formErrors.cpf}</p>}
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-white mb-2">CEP</label>
                <input 
                  type="text" name="cep" value={formData.cep} onChange={handleInputChange} placeholder="00000-000"
                  className={`w-full p-3 bg-zinc-50 dark:bg-zinc-900 border ${formErrors.cep ? 'border-red-500' : 'border-zinc-200 dark:border-zinc-800'} focus:outline-none focus:border-zinc-900 dark:focus:border-white transition-colors rounded-sm text-sm dark:text-white`} 
                />
                {formErrors.cep && <p className="text-red-500 text-xs mt-1">{formErrors.cep}</p>}
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-white mb-2">Rua</label>
                <input 
                  type="text" name="street" value={formData.street} onChange={handleInputChange} 
                  className={`w-full p-3 bg-zinc-50 dark:bg-zinc-900 border ${formErrors.street ? 'border-red-500' : 'border-zinc-200 dark:border-zinc-800'} focus:outline-none focus:border-zinc-900 dark:focus:border-white transition-colors rounded-sm text-sm dark:text-white`} 
                />
                {formErrors.street && <p className="text-red-500 text-xs mt-1">{formErrors.street}</p>}
              </div>
              <div className="flex gap-4">
                <div className="w-1/3">
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-white mb-2">Número</label>
                  <input 
                    type="text" name="number" value={formData.number} onChange={handleInputChange} 
                    className={`w-full p-3 bg-zinc-50 dark:bg-zinc-900 border ${formErrors.number ? 'border-red-500' : 'border-zinc-200 dark:border-zinc-800'} focus:outline-none focus:border-zinc-900 dark:focus:border-white transition-colors rounded-sm text-sm dark:text-white`} 
                  />
                  {formErrors.number && <p className="text-red-500 text-xs mt-1">{formErrors.number}</p>}
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-white mb-2">Bairro</label>
                  <input 
                    type="text" name="neighborhood" value={formData.neighborhood} onChange={handleInputChange} 
                    className={`w-full p-3 bg-zinc-50 dark:bg-zinc-900 border ${formErrors.neighborhood ? 'border-red-500' : 'border-zinc-200 dark:border-zinc-800'} focus:outline-none focus:border-zinc-900 dark:focus:border-white transition-colors rounded-sm text-sm dark:text-white`} 
                  />
                  {formErrors.neighborhood && <p className="text-red-500 text-xs mt-1">{formErrors.neighborhood}</p>}
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-white mb-2">Cidade - UF</label>
                <input 
                  type="text" name="city" value={formData.city} onChange={handleInputChange} placeholder="Ex: São Paulo - SP"
                  className={`w-full p-3 bg-zinc-50 dark:bg-zinc-900 border ${formErrors.city ? 'border-red-500' : 'border-zinc-200 dark:border-zinc-800'} focus:outline-none focus:border-zinc-900 dark:focus:border-white transition-colors rounded-sm text-sm dark:text-white`} 
                />
                {formErrors.city && <p className="text-red-500 text-xs mt-1">{formErrors.city}</p>}
              </div>
            </div>"""

new_form = """            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-white mb-2">Nome Completo</label>
                <input 
                  type="text" name="name" value={formData.name} onChange={handleInputChange} 
                  className={`w-full p-3 bg-zinc-50 dark:bg-zinc-900 border ${formErrors.name ? 'border-red-500' : 'border-zinc-200 dark:border-zinc-800'} focus:outline-none focus:border-zinc-900 dark:focus:border-white transition-colors rounded-sm text-sm dark:text-white`} 
                />
                {formErrors.name && <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-white mb-2">CPF</label>
                  <input 
                    type="text" name="cpf" value={formData.cpf} onChange={handleInputChange} placeholder="000.000.000-00"
                    className={`w-full p-3 bg-zinc-50 dark:bg-zinc-900 border ${formErrors.cpf ? 'border-red-500' : 'border-zinc-200 dark:border-zinc-800'} focus:outline-none focus:border-zinc-900 dark:focus:border-white transition-colors rounded-sm text-sm dark:text-white`} 
                  />
                  {formErrors.cpf && <p className="text-red-500 text-xs mt-1">{formErrors.cpf}</p>}
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-white mb-2">CEP</label>
                  <input 
                    type="text" name="cep" value={formData.cep} onChange={handleInputChange} placeholder="00000-000"
                    className={`w-full p-3 bg-zinc-50 dark:bg-zinc-900 border ${formErrors.cep ? 'border-red-500' : 'border-zinc-200 dark:border-zinc-800'} focus:outline-none focus:border-zinc-900 dark:focus:border-white transition-colors rounded-sm text-sm dark:text-white`} 
                  />
                  {formErrors.cep && <p className="text-red-500 text-xs mt-1">{formErrors.cep}</p>}
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-white mb-2">Rua</label>
                <input 
                  type="text" name="street" value={formData.street} onChange={handleInputChange} 
                  className={`w-full p-3 bg-zinc-50 dark:bg-zinc-900 border ${formErrors.street ? 'border-red-500' : 'border-zinc-200 dark:border-zinc-800'} focus:outline-none focus:border-zinc-900 dark:focus:border-white transition-colors rounded-sm text-sm dark:text-white`} 
                />
                {formErrors.street && <p className="text-red-500 text-xs mt-1">{formErrors.street}</p>}
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="w-full sm:w-1/3">
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-white mb-2">Número</label>
                  <input 
                    type="text" name="number" value={formData.number} onChange={handleInputChange} 
                    className={`w-full p-3 bg-zinc-50 dark:bg-zinc-900 border ${formErrors.number ? 'border-red-500' : 'border-zinc-200 dark:border-zinc-800'} focus:outline-none focus:border-zinc-900 dark:focus:border-white transition-colors rounded-sm text-sm dark:text-white`} 
                  />
                  {formErrors.number && <p className="text-red-500 text-xs mt-1">{formErrors.number}</p>}
                </div>
                <div className="w-full sm:flex-1">
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-white mb-2">Bairro</label>
                  <input 
                    type="text" name="neighborhood" value={formData.neighborhood} onChange={handleInputChange} 
                    className={`w-full p-3 bg-zinc-50 dark:bg-zinc-900 border ${formErrors.neighborhood ? 'border-red-500' : 'border-zinc-200 dark:border-zinc-800'} focus:outline-none focus:border-zinc-900 dark:focus:border-white transition-colors rounded-sm text-sm dark:text-white`} 
                  />
                  {formErrors.neighborhood && <p className="text-red-500 text-xs mt-1">{formErrors.neighborhood}</p>}
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-white mb-2">Cidade - UF</label>
                <input 
                  type="text" name="city" value={formData.city} onChange={handleInputChange} placeholder="Ex: São Paulo - SP"
                  className={`w-full p-3 bg-zinc-50 dark:bg-zinc-900 border ${formErrors.city ? 'border-red-500' : 'border-zinc-200 dark:border-zinc-800'} focus:outline-none focus:border-zinc-900 dark:focus:border-white transition-colors rounded-sm text-sm dark:text-white`} 
                />
                {formErrors.city && <p className="text-red-500 text-xs mt-1">{formErrors.city}</p>}
              </div>
            </div>"""

content = content.replace(old_form, new_form)

with open('src/components/CartDrawer.tsx', 'w') as f:
    f.write(content)
