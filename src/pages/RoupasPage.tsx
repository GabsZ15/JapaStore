import { ProductGrid } from '../components/ProductGrid';
import { useSettings } from '../contexts/SettingsContext';
import { EditableText } from '../components/EditableText';
// from '../contexts/SettingsContext';

export function RoupasPage() {
  const { settings, updateSettings } = useSettings();
  const content = settings.siteContent.pages.roupas;

  const handleUpdate = (field: string, value: string) => {
    updateSettings({
      ...settings,
      siteContent: {
        ...settings.siteContent,
        pages: {
          ...settings.siteContent.pages,
          roupas: {
            ...content,
            [field]: value
          }
        }
      }
    });
  };

  return (
    <main className="min-h-screen flex flex-col">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8 flex flex-col items-center justify-center text-center">
        <EditableText as="h1" value={content.title} onSave={(v) => handleUpdate('title', v)} className="text-4xl md:text-5xl font-black tracking-tighter uppercase mb-6 text-zinc-900 dark:text-white transition-colors duration-300" />
        <EditableText as="p" value={content.subtitle} onSave={(v) => handleUpdate('subtitle', v)} className="text-lg text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto transition-colors duration-300" />
      </div>
      <ProductGrid title={content.gridTitle} onTitleChange={(v) => handleUpdate('gridTitle', v)} category="Roupas" linkText={content.ctaText} onLinkTextChange={(v) => handleUpdate('ctaText', v)} linkTo="/camisetas" layout="grid" />
    </main>
  );
}
