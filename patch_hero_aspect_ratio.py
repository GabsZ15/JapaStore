import re

with open('src/components/Hero.tsx', 'r') as f:
    content = f.read()

old_section = '<section className="relative h-[70vh] w-full overflow-hidden bg-zinc-900">'
new_section = """<section className="relative w-full overflow-hidden bg-zinc-900">
      {/* Placeholder invisível para ditar a altura do container mantendo o aspect ratio original da imagem */}
      <img src={images[0]} alt="" aria-hidden="true" className="w-full h-auto invisible block pointer-events-none" />"""

content = content.replace(old_section, new_section)

with open('src/components/Hero.tsx', 'w') as f:
    f.write(content)
