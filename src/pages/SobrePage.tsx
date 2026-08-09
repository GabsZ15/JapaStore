export function SobrePage() {
  return (
    <main className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24 items-center">
          
          <div className="relative aspect-[3/4] md:aspect-[4/5] bg-zinc-100 dark:bg-zinc-900 overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&q=80" 
              alt="JapaStore Lifestyle" 
              className="w-full h-full object-cover mix-blend-multiply dark:mix-blend-normal opacity-90 transition-opacity"
            />
          </div>

          <div className="flex flex-col justify-center">
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase mb-8 text-zinc-900 dark:text-white transition-colors duration-300">
              Sobre a <br/> JapaStore
            </h1>
            
            <div className="space-y-6 text-zinc-600 dark:text-zinc-400 font-medium leading-relaxed transition-colors duration-300">
              <p>
                Nascida da paixão pela cultura urbana e pelo design minimalista, a JapaStore não é apenas uma loja de roupas, é um movimento de expressão autêntica através da moda.
              </p>
              <p>
                Acreditamos que o streetwear deve ser acessível, confortável e, acima de tudo, carregar atitude. Nossas peças são cuidadosamente selecionadas e desenvolvidas para quem vive a dinâmica das ruas, mas não abre mão da elegância sutil.
              </p>
              <p>
                Trabalhamos com materiais premium e modelagens exclusivas que se adaptam ao seu corpo e ao seu estilo de vida. Nosso compromisso é entregar não apenas vestuário, mas confiança.
              </p>
              <p className="text-zinc-900 dark:text-zinc-100 font-bold uppercase tracking-widest text-sm pt-4 border-t border-zinc-200 dark:border-zinc-800 mt-8">
                Estilo que transforma.
              </p>
            </div>
          </div>
          
        </div>
      </div>
    </main>
  );
}
