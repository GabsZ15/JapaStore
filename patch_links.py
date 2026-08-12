import os
import glob

def replace_in_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()

    # Replacements for /lancamentos -> /camisetas
    content = content.replace('to="/lancamentos"', 'to="/camisetas"')
    content = content.replace("to='/lancamentos'", "to='/camisetas'")
    content = content.replace('linkTo="/lancamentos"', 'linkTo="/camisetas"')
    content = content.replace("linkTo='/lancamentos'", "linkTo='/camisetas'")

    # Replacements for /roupas -> /bermudas
    content = content.replace('to="/roupas"', 'to="/bermudas"')
    content = content.replace("to='/roupas'", "to='/bermudas'")
    content = content.replace('linkTo="/roupas"', 'linkTo="/bermudas"')
    content = content.replace("linkTo='/roupas'", "linkTo='/bermudas'")

    # Replacements for /tenis -> /moletons
    content = content.replace('to="/tenis"', 'to="/moletons"')
    content = content.replace("to='/tenis'", "to='/moletons'")
    content = content.replace('linkTo="/tenis"', 'linkTo="/moletons"')
    content = content.replace("linkTo='/tenis'", "linkTo='/moletons'")

    with open(filepath, 'w') as f:
        f.write(content)

for root, _, files in os.walk('src'):
    for file in files:
        if file.endswith('.tsx') or file.endswith('.ts'):
            replace_in_file(os.path.join(root, file))

