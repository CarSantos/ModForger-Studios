import { Dispatch, SetStateAction, useState, useEffect } from 'react';
import { ProjectSettings } from './Launcher';
import { Image as ImageIcon, Box, Trash2, Plus, Search, Download, Check } from 'lucide-react';

interface DashboardProps {
  projectSettings: ProjectSettings;
  setProjectSettings: Dispatch<SetStateAction<ProjectSettings | null>>;
}

export const DashboardView = ({ projectSettings, setProjectSettings }: DashboardProps) => {
  const [modVersion, setModVersion] = useState('1.0.0');
  const [modName, setModName] = useState(projectSettings.name);
  const [mcVersion, setMcVersion] = useState(projectSettings.version);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  const handleSave = () => {
    setSaveStatus('saving');
    // Simulate save delay
    setTimeout(() => {
      setProjectSettings(prev => prev ? {
        ...prev,
        name: modName,
        version: mcVersion,
        // modVersion is not in ProjectSettings type currently, but we'd save it if it was
      } : null);
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    }, 600);
  };

  const searchModrinth = async () => {
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    try {
      const res = await fetch(`https://api.modrinth.com/v2/search?query=${encodeURIComponent(searchQuery)}&limit=5`);
      const data = await res.json();
      setSearchResults(data.hits || []);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSearching(false);
    }
  };

  const addDependency = (modInfo: any) => {
    setProjectSettings(prev => {
      if (!prev) return prev;
      // Convert to dummy jar name
      const fileName = `${modInfo.slug}-${modInfo.latest_version || 'latest'}.jar`;
      if (prev.dependencies.some(d => d.name === fileName)) return prev;
      return {
        ...prev,
        dependencies: [...prev.dependencies, { name: fileName, size: 1048576 }] // 1MB mock
      };
    });
  };

  const removeDependency = (name: string) => {
     setProjectSettings(prev => {
        if (!prev) return prev;
        return {
           ...prev,
           dependencies: prev.dependencies.filter(d => d.name !== name)
        }
     });
  };

  const loaderVersions = [
    '1.21.1', '1.21.0', '1.20.6', '1.20.5', '1.20.4', '1.20.3', '1.20.2', 
    '1.20.1', '1.20', '1.19.4', '1.19.3', '1.19.2', '1.19.1', '1.19', 
    '1.18.2'
  ];

  return (
    <div className="flex-1 p-8 overflow-y-auto bg-[radial-gradient(circle_at_top_right,_#1a1510_0%,_#0A0A0C_60%)] relative">
      <div className="max-w-4xl mx-auto space-y-6">
        <header className="mb-8 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tighter text-white mb-2">Visão Geral do Mod</h1>
            <p className="text-white/40 text-lg font-light">Configure metadados e dependências integrando com Modrinth.</p>
          </div>
          <button 
            onClick={handleSave}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-bold transition-all shadow-lg ${saveStatus === 'saved' ? 'bg-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.3)]' : 'bg-amber-500 text-black hover:bg-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.2)]'}`}
          >
            {saveStatus === 'saving' ? 'A Salvar...' : saveStatus === 'saved' ? <><Check size={18} /> Salvo!</> : 'Salvar Alterações'}
          </button>
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
                  <label className="block text-xs font-semibold text-white/60 mb-1">Versão do Jogo (Loader: NeoForge)</label>
                  <select 
                    value={mcVersion} 
                    onChange={(e) => setMcVersion(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-sm text-white focus:border-amber-500 outline-none transition-all cursor-pointer"
                  >
                    {loaderVersions.map(v => (
                      <option key={v} value={v}>{v}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-white/60 mb-1">Versão do Mod</label>
                  <input 
                    type="text" 
                    value={modVersion} 
                    onChange={(e) => setModVersion(e.target.value)} 
                    className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-sm text-white focus:border-amber-500 outline-none transition-all" 
                  />
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
            <h3 className="text-white font-bold flex items-center gap-2">
               <Box className="text-amber-500" size={18} />
               God-Mode: Gestão Modrinth API
            </h3>
          </div>
          
          <div className="flex gap-2 mb-6">
             <div className="relative flex-1">
                <Search size={18} className="absolute left-3 top-3 text-white/30" />
                <input 
                   type="text"
                   placeholder="Pesquisar mods no Modrinth (ex: JEI, Geckolib)..."
                   value={searchQuery}
                   onChange={(e) => setSearchQuery(e.target.value)}
                   onKeyDown={e => e.key === 'Enter' && searchModrinth()}
                   className="w-full bg-black/60 border border-amber-500/30 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white focus:border-amber-500 outline-none shadow-[0_0_15px_rgba(245,158,11,0.05)]"
                />
             </div>
             <button 
                onClick={searchModrinth}
                className="bg-amber-500 text-black font-bold px-6 py-2.5 rounded-lg hover:bg-amber-400 transition-colors flex items-center gap-2"
                disabled={isSearching}
             >
                {isSearching ? 'A pesquisar...' : 'Pesquisar'}
             </button>
          </div>

          {searchResults.length > 0 && (
            <div className="bg-black/30 border border-white/5 rounded-xl p-4 mb-6">
               <h4 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-3">Resultados da Pesquisa</h4>
               <div className="space-y-2">
                 {searchResults.map((res: any) => (
                    <div key={res.project_id} className="flex justify-between items-center p-3 bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 rounded-lg transition-colors">
                       <div className="flex items-center gap-3">
                          {res.icon_url ? <img src={res.icon_url} alt="icon" className="w-8 h-8 rounded" /> : <Box size={24} className="text-white/20" />}
                          <div>
                             <p className="text-white font-bold text-sm">{res.title}</p>
                             <p className="text-white/40 text-xs truncate max-w-[300px]">{res.description}</p>
                          </div>
                       </div>
                       <button 
                         onClick={() => addDependency(res)}
                         className="bg-purple-500/10 text-purple-400 border border-purple-500/20 hover:bg-purple-500 hover:text-white px-3 py-1.5 rounded text-xs font-bold transition-colors flex items-center gap-1"
                       >
                         <Download size={14} /> Instalar
                       </button>
                    </div>
                 ))}
               </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
             <div className="col-span-2 mb-2">
                <h4 className="text-xs font-bold text-white/40 uppercase tracking-widest">Dependências Instaladas no Workspace</h4>
             </div>
             {projectSettings.dependencies.length === 0 ? (
               <div className="col-span-2 text-center text-xs text-white/30 italic py-8 border border-dashed border-white/5 rounded-xl bg-black/20">Nenhum mod carregado. <br/><br/>Pesquise acima para instalar a dependência.</div>
             ) : (
               projectSettings.dependencies.map((dep, idx) => (
                 <div key={idx} className="flex justify-between items-center bg-emerald-500/5 border border-emerald-500/20 rounded-lg p-3 group">
                   <div className="flex items-center gap-3">
                     <span className="bg-emerald-500/10 text-emerald-500 p-2 rounded"><Check size={16} /></span>
                     <span className="text-sm font-mono text-emerald-100 truncate w-[200px]">{dep.name}</span>
                   </div>
                   <button onClick={() => removeDependency(dep.name)} className="text-red-400/50 hover:text-red-400 transition-colors p-1" title="Remover">
                     <Trash2 size={16} />
                   </button>
                 </div>
               ))
             )}
          </div>
        </div>

        {/* Workspace Central */}
        <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 backdrop-blur-sm mt-6">
          <div className="flex justify-between items-center mb-4 border-b border-white/5 pb-2">
            <h3 className="text-white font-bold flex items-center gap-2">
               <Box className="text-indigo-400" size={18} />
               Workspace (Arquivos do Projeto)
            </h3>
            <span className="text-xs text-white/50 bg-black/40 px-2 py-1 rounded">Repositório Central</span>
          </div>
          
          <div className="grid grid-cols-4 gap-4">
            {/* Mock Items */}
            {[
              { type: 'Criaturas', name: 'Goblin', color: 'bg-red-500' },
              { type: 'Itens', name: 'Espada de Gelo', color: 'bg-cyan-500' },
              { type: 'Blocos', name: 'Minério de Mithril', color: 'bg-emerald-500' },
              { type: 'Biomas', name: 'Floresta Sombria', color: 'bg-green-600' },
              { type: 'Lógica (Nodos)', name: 'Evento: Ao Entrar no Bioma', color: 'bg-purple-500' },
            ].map((item, idx) => (
              <div key={idx} className="bg-black/40 border border-white/10 hover:border-white/20 rounded-xl p-4 cursor-pointer transition-colors group">
                <div className="flex justify-between items-start mb-3">
                  <div className={`w-8 h-8 rounded-lg ${item.color}/20 text-${item.color} flex items-center justify-center border border-${item.color}/30`}>
                     <Box size={16} className={`text-${item.color.replace('bg-', '')}`} />
                  </div>
                </div>
                <h4 className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors">{item.name}</h4>
                <div className="text-[10px] uppercase font-bold tracking-wider text-white/40 mt-1">{item.type}</div>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-lg text-xs text-indigo-200">
            <strong>Dica de Organização:</strong> Nodos de lógica estão sempre aninhados nas entidades aqui no Workspace. Para editar a lógica da "Espada de Gelo", clique na Espada, e acesse a aba "Ação Customizada" lá dentro.
          </div>
        </div>

      </div>
    </div>
  );
};
