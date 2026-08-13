import re

with open('src/components/HomeCategories.tsx', 'r') as f:
    content = f.read()

target = "const categories = settings?.siteContent?.homeCategories?.items || [];"

replacement = """const categoriesRaw = settings?.siteContent?.homeCategories?.items || [];
  const order = ['camisetas', 'bermudas', 'moletons'];
  const categories = [...categoriesRaw].sort((a, b) => {
    const idxA = order.indexOf(a.id);
    const idxB = order.indexOf(b.id);
    if (idxA === -1 && idxB === -1) return 0;
    if (idxA === -1) return 1;
    if (idxB === -1) return -1;
    return idxA - idxB;
  });"""

content = content.replace(target, replacement)

with open('src/components/HomeCategories.tsx', 'w') as f:
    f.write(content)
