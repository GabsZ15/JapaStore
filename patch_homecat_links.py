import re

with open('src/components/HomeCategories.tsx', 'r') as f:
    content = f.read()

content = re.sub(
    r'to=\{category\.linkTo\}',
    r'to={category.id === "moletons" ? "/moletons" : category.id === "camisetas" ? "/camisetas" : category.id === "bermudas" ? "/bermudas" : category.linkTo}',
    content
)

with open('src/components/HomeCategories.tsx', 'w') as f:
    f.write(content)
