import { ProjectSettings } from './Launcher';
import { Settings, Box, Zap } from 'lucide-react';

export const SettingsEditor = ({ projectSettings, setProjectSettings }: { projectSettings: ProjectSettings, setProjectSettings: (s: ProjectSettings) => void }) => {
  
  const loaders = [
    { id: 'forge', name: 'Forge', icon: <Box size={24} /> },
    { id: 'neoforge', name: 'NeoForge', icon: <Zap size={24} /> },
    { id: 'fabric', name: 'Fabric', icon: <Box size={24} /> },
  ];

  const mcVersions = [
    '1.21.1', '1.21.0', '1.20.6', '1.20.4', '1.20.2', '1.20.1', '1.19.4', '1.19.2', '1.18.2'
  ];

  return (
    <div className="flex-1 bg-[radial-gradient(circle_at_top_right,_#1a1510_0%,_#0A0A0C_60%)] flex flex-col relative overflow-hidden">
      <div className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto space-y-6">
          <header className="mb-8">
            <h1 className="text-4xl font-extrabold tracking-tighter text-white mb-2 flex items-center gap-3 italic">
              <Settings className="text-amber-500 w-8 h-8" />
              Configurações do Projeto
            </h1>
            <p className="text-white/40 text-lg font-light">Mude o target de compilação, versão e propriedades vitais do seu Mod.</p>
          </header>

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
                  <label className="block text-xs font-semibold text-white/60 mb-1">Versão do Jogo</label>
                  <select 
                    value={projectSettings.version} 
                    onChange={e => setProjectSettings({...projectSettings, version: e.target.value})} 
                    className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-sm text-white focus:border-amber-500 outline-none cursor-pointer"
                  >
                     {mcVersions.map(v => (
                       <option key={v} value={v}>{v}</option>
                     ))}
                  </select>
               </div>
               <div>
                  <label className="block text-xs font-semibold text-white/60 mb-1">Versão do Mod</label>
                  <input type="text" defaultValue="1.0.0" className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-sm text-white focus:border-amber-500 outline-none" />
               </div>
               <div className="col-span-2">
                  <label className="block text-xs font-semibold text-white/60 mb-1">Descrição</label>
                  <textarea defaultValue="Gerado pelo ModForger" className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-sm text-white focus:border-amber-500 outline-none h-20 resize-none"></textarea>
               </div>
            </div>
          </div>

          <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 backdrop-blur-sm mt-6">
             <h3 className="text-white font-bold mb-4 border-b border-white/5 pb-2">Seletor de Motor / Loader</h3>
             <div className="grid grid-cols-3 gap-3">
               {loaders.map((l) => (
                 <div 
                   key={l.id}
                   onClick={() => setProjectSettings({...projectSettings, loader: l.id})}
                   className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl border cursor-pointer transition-all ${
                     projectSettings.loader === l.id 
                       ? 'bg-amber-500/10 border-amber-500 text-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.1)]' 
                       : 'bg-black/40 border-white/10 text-white/40 hover:bg-white/5 hover:border-white/20'
                   }`}
                 >
                   {l.icon}
                   <span className="text-xs font-bold tracking-wide">{l.name}</span>
                 </div>
               ))}
             </div>
             <p className="text-xs text-white/40 mt-4 italic">Alterar o loader irá mudar como o motor de compilação gera o código final subjacente.</p>
          </div>

        </div>
      </div>
    </div>
  );
};

