import { ProductGrid } from '../components/ProductGrid';

export function LancamentosPage() {
  return (
    <main className="min-h-screen flex flex-col">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8 text-center">
        <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase mb-6 text-zinc-900 dark:text-white transition-colors duration-300">Lançamentos</h1>
        <p className="text-lg text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto transition-colors duration-300">
          Confira as novidades da Japastore. Novas coleções e peças exclusivas adicionadas recentemente.
        </p>
      </div>
      <ProductGrid title="Últimos Lançamentos" linkText="Voltar ao início" linkTo="/" layout="grid" />
    </main>
  );
}
