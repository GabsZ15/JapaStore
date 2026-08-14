const fs = require('fs');
let code = fs.readFileSync('src/components/Footer.tsx', 'utf8');

code = code.replace(
  '<li><Link to="/contato" className="hover:text-white transition-colors">Atendimento via WhatsApp</Link></li>',
  `<li><a href={\`https://wa.me/\${settings.whatsappNumber?.replace(/\\D/g, '') || '5511999999999'}\`} target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Atendimento via WhatsApp</a></li>`
);

code = code.replace(
  '<li><Link to="/contato" className="hover:text-white transition-colors">{settings.siteContent.contact.email}</Link></li>',
  `<li><a href={\`mailto:\${settings.siteContent.contact.email}\`} className="hover:text-white transition-colors">{settings.siteContent.contact.email}</a></li>`
);

fs.writeFileSync('src/components/Footer.tsx', code);
