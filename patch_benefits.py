import re

with open('src/components/admin/ContentEditor.tsx', 'r') as f:
    content = f.read()

benefits_code = """        {/* Benefits */}
        <SectionHeader id="benefits" title="Componente: Benefícios (Home)" />
        {expandedSection === 'benefits' && (
          <div className="p-6 space-y-4">
            {content.benefits.map((benefit, i) => (
              <div key={i} className="flex gap-4 mb-4 p-4 border border-zinc-200 dark:border-zinc-800 rounded-md">
                <div className="flex-1 space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 mb-2">Título do Benefício {i + 1}</label>
                    <input type="text" value={benefit.title} onChange={e => {
                      const newBenefits = [...content.benefits];
                      newBenefits[i].title = e.target.value;
                      setContent({ ...content, benefits: newBenefits });
                    }} className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-3 text-sm focus:outline-none transition-colors dark:text-white rounded-md" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 mb-2">Descrição</label>
                    <textarea value={benefit.desc} onChange={e => {
                      const newBenefits = [...content.benefits];
                      newBenefits[i].desc = e.target.value;
                      setContent({ ...content, benefits: newBenefits });
                    }} className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-3 text-sm focus:outline-none transition-colors dark:text-white rounded-md" rows={2} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}"""

content = content.replace("{/* Footer */}", benefits_code + "\n\n        {/* Footer */}")

with open('src/components/admin/ContentEditor.tsx', 'w') as f:
    f.write(content)
