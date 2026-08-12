import re

with open('src/types.ts', 'r') as f:
    content = f.read()

content = content.replace('"/images/moletons.jpg"', '"/images/Moletom.jpeg"')
content = content.replace('"/images/camisetas.jpg"', '"/images/Camiseta.jpeg"')
content = content.replace('"/images/bermudas.jpg"', '"/images/Bermuda.jpeg"')

with open('src/types.ts', 'w') as f:
    f.write(content)
