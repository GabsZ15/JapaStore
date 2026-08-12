import re

with open('src/components/ProductCard.tsx', 'r') as f:
    content = f.read()

content = re.sub(r'>\s*Esgotado\s*<', '>{texts.outOfStockBadge}<', content)
content = re.sub(r'>\s*À vista\s*<', '>{texts.cashPrefix}<', content)
content = content.replace("const texts = settings.siteContent.productCard;", "const texts = settings?.siteContent?.productCard;")

with open('src/components/ProductCard.tsx', 'w') as f:
    f.write(content)
