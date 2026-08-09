import { useSearchParams } from 'react-router-dom';
import { Search } from 'lucide-react';

export function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  return (
    <main className="min-h-screen py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center text-center mb-16">
        <div className="bg-zinc-100 dark:bg-zinc-900 p-4 rounded-full mb-6">
          <Search className="h-8 w-8 text-zinc-900 dark:text-white" />
        </div>
        <h1 className="text-3xl md:text-4xl font-black tracking-tighter uppercase mb-4 text-zinc-900 dark:text-white transition-colors duration-300">
          Resultados da busca
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 font-medium text-lg">
          {query ? (
            <>Mostrando resultados para: <span className="font-bold text-zinc-900 dark:text-white">"{query}"</span></>
          ) : (
            'Digite algo para buscar em nossa loja.'
          )}
        </p>
      </div>

      {query && (
        <div className="text-center text-zinc-500 dark:text-zinc-400 py-12">
          Nenhum produto encontrado para sua busca no momento.
        </div>
      )}
    </main>
  );
}
