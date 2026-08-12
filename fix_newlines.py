import re

with open('src/types.ts', 'r') as f:
    content = f.read()

content = content.replace('whatsappMessagePrefix: "Olá! Gostaria de finalizar a seguinte compra:\n\n",', 'whatsappMessagePrefix: "Olá! Gostaria de finalizar a seguinte compra:\\n\\n",')
content = content.replace('whatsappMessageTotal: "\n*Total:"', 'whatsappMessageTotal: "\\n*Total:"')

with open('src/types.ts', 'w') as f:
    f.write(content)
