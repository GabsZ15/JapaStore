import { Mail, MapPin, Phone } from 'lucide-react';

import { useSettings } from '../contexts/SettingsContext';

export function ContatoPage() {
  const { settings } = useSettings();
  const content = settings.siteContent.contact;
  return (
    <main className="min-h-screen py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-16">
          <h1 className="text-3xl md:text-4xl font-black tracking-tighter uppercase mb-4 text-zinc-900 dark:text-white transition-colors duration-300">{content.title}</h1>
          <p className="text-zinc-500 dark:text-zinc-400 font-medium">
            {content.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start max-w-5xl mx-auto">
          
          {/* Informações de Contato */}
          <div className="bg-zinc-50 dark:bg-zinc-900/50 p-8 md:p-12 border border-zinc-200 dark:border-zinc-800 transition-colors duration-300">
            <h3 className="font-bold text-xl text-zinc-900 dark:text-white uppercase tracking-tight mb-8">
              Canais de Atendimento
            </h3>
            
            <div className="space-y-8">
              <a href={`mailto:${content.email}`} className="flex items-start gap-4 hover:opacity-80 transition-opacity">
                <div className="bg-white dark:bg-zinc-900 p-3 shadow-sm border border-zinc-100 dark:border-zinc-800">
                  <Mail className="h-5 w-5 text-zinc-900 dark:text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-sm uppercase tracking-wider text-zinc-900 dark:text-white mb-1">E-mail</h4>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">{content.email}</p>
                  <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1">Resposta em até 24h úteis</p>
                </div>
              </a>

              <a href={`https://wa.me/${settings.whatsappNumber?.replace(/\D/g, '') || '5511999999999'}`} target="_blank" rel="noreferrer" className="flex items-start gap-4 hover:opacity-80 transition-opacity">
                <div className="bg-white dark:bg-zinc-900 p-3 shadow-sm border border-zinc-100 dark:border-zinc-800">
                  <Phone className="h-5 w-5 text-zinc-900 dark:text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-sm uppercase tracking-wider text-zinc-900 dark:text-white mb-1">WhatsApp / Telefone</h4>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">{settings.whatsappNumber || content.phone}</p>
                  <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1">{content.businessHours}</p>
                </div>
              </a>

              <div className="flex items-start gap-4">
                <div className="bg-white dark:bg-zinc-900 p-3 shadow-sm border border-zinc-100 dark:border-zinc-800">
                  <MapPin className="h-5 w-5 text-zinc-900 dark:text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-sm uppercase tracking-wider text-zinc-900 dark:text-white mb-1">Escritório Central</h4>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">{content.addressLine1}</p>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">{content.addressLine2}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Formulário */}
          <div>
            <form className="space-y-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 mb-2">Nome Completo</label>
                <input 
                  type="text" 
                  className="w-full bg-transparent border border-zinc-200 dark:border-zinc-800 p-4 text-sm focus:outline-none focus:border-zinc-900 dark:focus:border-white transition-colors dark:text-white"
                  placeholder="Como devemos te chamar?"
                />
              </div>
              
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 mb-2">E-mail</label>
                <input 
                  type="email" 
                  className="w-full bg-transparent border border-zinc-200 dark:border-zinc-800 p-4 text-sm focus:outline-none focus:border-zinc-900 dark:focus:border-white transition-colors dark:text-white"
                  placeholder="seu.email@exemplo.com"
                />
              </div>
              
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 mb-2">Assunto</label>
                <select className="w-full bg-transparent border border-zinc-200 dark:border-zinc-800 p-4 text-sm focus:outline-none focus:border-zinc-900 dark:focus:border-white transition-colors dark:text-white appearance-none">
                  <option value="" className="text-zinc-900 dark:text-zinc-900">Selecione um assunto</option>
                  <option value="duvida" className="text-zinc-900 dark:text-zinc-900">Dúvida sobre produto</option>
                  <option value="pedido" className="text-zinc-900 dark:text-zinc-900">Status do Pedido</option>
                  <option value="troca" className="text-zinc-900 dark:text-zinc-900">Troca ou Devolução</option>
                  <option value="outro" className="text-zinc-900 dark:text-zinc-900">Outros assuntos</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 mb-2">Mensagem</label>
                <textarea 
                  rows={5}
                  className="w-full bg-transparent border border-zinc-200 dark:border-zinc-800 p-4 text-sm focus:outline-none focus:border-zinc-900 dark:focus:border-white transition-colors dark:text-white resize-none"
                  placeholder="Como podemos te ajudar hoje?"
                ></textarea>
              </div>

              <button 
                type="button"
                onClick={() => {
                  const text = 'Olá! Gostaria de falar com o atendimento.';
                  window.open(`https://wa.me/${settings.whatsappNumber?.replace(/\D/g, '') || '5511999999999'}?text=${encodeURIComponent(text)}`, '_blank');
                }}
                className="w-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-bold uppercase tracking-wider text-sm py-4 hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
              >
                Enviar Mensagem via WhatsApp
              </button>
            </form>
          </div>

        </div>
      </div>
    </main>
  );
}
