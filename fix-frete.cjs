const fs = require('fs');
let code = fs.readFileSync('src/components/CartDrawer.tsx', 'utf8');

// 1. Remove if (!isFromSaoCarlos) around shipping calculation
code = code.replace(
  `      setCheckoutStep('review');
      
      if (!isFromSaoCarlos) {
        setShippingLoading(true);`,
  `      setCheckoutStep('review');
      
      setShippingLoading(true);`
);

code = code.replace(
  `          if (results.length === 0) {
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
  };`,
  `          if (results.length === 0) {
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
  };`
);

// 2. Remove if (!isFromSaoCarlos) wrapping the Shipping options UI
code = code.replace(
  `              {!isFromSaoCarlos && (
                <div className="bg-zinc-50 dark:bg-zinc-900 p-4 border border-zinc-200 dark:border-zinc-800 rounded-sm">
                  <div className="flex items-center gap-2 mb-3">`,
  `              <div className="bg-zinc-50 dark:bg-zinc-900 p-4 border border-zinc-200 dark:border-zinc-800 rounded-sm">
                  <div className="flex items-center gap-2 mb-3">`
);

code = code.replace(
  `                    </div>
                  )}
                </div>
              )}`,
  `                    </div>
                  )}
                </div>`
);

// 3. Fix WhatsApp message and total computation
code = code.replace(
  `    if (isFromSaoCarlos) {
      message += \`\\nCliente é de São Carlos.\\n\`;
    } else {
      message += \`\\nCliente não é de São Carlos.\\n\`;
      if (selectedShipping) {
        message += \`Opção de Frete: \${selectedShipping.name}\\n\`;
        message += \`Frete: \${formatCurrency(selectedShipping.price)}\\n\`;
      }
    }
    
    const finalTotal = cartTotal + (isFromSaoCarlos ? 0 : (selectedShipping?.price || 0));`,
  `    if (isFromSaoCarlos) {
      message += \`\\nCliente é de São Carlos.\\n\`;
    } else {
      message += \`\\nCliente não é de São Carlos.\\n\`;
    }
    
    if (selectedShipping) {
      message += \`Opção de Frete: \${selectedShipping.name}\\n\`;
      message += \`Frete: \${formatCurrency(selectedShipping.price)}\\n\`;
    }
    
    const finalTotal = cartTotal + (selectedShipping?.price || 0);`
);

// 4. Update the final total shown in the UI
code = code.replace(
  `<span>{formatCurrency(cartTotal + (!isFromSaoCarlos && selectedShipping ? selectedShipping.price : 0))}</span>`,
  `<span>{formatCurrency(cartTotal + (selectedShipping ? selectedShipping.price : 0))}</span>`
);

fs.writeFileSync('src/components/CartDrawer.tsx', code);
