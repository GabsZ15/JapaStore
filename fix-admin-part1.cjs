const fs = require('fs');
let code = fs.readFileSync('src/pages/AdminPage.tsx', 'utf8');

code = code.replace(
  `      description, fallbackSizes, fallbackColors, parsedExtraImages, 
      weight ? parseFloat(weight.replace(',', '.')) : undefined,
      height ? parseFloat(height.replace(',', '.')) : undefined,
      width ? parseFloat(width.replace(',', '.')) : undefined,
      length ? parseFloat(length.replace(',', '.')) : undefined,
      finalVariants
    ); // ? parseFloat(weight.replace(',', '.')) : undefined,
      height ? parseFloat(height.replace(',', '.')) : undefined,
      width ? parseFloat(width.replace(',', '.')) : undefined,
      length ? parseFloat(length.replace(',', '.')) : undefined
    );`,
  `      description, fallbackSizes, fallbackColors, parsedExtraImages, 
      weight ? parseFloat(weight.replace(',', '.')) : undefined,
      height ? parseFloat(height.replace(',', '.')) : undefined,
      width ? parseFloat(width.replace(',', '.')) : undefined,
      length ? parseFloat(length.replace(',', '.')) : undefined,
      finalVariants
    );`
);
fs.writeFileSync('src/pages/AdminPage.tsx', code);
