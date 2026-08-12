import re

with open('src/pages/AdminPage.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Chunk 1
c1_target = """  // Drag and drop state
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);"""
c1_repl = """  // Drag and drop state
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Delete modal state
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteFeedback, setDeleteFeedback] = useState<{ type: 'success' | 'error', message: string } | null>(null);"""
content = content.replace(c1_target, c1_repl)

# Chunk 2: handleDelete
c2_target = """  const handleDelete = async (id: string) => {
    
    
    if (window.confirm("Tem certeza que deseja excluir este produto?")) { 
    
      try {
        const { error } = await supabase
          .from('products')
          .delete()
          .eq('id', id);

        if (error) throw error;
        
        await fetchProducts();
        
        if (editingId === id) {
          resetForm();
        }
        alert('Produto excluído com sucesso.');
      } catch (err: any) {
        console.warn('Error deleting product:', err);
        alert('Não foi possível excluir o produto. ' + (err.message || ''));
      }
    }
  };"""
c2_repl = """  const handleDelete = (id: string) => {
    setProductToDelete(id);
    setDeleteFeedback(null);
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;
    
    setIsDeleting(true);
    setDeleteFeedback(null);
    
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productToDelete);

      if (error) throw error;
      
      await fetchProducts();
      
      if (editingId === productToDelete) {
        resetForm();
      }
      
      setProductToDelete(null);
      setDeleteFeedback({ type: 'success', message: 'Produto excluído com sucesso.' });
      
      setTimeout(() => setDeleteFeedback(null), 3000);
    } catch (err: any) {
      console.warn('Error deleting product:', err);
      setDeleteFeedback({ type: 'error', message: 'Não foi possível excluir o produto. ' + (err.message || '') });
    } finally {
      setIsDeleting(false);
    }
  };"""
content = content.replace(c2_target, c2_repl)

# Chunk 3
c3_target = """      </main>
    </div>
  );
}"""
c3_repl = """      </main>

      {/* Delete Confirmation Modal */}
      {productToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-xl shadow-xl w-full max-w-sm">
            <div className="flex items-center gap-3 text-red-600 dark:text-red-500 mb-4">
              <AlertTriangle className="h-6 w-6" />
              <h3 className="text-lg font-bold">Excluir Produto</h3>
            </div>
            <p className="text-zinc-600 dark:text-zinc-400 mb-6 text-sm">
              Tem certeza que deseja excluir este produto? Esta ação não pode ser desfeita.
            </p>
            
            {deleteFeedback && deleteFeedback.type === 'error' && (
              <div className="mb-4 p-3 rounded-md bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm">
                {deleteFeedback.message}
              </div>
            )}
            
            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => {
                  setProductToDelete(null);
                  setDeleteFeedback(null);
                }}
                disabled={isDeleting}
                className="px-4 py-2 text-sm font-bold text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white disabled:opacity-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                disabled={isDeleting}
                className="px-4 py-2 text-sm font-bold text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-md flex items-center gap-2 transition-colors"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Excluindo...
                  </>
                ) : (
                  'Excluir'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Success Toast */}
      {deleteFeedback && deleteFeedback.type === 'success' && (
        <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 px-4 py-3 rounded-md shadow-lg animate-in slide-in-from-bottom-5">
          <CheckCircle2 className="h-5 w-5 text-green-500" />
          <span className="text-sm font-medium">{deleteFeedback.message}</span>
        </div>
      )}
    </div>
  );
}"""
content = content.replace(c3_target, c3_repl)

with open('src/pages/AdminPage.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
