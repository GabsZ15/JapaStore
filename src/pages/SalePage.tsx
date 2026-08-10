import { ProductGrid } from '../components/ProductGrid';

export function SalePage() {
  return (
    <main className="min-h-screen flex flex-col">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8 text-center">
        <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase mb-6 text-red-600 dark:text-red-500 transition-colors duration-300">Sale</h1>
        <p className="text-lg text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto transition-colors duration-300">
          Aproveite nossos descontos imperdíveis. Peças selecionadas com descontos.
        </p>
      </div>
      <ProductGrid title="Ofertas Ativas" category="Sale" linkText="Ver novidades" linkTo="/lancamentos" layout="grid" />
    </main>
  );
}
