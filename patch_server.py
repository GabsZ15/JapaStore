import re
with open('server.ts', 'r') as f:
    content = f.read()

content = content.replace("import { fileURLToPath } from 'url';", "")
content = content.replace("const __dirname = path.dirname(fileURLToPath(import.meta.url));", "")

with open('server.ts', 'w') as f:
    f.write(content)
