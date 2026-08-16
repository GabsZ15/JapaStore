const fs = require('fs');
let code = fs.readFileSync('src/pages/AdminPage.tsx', 'utf8');

// Add colors state
code = code.replace(
  `  const [sizes, setSizes] = useState<string>('');`,
  `  const [sizes, setSizes] = useState<string>('');
  const [colors, setColors] = useState<string>('');`
);

// Add colors to finalDescription
code = code.replace(
  `const parsedSizes = sizes.split(',').map(s => s.trim()).filter(s => s !== '');`,
  `const parsedSizes = sizes.split(',').map(s => s.trim()).filter(s => s !== '');
    const parsedColors = colors.split(',').map(c => c.trim()).filter(c => c !== '');`
);

code = code.replace(
  `const finalDescription = stringifyProductDescription(
      description, parsedSizes, parsedExtraImages, 
      weight`,
  `const finalDescription = stringifyProductDescription(
      description, parsedSizes, parsedColors, parsedExtraImages, 
      weight`
);

// Add to handleEdit
code = code.replace(
  `setSizes((product.sizes || []).join(', '));`,
  `setSizes((product.sizes || []).join(', '));
    setColors((product.colors || []).join(', '));`
);

// Add to resetForm
code = code.replace(
  `setSizes('');`,
  `setSizes('');
      setColors('');`
);

// Add UI input for colors
code = code.replace(
  `              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 mb-2">Tamanhos Disponíveis (separados por vírgula)</label>`,
  `              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 mb-2">Cores do Produto (separadas por vírgula)</label>
                  <input 
                    type="text" 
                    value={colors}
                    onChange={e => setColors(e.target.value)}
                    className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-3 text-sm focus:outline-none focus:border-zinc-900 dark:focus:border-white transition-colors dark:text-white rounded-md mb-4"
                    placeholder="Ex: Branco, Preto, Azul"
                  />
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 mb-2">Tamanhos Disponíveis (separados por vírgula)</label>`
);

fs.writeFileSync('src/pages/AdminPage.tsx', code);
