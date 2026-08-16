const fs = require('fs');
let code = fs.readFileSync('src/components/CartDrawer.tsx', 'utf8');

const mappingCode = `cartItems.map((item) => {
                  let maxStock = 999;
                  if (item.variants && item.variants.length > 0 && item.selectedColor && item.selectedSize) {
                    const activeVariant = item.variants.find(v => v.color === item.selectedColor);
                    if (activeVariant) {
                      const sizeObj = activeVariant.sizes.find(s => s.name === item.selectedSize);
                      if (sizeObj) maxStock = sizeObj.stock;
                    }
                  }
                  
                  return (`;

code = code.replace(
  `{cartItems.map((item) => (`,
  `{${mappingCode}`
);

code = code.replace(
  `<div key={\`\${item.id}-\${item.selectedSize || ''}-\${item.selectedColor || ''}\`} className="flex gap-4">`,
  `<div key={\`\${item.id}-\${item.selectedSize || ''}-\${item.selectedColor || ''}\`} className="flex gap-4">`
);

code = code.replace(
  `onClick={() => updateQuantity(item.id, item.selectedSize, item.selectedColor, item.quantity + 1)}
                          className="px-2 py-1 text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors"`,
  `onClick={() => updateQuantity(item.id, item.selectedSize, item.selectedColor, item.quantity + 1)}
                          disabled={item.quantity >= maxStock}
                          className="px-2 py-1 text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"`
);

// We need to close the `return (` that we opened.
code = code.replace(
  `</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>`,
  `</div>
                    </div>
                  </div>
                </div>
              );
              })}
            </div>`
);

fs.writeFileSync('src/components/CartDrawer.tsx', code);
