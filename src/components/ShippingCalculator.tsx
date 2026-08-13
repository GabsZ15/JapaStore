import React, { useState } from 'react';
import { Truck, Loader2, AlertCircle } from 'lucide-react';
import { Product } from '../types';

interface ShippingOption {
  id: string;
  name: string;
  price: number;
  delivery_range: {
    min: number;
    max: number;
  };
}

export function ShippingCalculator({ product }: { product: Product }) {
  const [cep, setCep] = useState('');
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState<ShippingOption[]>([]);
  const [error, setError] = useState('');

  const handleCalculate = async () => {
    setError('');
    setOptions([]);
    const cleanCep = cep.replace(/\D/g, '');
    if (cleanCep.length !== 8) {
      setError('Por favor, insira um CEP válido.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/shipping/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          destinationCep: cleanCep,
          weight: product.weight || 0.5,
          height: product.height || 10,
          width: product.width || 10,
          length: product.length || 10,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || 'Erro ao calcular o frete.');
      }

      // Format SuperFrete response
      // Superfrete returns an array or object. Let's assume it returns an array of options
      // Or object with keys
      
      let results: ShippingOption[] = [];
      if (Array.isArray(data)) {
        results = data;
      } else if (typeof data === 'object') {
        results = Object.values(data);
      }

      if (results.length === 0) {
        setError('Nenhum serviço de frete disponível para este CEP.');
      } else {
        setOptions(results);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 8) value = value.slice(0, 8);
    if (value.length > 5) {
      value = value.slice(0, 5) + '-' + value.slice(5);
    }
    setCep(value);
  };

  return (
    <div className="border-t border-zinc-200 dark:border-zinc-800 pt-8 mt-8">
      <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-900 dark:text-white mb-4 flex items-center">
        <Truck className="w-5 h-5 mr-2" />
        Calcule o frete
      </h3>
      
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={cep}
          onChange={handleCepChange}
          placeholder="Digite seu CEP"
          className="flex-1 px-4 py-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-none focus:outline-none focus:border-zinc-900 dark:focus:border-white transition-colors"
        />
        <button
          onClick={handleCalculate}
          disabled={loading}
          className="px-6 py-3 bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 font-bold uppercase tracking-wider text-sm hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors flex items-center justify-center min-w-[120px]"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Calcular'}
        </button>
      </div>

      {error && (
        <div className="flex items-start text-red-500 text-sm mt-4 p-3 bg-red-50 dark:bg-red-500/10">
          <AlertCircle className="w-5 h-5 mr-2 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {options.length > 0 && (
        <div className="mt-6 space-y-3">
          {options.map((opt) => (
            <div key={opt.id} className="flex justify-between items-center p-4 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800">
              <div>
                <p className="font-bold text-zinc-900 dark:text-white">{opt.name}</p>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  Entrega estimada: {opt.delivery_range?.min} a {opt.delivery_range?.max} dias úteis
                </p>
              </div>
              <div className="font-bold text-zinc-900 dark:text-white">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(opt.price)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
