import re

with open('src/components/HomeCategories.tsx', 'r') as f:
    content = f.read()

# Pattern to remove the overlay and the title
overlay_html = """            {/* Dark gradient overlay for better text readability and style */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-col items-center justify-end">
              <h3 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tighter drop-shadow-md transform group-hover:-translate-y-1 transition-transform duration-300">
                {category.title}
              </h3>
            </div>"""

content = content.replace(overlay_html, "")

with open('src/components/HomeCategories.tsx', 'w') as f:
    f.write(content)
