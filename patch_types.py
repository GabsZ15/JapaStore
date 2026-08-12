import re

with open('src/types.ts', 'r') as f:
    content = f.read()

# Add sizes and extraImages to Product
if "sizes?: string[];" not in content:
    content = content.replace("outOfStock?: boolean;", "outOfStock?: boolean;\n  sizes?: string[];\n  extraImages?: string[];\n  selectedSize?: string;")

with open('src/types.ts', 'w') as f:
    f.write(content)
