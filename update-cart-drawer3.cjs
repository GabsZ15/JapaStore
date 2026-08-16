const fs = require('fs');
let code = fs.readFileSync('src/components/CartDrawer.tsx', 'utf8');

// Imports
code = code.replace(
  `import { X, ShoppingBag, Plus, Minus, Trash2, MessageCircle, ArrowLeft, CheckCircle2 } from 'lucide-react';`,
  `import { X, ShoppingBag, Plus, Minus, Trash2, MessageCircle, ArrowLeft, CheckCircle2, Truck, Loader2 } from 'lucide-react';`
);

// State
code = code.replace(
  `const [formErrors, setFormErrors] = useState<Record<string, string>>({});`,
  `const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isFromSaoCarlos, setIsFromSaoCarlos] = useState(false);
  const [shippingOptions, setShippingOptions] = useState<any[]>([]);
  const [selectedShipping, setSelectedShipping] = useState<any | null>(null);
  const [shippingLoading, setShippingLoading] = useState(false);
  const [shippingError, setShippingError] = useState('');`
);

// handleCheckout modifications
code = code.replace(
  `message += \`Cidade: \${formData.city}\\n\\n\`;
    
    message += \`\${texts.whatsappMessageTotal} \${formatCurrency(cartTotal)}*\`;`,
  `message += \`Cidade: \${formData.city}\\n\`;
    
    if (isFromSaoCarlos) {
      message += \`\\nCliente é de São Carlos.\\n\`;
    } else {
      message += \`\\nCliente não é de São Carlos.\\n\`;
      if (selectedShipping) {
        message += \`Opção de Frete: \${selectedShipping.name}\\n\`;
        message += \`Frete: \${formatCurrency(selectedShipping.price)}\\n\`;
      }
    }
    
    const finalTotal = cartTotal + (isFromSaoCarlos ? 0 : (selectedShipping?.price || 0));
    message += \`\\n\${texts.whatsappMessageTotal} \${formatCurrency(finalTotal)}*\`;`
);

// goToReview logic
const newGoToReview = `const goToReview = async () => {
    if (validateForm()) {
      if (user) {
        await supabase.auth.updateUser({ data: { address: formData, isFromSaoCarlos } });
      } else {
        localStorage.setItem('deliveryAddress', JSON.stringify({ ...formData, isFromSaoCarlos }));
      }
      
      setCheckoutStep('review');
      
      if (!isFromSaoCarlos) {
        setShippingLoading(true);
        setShippingError('');
        setShippingOptions([]);
        setSelectedShipping(null);
        
        let totalWeight = 0;
        let maxHeight = 10, maxWidth = 10, maxLength = 10;
        cartItems.forEach(item => {
          totalWeight += (item.weight || 0.3) * item.quantity;
          maxHeight = Math.max(maxHeight, item.height || 10);
          maxWidth = Math.max(maxWidth, item.width || 10);
          maxLength = Math.max(maxLength, item.length || 10);
        });
        
        try {
          const response = await fetch('/api/shipping/calculate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              destinationCep: formData.cep,
              weight: totalWeight,
              height: maxHeight,
              width: maxWidth,
              length: maxLength
            }),
          });
          const data = await response.json();
          if (!response.ok) throw new Error(data.message || data.error || 'Erro ao calcular o frete.');
          
          let results = [];
          if (Array.isArray(data)) results = data;
          else if (typeof data === 'object') results = Object.values(data);
          
          if (results.length === 0) {
             setShippingError('Nenhum serviço de frete disponível para este CEP.');
          } else {
             setShippingOptions(results);
             setSelectedShipping(results[0]);
          }
        } catch(err: any) {
          setShippingError(err.message);
        } finally {
          setShippingLoading(false);
        }
      }
    }
  };`;

code = code.replace(
  `const goToReview = async () => {
    if (validateForm()) {
      if (user) {
        await supabase.auth.updateUser({ data: { address: formData } });
      } else {
        localStorage.setItem('deliveryAddress', JSON.stringify(formData));
      }
      setCheckoutStep('review');
    }
  };`,
  newGoToReview
);

// Form UI (add checkbox)
const checkboxUI = `
              <div className="flex items-center gap-2 mt-2 p-3 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-sm">
                <input 
                  type="checkbox" 
                  id="isFromSaoCarlos"
                  checked={isFromSaoCarlos}
                  onChange={(e) => setIsFromSaoCarlos(e.target.checked)}
                  className="w-4 h-4 text-zinc-900 border-zinc-300 rounded focus:ring-zinc-900"
                />
                <label htmlFor="isFromSaoCarlos" className="text-sm font-bold uppercase tracking-wider text-zinc-900 dark:text-white cursor-pointer select-none">
                  Sou de São Carlos
                </label>
              </div>
`;

code = code.replace(
  `{formErrors.city && <p className="text-red-500 text-xs mt-1">{formErrors.city}</p>}
              </div>
            </div>`,
  `{formErrors.city && <p className="text-red-500 text-xs mt-1">{formErrors.city}</p>}
              </div>
              ${checkboxUI}
            </div>`
);

// Review UI (add Shipping Options and update Total)
const shippingReviewUI = `
              {!isFromSaoCarlos && (
                <div className="bg-zinc-50 dark:bg-zinc-900 p-4 border border-zinc-200 dark:border-zinc-800 rounded-sm">
                  <div className="flex items-center gap-2 mb-3">
                    <Truck className="h-4 w-4 text-zinc-500" />
                    <h4 className="font-bold uppercase tracking-wider text-xs text-zinc-500 dark:text-zinc-400">Opções de Frete</h4>
                  </div>
                  {shippingLoading ? (
                    <div className="flex items-center justify-center py-4">
                      <Loader2 className="w-5 h-5 animate-spin text-zinc-400" />
                    </div>
                  ) : shippingError ? (
                    <p className="text-red-500 text-sm">{shippingError}</p>
                  ) : (
                    <div className="space-y-2">
                      {shippingOptions.map(opt => (
                        <label key={opt.id} className="flex items-center gap-3 p-3 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-sm cursor-pointer hover:border-zinc-400 dark:hover:border-zinc-600 transition-colors">
                          <input 
                            type="radio" 
                            name="shipping"
                            checked={selectedShipping?.id === opt.id}
                            onChange={() => setSelectedShipping(opt)}
                            className="text-zinc-900 focus:ring-zinc-900"
                          />
                          <div className="flex-1">
                            <p className="font-bold text-sm text-zinc-900 dark:text-white">{opt.name}</p>
                            <p className="text-xs text-zinc-500">{opt.delivery_range?.min} a {opt.delivery_range?.max} dias úteis</p>
                          </div>
                          <div className="font-bold text-sm text-zinc-900 dark:text-white">
                            {formatCurrency(opt.price)}
                          </div>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              )}
`;

code = code.replace(
  `<div className="pt-2 mt-2 border-t border-zinc-200 dark:border-zinc-800 flex justify-between font-bold text-zinc-900 dark:text-white">
                    <span>Total</span>
                    <span>{formatCurrency(cartTotal)}</span>
                  </div>
                </div>
              </div>`,
  `<div className="pt-2 mt-2 border-t border-zinc-200 dark:border-zinc-800 flex justify-between font-bold text-zinc-900 dark:text-white">
                    <span>Total</span>
                    <span>{formatCurrency(cartTotal + (!isFromSaoCarlos && selectedShipping ? selectedShipping.price : 0))}</span>
                  </div>
                </div>
              </div>
              ${shippingReviewUI}`
);

// Review Delivery Info (show if from Sao Carlos)
code = code.replace(
  `<p><span className="font-medium text-zinc-500 dark:text-zinc-400">Cidade:</span> {formData.city} - {formData.cep}</p>`,
  `<p><span className="font-medium text-zinc-500 dark:text-zinc-400">Cidade:</span> {formData.city} - {formData.cep}</p>
                  {isFromSaoCarlos && <p className="text-green-600 dark:text-green-400 font-bold mt-2">✓ Cliente é de São Carlos</p>}`
);

fs.writeFileSync('src/components/CartDrawer.tsx', code);
