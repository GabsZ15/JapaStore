const fs = require('fs');
let code = fs.readFileSync('src/components/ProductGrid.tsx', 'utf8');

code = code.replace(
  `  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('Supabase not connected or error fetching products:', JSON.stringify(error));
        return;
      }

      if (data) {
        // Map Supabase columns to Product type
        const supabaseProducts: Product[] = data.map(mapSupabaseProduct);
        
        let filteredProducts = supabaseProducts;

        if (category) {
          filteredProducts = supabaseProducts.filter(p => {
            const prodCat = p.category?.toLowerCase().normalize('NFD').replace(/[\\u0300-\\u036f]/g, "");
            const targetCat = category.toLowerCase().normalize('NFD').replace(/[\\u0300-\\u036f]/g, "");
            return prodCat === targetCat;
          });
        }
        
        setProducts(filteredProducts);
      }
    } catch (err) {
      console.warn('Failed to fetch products (probably no Supabase backend)', err);
    }
  };`,
  `  const fetchProducts = async () => {
    try {
      let query = supabase.from('products').select('*');
      
      if (category) {
        // Optimizes fetching by filtering at the database level instead of downloading all products
        query = query.ilike('category', \`%\${category}%\`);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) {
        console.warn('Supabase not connected or error fetching products:', JSON.stringify(error));
        return;
      }

      if (data) {
        // Map Supabase columns to Product type
        let supabaseProducts: Product[] = data.map(mapSupabaseProduct);
        
        // Double check local filtering just in case there are accents in db not caught by ilike
        if (category) {
          supabaseProducts = supabaseProducts.filter(p => {
            const prodCat = p.category?.toLowerCase().normalize('NFD').replace(/[\\u0300-\\u036f]/g, "") || "";
            const targetCat = category.toLowerCase().normalize('NFD').replace(/[\\u0300-\\u036f]/g, "");
            return prodCat.includes(targetCat) || targetCat.includes(prodCat);
          });
        }
        
        setProducts(supabaseProducts);
      }
    } catch (err) {
      console.warn('Failed to fetch products (probably no Supabase backend)', err);
    }
  };`
);

fs.writeFileSync('src/components/ProductGrid.tsx', code);
