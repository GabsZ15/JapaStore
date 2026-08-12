import re

with open('src/pages/AdminPage.tsx', 'r') as f:
    content = f.read()

content = content.replace('X, Settings,', 'X, ImagePlus, Settings,')

with open('src/pages/AdminPage.tsx', 'w') as f:
    f.write(content)
