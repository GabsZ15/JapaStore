import re

with open('src/components/Header.tsx', 'r') as f:
    content = f.read()

content = content.replace("const { user, signOut } = useAuth();", "const { user, signOut } = useAuth();\n  const texts = settings.siteContent.header;")

with open('src/components/Header.tsx', 'w') as f:
    f.write(content)
