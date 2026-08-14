const fs = require('fs');
let code = fs.readFileSync('src/components/CartDrawer.tsx', 'utf8');

code = code.replace(
  'const whatsappUrl = \`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}\`;',
  'const whatsappUrl = \`https://wa.me/${phoneNumber.replace(/\\\\D/g, \'\')}?text=${encodeURIComponent(message)}\`;'
);

fs.writeFileSync('src/components/CartDrawer.tsx', code);
