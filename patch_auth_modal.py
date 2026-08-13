import re

with open('src/components/AuthModal.tsx', 'r') as f:
    content = f.read()

# Add step state and address state
state_target = "  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');"
state_replacement = """  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [step, setStep] = useState<'auth' | 'address'>('auth');
  const [addressData, setAddressData] = useState({
    name: '',
    cpf: '',
    cep: '',
    street: '',
    number: '',
    neighborhood: '',
    city: ''
  });"""
content = content.replace(state_target, state_replacement)

# Update handleRegister to change step instead of onClose
register_target = """      if (error) throw error;
      onClose();"""
register_replacement = """      if (error) throw error;
      setAddressData(prev => ({ ...prev, name: fullName }));
      setStep('address');"""
content = content.replace(register_target, register_replacement)

# Add handleSaveAddress function
login_func_target = "  const handleLogin = async (e: React.FormEvent) => {"
save_address_func = """  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        data: { address: addressData }
      });
      if (error) throw error;
      setStep('auth');
      onClose();
    } catch (err: any) {
      setError(err.message || 'Erro ao salvar endereço.');
    } finally {
      setLoading(false);
    }
  };

"""
content = content.replace(login_func_target, save_address_func + login_func_target)

# Handle onClose to also reset step
onclose_target = "          onClick={onClose}"
onclose_replacement = """          onClick={() => { setStep('auth'); onClose(); }}"""
content = content.replace(onclose_target, onclose_replacement)

# Update modal JSX to render either auth tabs or address form
jsx_target = """        <div className="flex border-b border-zinc-200 dark:border-zinc-800">
          <button
            className={`flex-1 py-4 text-sm font-bold uppercase tracking-wider transition-colors ${
              activeTab === 'login' 
                ? 'text-zinc-900 dark:text-white border-b-2 border-zinc-900 dark:border-white' 
                : 'text-zinc-400 dark:text-zinc-600 hover:text-zinc-600 dark:hover:text-zinc-400'
            }`}
            onClick={() => { setActiveTab('login'); setError(null); }}
          >{texts.loginTab}</button>
          <button
            className={`flex-1 py-4 text-sm font-bold uppercase tracking-wider transition-colors ${
              activeTab === 'register' 
                ? 'text-zinc-900 dark:text-white border-b-2 border-zinc-900 dark:border-white' 
                : 'text-zinc-400 dark:text-zinc-600 hover:text-zinc-600 dark:hover:text-zinc-400'
            }`}
            onClick={() => { setActiveTab('register'); setError(null); }}
          >{texts.registerTab}</button>
        </div>"""

jsx_replacement = """        {step === 'auth' ? (
          <div className="flex border-b border-zinc-200 dark:border-zinc-800 shrink-0">
            <button
              className={`flex-1 py-4 text-sm font-bold uppercase tracking-wider transition-colors ${
                activeTab === 'login' 
                  ? 'text-zinc-900 dark:text-white border-b-2 border-zinc-900 dark:border-white' 
                  : 'text-zinc-400 dark:text-zinc-600 hover:text-zinc-600 dark:hover:text-zinc-400'
              }`}
              onClick={() => { setActiveTab('login'); setError(null); }}
            >{texts.loginTab}</button>
            <button
              className={`flex-1 py-4 text-sm font-bold uppercase tracking-wider transition-colors ${
                activeTab === 'register' 
                  ? 'text-zinc-900 dark:text-white border-b-2 border-zinc-900 dark:border-white' 
                  : 'text-zinc-400 dark:text-zinc-600 hover:text-zinc-600 dark:hover:text-zinc-400'
              }`}
              onClick={() => { setActiveTab('register'); setError(null); }}
            >{texts.registerTab}</button>
          </div>
        ) : (
          <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 text-center shrink-0">
            <h3 className="font-bold uppercase tracking-wider text-sm text-zinc-900 dark:text-white">Dados de Entrega (Opcional)</h3>
          </div>
        )}"""
content = content.replace(jsx_target, jsx_replacement)


# Now we conditionally render the auth forms or address form
form_target = """        <div className="p-8 overflow-y-auto">
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 text-sm rounded">
              {error}
            </div>
          )}
          {activeTab === 'login' ? ("""

form_replacement = """        <div className="p-8 overflow-y-auto">
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 text-sm rounded">
              {error}
            </div>
          )}
          {step === 'address' ? (
            <form className="flex flex-col gap-4" onSubmit={handleSaveAddress}>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 mb-2">CPF</label>
                <input type="text" value={addressData.cpf} onChange={e => setAddressData(p => ({ ...p, cpf: e.target.value }))} className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-3 text-sm focus:outline-none focus:border-zinc-900 dark:focus:border-white transition-colors dark:text-white" placeholder="000.000.000-00" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 mb-2">CEP</label>
                  <input type="text" value={addressData.cep} onChange={e => setAddressData(p => ({ ...p, cep: e.target.value }))} className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-3 text-sm focus:outline-none focus:border-zinc-900 dark:focus:border-white transition-colors dark:text-white" placeholder="00000-000" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 mb-2">Cidade - UF</label>
                  <input type="text" value={addressData.city} onChange={e => setAddressData(p => ({ ...p, city: e.target.value }))} className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-3 text-sm focus:outline-none focus:border-zinc-900 dark:focus:border-white transition-colors dark:text-white" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 mb-2">Rua</label>
                <input type="text" value={addressData.street} onChange={e => setAddressData(p => ({ ...p, street: e.target.value }))} className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-3 text-sm focus:outline-none focus:border-zinc-900 dark:focus:border-white transition-colors dark:text-white" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 mb-2">Número</label>
                  <input type="text" value={addressData.number} onChange={e => setAddressData(p => ({ ...p, number: e.target.value }))} className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-3 text-sm focus:outline-none focus:border-zinc-900 dark:focus:border-white transition-colors dark:text-white" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 mb-2">Bairro</label>
                  <input type="text" value={addressData.neighborhood} onChange={e => setAddressData(p => ({ ...p, neighborhood: e.target.value }))} className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-3 text-sm focus:outline-none focus:border-zinc-900 dark:focus:border-white transition-colors dark:text-white" />
                </div>
              </div>
              <button disabled={loading} type="submit" className="w-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-bold uppercase tracking-wider text-sm py-4 mt-2 hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors disabled:opacity-50">
                {loading ? 'Salvando...' : 'Salvar Endereço'}
              </button>
              <button type="button" onClick={() => { setStep('auth'); onClose(); }} className="w-full text-zinc-500 text-xs font-bold uppercase hover:text-zinc-900 dark:hover:text-white transition-colors text-center mt-2">
                Pular
              </button>
            </form>
          ) : activeTab === 'login' ? ("""
content = content.replace(form_target, form_replacement)

# We also need to hide the "or access with" section if step === 'address'
or_access_target = """          <div className="mt-8">
            <div className="relative">"""

or_access_replacement = """          {step === 'auth' && (
          <div className="mt-8">
            <div className="relative">"""

content = content.replace(or_access_target, or_access_replacement)

end_access_target = """              </button>
            </div>
          </div>
        </div>
      </div>
    </div>"""

end_access_replacement = """              </button>
            </div>
          </div>
          )}
        </div>
      </div>
    </div>"""

content = content.replace(end_access_target, end_access_replacement)

with open('src/components/AuthModal.tsx', 'w') as f:
    f.write(content)

