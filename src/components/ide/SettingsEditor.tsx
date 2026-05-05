import { ProjectSettings } from './Launcher';
import { Settings, Palette } from 'lucide-react';

export const SettingsEditor = ({ projectSettings, setProjectSettings }: { projectSettings: ProjectSettings, setProjectSettings: (s: ProjectSettings) => void }) => {
  
  const handleColorChange = (colorTheme: 'amber' | 'blue' | 'emerald' | 'red' | 'purple') => {
    const themes = {
      amber: {
        500: '#f59e0b', 100: '#fef3c7', 200: '#fde68a', 300: '#fcd34d', 400: '#fbbf24', 600: '#d97706', 700: '#b45309', 800: '#92400e', 900: '#78350f'
      },
      blue: {
        500: '#3b82f6', 100: '#dbeafe', 200: '#bfdbfe', 300: '#93c5fd', 400: '#60a5fa', 600: '#2563eb', 700: '#1d4ed8', 800: '#1e40af', 900: '#1e3a8a'
      },
      emerald: {
        500: '#10b981', 100: '#d1fae5', 200: '#a7f3d0', 300: '#6ee7b7', 400: '#34d399', 600: '#059669', 700: '#047857', 800: '#065f46', 900: '#064e3b'
      },
      red: {
        500: '#ef4444', 100: '#fee2e2', 200: '#fecaca', 300: '#fca5a5', 400: '#f87171', 600: '#dc2626', 700: '#b91c1c', 800: '#991b1b', 900: '#7f1d1d'
      },
      purple: {
        500: '#8b5cf6', 100: '#ede9fe', 200: '#ddd6fe', 300: '#c4b5fd', 400: '#a78bfa', 600: '#7c3aed', 700: '#6d28d9', 800: '#5b21b6', 900: '#4c1d95'
      }
    };
    
    const theme = themes[colorTheme];
    const root = document.documentElement;
    root.style.setProperty('--theme-color-100', theme[100]);
    root.style.setProperty('--theme-color-200', theme[200]);
    root.style.setProperty('--theme-color-300', theme[300]);
    root.style.setProperty('--theme-color-400', theme[400]);
    root.style.setProperty('--theme-color-500', theme[500]);
    root.style.setProperty('--theme-color-600', theme[600]);
    root.style.setProperty('--theme-color-700', theme[700]);
    root.style.setProperty('--theme-color-800', theme[800]);
    root.style.setProperty('--theme-color-900', theme[900]);
  };

  return (
    <div className="flex-1 bg-[radial-gradient(circle_at_top_right,_#1a1510_0%,_#0A0A0C_60%)] flex flex-col relative overflow-hidden">
      <div className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto space-y-6">
          <header className="mb-8">
            <h1 className="text-4xl font-extrabold tracking-tighter text-white mb-2 flex items-center gap-3 italic">
              <Settings className="text-amber-500 w-8 h-8" />
              Configurações
            </h1>
            <p className="text-white/40 text-lg font-light">Preferências da IDE e do Workspace.</p>
          </header>

          <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
            <h3 className="text-white font-bold mb-4 border-b border-white/5 pb-2 flex items-center gap-2">
              <Palette size={16}/> Personalização de Cores
            </h3>
            
            <div className="space-y-4">
              <p className="text-sm text-white/60">Escolha a cor principal da aplicação (Accent Color):</p>
              
              <div className="flex gap-4">
                <button onClick={() => handleColorChange('amber')} className="w-10 h-10 rounded-full bg-[#f59e0b] hover:ring-2 hover:ring-white border border-black transition-all" title="Amber (Padrão)"></button>
                <button onClick={() => handleColorChange('blue')} className="w-10 h-10 rounded-full bg-[#3b82f6] hover:ring-2 hover:ring-white border border-black transition-all" title="Blue"></button>
                <button onClick={() => handleColorChange('emerald')} className="w-10 h-10 rounded-full bg-[#10b981] hover:ring-2 hover:ring-white border border-black transition-all" title="Emerald"></button>
                <button onClick={() => handleColorChange('red')} className="w-10 h-10 rounded-full bg-[#ef4444] hover:ring-2 hover:ring-white border border-black transition-all" title="Red"></button>
                <button onClick={() => handleColorChange('purple')} className="w-10 h-10 rounded-full bg-[#8b5cf6] hover:ring-2 hover:ring-white border border-black transition-all" title="Purple"></button>
              </div>

              <div className="mt-8 pt-4 border-t border-white/10 opacity-60 pointer-events-none">
                <p className="text-xs text-white/50 italic">A cor será alterada instantaneamente em toda a aplicação.</p>
              </div>
            </div>
          </div>

          <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 backdrop-blur-sm mt-6">
            <h3 className="text-white font-bold mb-4 border-b border-white/5 pb-2">Informações do Mod</h3>
            <div className="grid grid-cols-2 gap-4">
               <div>
                  <label className="block text-xs font-semibold text-white/60 mb-1">Nome do Projeto/Mod</label>
                  <input type="text" value={projectSettings.name} onChange={e => setProjectSettings({...projectSettings, name: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-sm text-white focus:border-amber-500 outline-none" />
               </div>
               <div>
                  <label className="block text-xs font-semibold text-white/60 mb-1">Mod ID (Apenas letras minúsculas e _)</label>
                  <input type="text" value={projectSettings.modId || projectSettings.name.toLowerCase().replace(/\s+/g, '_')} onChange={e => setProjectSettings({...projectSettings, modId: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '')})} className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-sm text-white focus:border-amber-500 outline-none" />
               </div>
               <div>
                  <label className="block text-xs font-semibold text-white/60 mb-1">Versão do Mod</label>
                  <input type="text" defaultValue="1.0.0" className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-sm text-white focus:border-amber-500 outline-none" />
               </div>
               <div>
                  <label className="block text-xs font-semibold text-white/60 mb-1">Autor(es)</label>
                  <input type="text" defaultValue="ModForger User" className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-sm text-white focus:border-amber-500 outline-none" />
               </div>
               <div className="col-span-2">
                  <label className="block text-xs font-semibold text-white/60 mb-1">Descrição</label>
                  <textarea defaultValue="Gerado pelo ModForger" className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-sm text-white focus:border-amber-500 outline-none h-20 resize-none"></textarea>
               </div>
            </div>
          </div>


        </div>
      </div>
    </div>
  );
};

