import { Dispatch, SetStateAction, useState } from 'react';
import { ProjectSettings } from './Launcher';
import { Image as ImageIcon, Box, Trash2, Plus, ArrowRight } from 'lucide-react';

interface DashboardProps {
  projectSettings: ProjectSettings;
  setProjectSettings: Dispatch<SetStateAction<ProjectSettings | null>>;
}

export const DashboardView = ({ projectSettings, setProjectSettings }: DashboardProps) => {
  const [dragActive, setDragActive] = useState(false);
  const [modVersion, setModVersion] = useState('1.0.0');
  const [modName, setModName] = useState(projectSettings.name);
  const [mcVersion, setMcVersion] = useState(projectSettings.version);

  return (
    <div className="flex-1 p-8 overflow-y-auto bg-[radial-gradient(circle_at_top_right,_#1a1510_0%,_#0A0A0C_60%)]">
      <div className="max-w-4xl mx-auto space-y-6">
        <header className="mb-8">
          <h1 className="text-3xl font-extrabold tracking-tighter text-white mb-2">Visão Geral do Mod</h1>
          <p className="text-white/40 text-lg font-light">Configure os metadados do seu mod, dependências e informações principais.</p>
        </header>

        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 bg-white/[0.02] border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
            <h3 className="text-white font-bold mb-4 border-b border-white/5 pb-2">Informações Base</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-white/60 mb-1">Nome do Mod</label>
                <input 
                  type="text" 
                  value={modName} 
                  onChange={(e) => setModName(e.target.value)} 
                  className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-sm text-white focus:border-amber-500 outline-none transition-all" 
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-white/60 mb-1">Versão do Mod</label>
                  <input 
                    type="text" 
                    value={modVersion} 
                    onChange={(e) => setModVersion(e.target.value)} 
                    className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-sm text-white focus:border-amber-500 outline-none transition-all" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-white/60 mb-1">Versão do Jogo (MC)</label>
                  <select 
                    value={mcVersion} 
                    onChange={(e) => setMcVersion(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-sm text-white focus:border-amber-500 outline-none transition-all cursor-pointer"
                  >
                    {['1.26.1', '1.21.1', '1.20.6', '1.19.4', '1.18.2'].map(v => (
                      <option key={v} value={v}>{v}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 backdrop-blur-sm flex flex-col">
            <h3 className="text-white font-bold mb-4 border-b border-white/5 pb-2">Logotipo do Mod</h3>
            <div className="flex-1 w-full bg-black/40 border-2 border-dashed border-white/10 rounded-xl flex items-center justify-center flex-col text-white/30 cursor-pointer hover:border-amber-500/50 hover:bg-amber-500/5 transition-colors group">
              <ImageIcon size={48} className="mb-2 group-hover:text-amber-500 transition-colors" />
              <span className="text-xs group-hover:text-amber-200 transition-colors">Importar pack.png</span>
            </div>
          </div>
        </div>

        <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
          <div className="flex justify-between items-center mb-4 border-b border-white/5 pb-2">
            <h3 className="text-white font-bold">Mods Compatíveis (Dependências)</h3>
            <button className="flex items-center gap-1 bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 text-xs px-3 py-1.5 rounded transition-colors font-bold uppercase">
              <Plus size={14} /> Adicionar
            </button>
          </div>
          
          <div 
             className={`w-full border-2 border-dashed ${dragActive ? 'border-amber-500 bg-amber-500/5' : 'border-white/5 bg-black/20'} rounded-xl p-6 flex flex-col items-center justify-center text-center transition-all min-h-[120px] mb-4`}
             onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
             onDragLeave={() => setDragActive(false)}
             onDrop={(e) => {
               e.preventDefault();
               setDragActive(false);
               // Placeholder for adding dependency logic
             }}
           >
             <Box className={`mb-3 ${dragActive ? 'text-amber-500' : 'text-white/20'}`} size={32} />
             <p className={`text-sm font-bold ${dragActive ? 'text-amber-400' : 'text-white/60'}`}>Arraste os ficheiros .jar de outros mods aqui</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
             {projectSettings.dependencies.length === 0 ? (
               <div className="col-span-2 text-center text-xs text-white/30 italic py-4">Nenhum mod carregado.</div>
             ) : (
               projectSettings.dependencies.map((dep, idx) => (
                 <div key={idx} className="flex justify-between items-center bg-black/40 border border-white/10 rounded-lg p-3 group hover:border-amber-500/50 transition-colors">
                   <div className="flex items-center gap-3">
                     <span className="bg-white/10 p-2 rounded text-white/50"><Box size={16} /></span>
                     <span className="text-sm text-white/80 truncate w-[200px]">{dep.name}</span>
                   </div>
                   <button className="text-red-400/50 hover:text-red-400 transition-colors p-1" title="Remover">
                     <Trash2 size={16} />
                   </button>
                 </div>
               ))
             )}
          </div>
        </div>

      </div>
    </div>
  );
};
