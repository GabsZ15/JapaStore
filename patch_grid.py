import re

with open('src/components/ProductGrid.tsx', 'r') as f:
    content = f.read()

content = content.replace("linkText?: string;", "linkText?: string;\n  onLinkTextChange?: (newText: string) => void;")
content = content.replace("linkTo = \"/lancamentos\",", "linkTo = \"/lancamentos\",\n  onLinkTextChange,")

link_jsx_old = """<Link to={linkTo} className="text-sm font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 underline underline-offset-4 hover:text-zinc-500 dark:hover:text-zinc-400 transition-colors">
          {linkText}
        </Link>"""

link_jsx_new = """{onLinkTextChange ? (
          <EditableText 
            as="span"
            value={linkText}
            onSave={onLinkTextChange}
            className="text-sm font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 underline underline-offset-4 hover:text-zinc-500 dark:hover:text-zinc-400 transition-colors cursor-pointer"
          />
        ) : (
          <Link to={linkTo} className="text-sm font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 underline underline-offset-4 hover:text-zinc-500 dark:hover:text-zinc-400 transition-colors">
            {linkText}
          </Link>
        )}"""

content = content.replace(link_jsx_old, link_jsx_new)

with open('src/components/ProductGrid.tsx', 'w') as f:
    f.write(content)
