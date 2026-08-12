import re

with open('src/pages/SobrePage.tsx', 'r') as f:
    content = f.read()

content = content.replace("export function SobrePage() {", "import { useSettings } from '../contexts/SettingsContext';\n\nexport function SobrePage() {\n  const { settings } = useSettings();\n  const content = settings.siteContent.about;")

content = content.replace('src="https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&q=80"', 'src={content.imageUrl}')

content = re.sub(r'<h1 className="([^"]*)">.*?</h1>', r'<h1 className="\1">{content.title}</h1>', content, flags=re.DOTALL)

paragraphs_code = """<div className="space-y-6 text-zinc-600 dark:text-zinc-400 font-medium leading-relaxed transition-colors duration-300">
              {content.paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
              <p className="text-zinc-900 dark:text-zinc-100 font-bold uppercase tracking-widest text-sm pt-4 border-t border-zinc-200 dark:border-zinc-800 mt-8">
                {content.slogan}
              </p>
            </div>"""

content = re.sub(r'<div className="space-y-6.*?</div>', paragraphs_code, content, flags=re.DOTALL)

with open('src/pages/SobrePage.tsx', 'w') as f:
    f.write(content)
