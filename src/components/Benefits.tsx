import { Truck, CreditCard, Lock } from 'lucide-react';

export function Benefits() {
  return (
    <section className="bg-zinc-50 dark:bg-zinc-900/30 border-t border-zinc-100 dark:border-zinc-800/50 py-16 mt-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 divide-y md:divide-y-0 md:divide-x divide-zinc-200 dark:divide-zinc-800/50">
          
          <div className="flex flex-col items-center text-center pt-8 md:pt-0">
            <Lock className="h-8 w-8 text-zinc-900 dark:text-zinc-100 mb-4 transition-colors duration-300" strokeWidth={1.5} />
            <h3 className="font-bold text-sm uppercase tracking-wide mb-2 text-zinc-900 dark:text-zinc-100 transition-colors duration-300">Compra 100% Segura</h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-[250px] transition-colors duration-300">
              Seus dados estão protegidos. Utilizamos criptografia de ponta a ponta.
            </p>
          </div>

          <div className="flex flex-col items-center text-center pt-8 md:pt-0">
            <Truck className="h-8 w-8 text-zinc-900 dark:text-zinc-100 mb-4 transition-colors duration-300" strokeWidth={1.5} />
            <h3 className="font-bold text-sm uppercase tracking-wide mb-2 text-zinc-900 dark:text-zinc-100 transition-colors duration-300">Frete Grátis</h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-[250px] transition-colors duration-300">
              Entregamos sem custo adicional em compras acima de R$ 299 para todo o Brasil.
            </p>
          </div>

          <div className="flex flex-col items-center text-center pt-8 md:pt-0">
            <CreditCard className="h-8 w-8 text-zinc-900 dark:text-zinc-100 mb-4 transition-colors duration-300" strokeWidth={1.5} />
            <h3 className="font-bold text-sm uppercase tracking-wide mb-2 text-zinc-900 dark:text-zinc-100 transition-colors duration-300">Parcele em até 12x</h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-[250px] transition-colors duration-300">
              Condições especiais de pagamento no cartão de crédito ou 5% OFF no PIX.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}
