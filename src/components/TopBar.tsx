import { useSettings } from '../contexts/SettingsContext';
import { EditableText } from './EditableText';

export function TopBar() {
  const { settings, updateSettings } = useSettings();
  return (
    <div className="bg-zinc-900 dark:bg-black text-white text-xs text-center py-2.5 font-medium tracking-wide border-b border-zinc-800 dark:border-zinc-900 transition-colors duration-300">
      <EditableText 
        value={settings.topBarText}
        onSave={(newValue) => updateSettings({ ...settings, topBarText: newValue })}
        className="inline-block"
      />
    </div>
  );
}
