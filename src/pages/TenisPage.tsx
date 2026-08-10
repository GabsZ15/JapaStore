import { ProductGrid } from '../components/ProductGrid';

export function TenisPage() {
  return (
    <main className="min-h-screen flex flex-col">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8 text-center">
        <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase mb-6 text-zinc-900 dark:text-white transition-colors duration-300">Tênis</h1>
        <p className="text-lg text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto transition-colors duration-300">
          Os melhores sneakers para complementar o seu visual streetwear. Modelos exclusivos e confortáveis.
        </p>
      </div>
      <ProductGrid title="Sneakers Exclusivos" category="Tenis" linkText="Ir para sale" linkTo="/sale" layout="grid" />
    </main>
  );
}
