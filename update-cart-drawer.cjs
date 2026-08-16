const fs = require('fs');
let code = fs.readFileSync('src/components/CartDrawer.tsx', 'utf8');

code = code.replace(
  `message += \`\${item.quantity}x \${item.name} \${item.selectedSize ? \`(Tam: \${item.selectedSize})\` : ''} - \${formatCurrency(price)}\\n\`;`,
  `message += \`\${item.quantity}x \${item.name} \${item.selectedColor ? \`[\${item.selectedColor}]\` : ''} \${item.selectedSize ? \`(Tam: \${item.selectedSize})\` : ''} - \${formatCurrency(price)}\\n\`;`
);

code = code.replace(
  `key={\`\${item.id}-\${item.selectedSize || ''}\`}`,
  `key={\`\${item.id}-\${item.selectedSize || ''}-\${item.selectedColor || ''}\`}`
);

code = code.replace(
  `{item.name} {item.selectedSize ? \`(Tam: \${item.selectedSize})\` : ''}`,
  `{item.name} {item.selectedColor ? \`[\${item.selectedColor}]\` : ''} {item.selectedSize ? \`(Tam: \${item.selectedSize})\` : ''}`
);

code = code.replace(
  `onClick={() => removeFromCart(item.id, item.selectedSize)}`,
  `onClick={() => removeFromCart(item.id, item.selectedSize, item.selectedColor)}`
);

code = code.replace(
  `onClick={() => updateQuantity(item.id, item.selectedSize, item.quantity - 1)}`,
  `onClick={() => updateQuantity(item.id, item.selectedSize, item.selectedColor, item.quantity - 1)}`
);

code = code.replace(
  `onClick={() => updateQuantity(item.id, item.selectedSize, item.quantity + 1)}`,
  `onClick={() => updateQuantity(item.id, item.selectedSize, item.selectedColor, item.quantity + 1)}`
);

code = code.replace(
  `key={\`\${item.id}-\${item.selectedSize || ''}\`}`,
  `key={\`\${item.id}-\${item.selectedSize || ''}-\${item.selectedColor || ''}\`}`
);

code = code.replace(
  `<span className="text-zinc-900 dark:text-white">{item.quantity}x {item.name} {item.selectedSize ? \`(\${item.selectedSize})\` : ''}</span>`,
  `<span className="text-zinc-900 dark:text-white">{item.quantity}x {item.name} {item.selectedColor ? \`[\${item.selectedColor}]\` : ''} {item.selectedSize ? \`(\${item.selectedSize})\` : ''}</span>`
);

fs.writeFileSync('src/components/CartDrawer.tsx', code);
