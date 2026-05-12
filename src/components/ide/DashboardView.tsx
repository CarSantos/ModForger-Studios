import { Dispatch, SetStateAction, useState, useEffect } from 'react';
import { ProjectSettings } from './Launcher';
import { Image as ImageIcon, Box, Trash2, Plus, Search, Download, Check, Type } from 'lucide-react';
import { useModStore } from '../../store/modStore';

interface DashboardProps {
  projectSettings: ProjectSettings;
  setProjectSettings: Dispatch<SetStateAction<ProjectSettings | null>>;
  setActiveView: (view: string) => void;
}

export const DashboardView = ({ projectSettings, setProjectSettings, setActiveView }: DashboardProps) => {
  const [modVersion, setModVersion] = useState('1.0.0');
  const [modName, setModName] = useState(projectSettings.name);
  const [mcVersion, setMcVersion] = useState(projectSettings.version);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  const store = useModStore();

  const handleSave = () => {
    setSaveStatus('saving');
    setTimeout(() => {
      setProjectSettings(prev => prev ? {
        ...prev,
        name: modName,
        version: mcVersion,
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
      const fileName = `${modInfo.slug}-${modInfo.latest_version || 'latest'}.jar`;
      if (prev.dependencies.some(d => d.name === fileName)) return prev;
      return {
        ...prev,
        dependencies: [...prev.dependencies, { name: fileName, size: 1048576 }]
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

  const handleOpenElement = (id: string, type: 'item' | 'block' | 'entity' | 'structure' | 'loot' | 'recipe', viewName: string) => {
    store.openElement(id, type);
    setActiveView(viewName);
  };

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
          <div className="col-span-3 bg-white/[0.02] border border-white/10 rounded-2xl p-6 backdrop-blur-sm flex items-center gap-6">
            <div className="w-24 h-24 bg-black/40 border-2 border-dashed border-white/10 rounded-xl flex items-center justify-center flex-col text-white/30 cursor-pointer hover:border-amber-500/50 hover:bg-amber-500/5 transition-colors group">
              <ImageIcon size={32} className="mb-2 group-hover:text-amber-500 transition-colors" />
              <span className="text-[10px] group-hover:text-amber-200 transition-colors">pack.png</span>
            </div>
            <div>
               <h3 className="text-white font-bold text-xl">{projectSettings.name}</h3>
               <p className="text-white/40 text-sm">Versão {projectSettings.version} • {projectSettings.loader || 'NeoForge'}</p>
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
            {store.items.map((item, idx) => (
              <div 
                key={idx} 
                className="bg-black/40 border border-white/10 hover:border-amber-500/30 rounded-xl p-4 cursor-pointer transition-colors group relative"
                onClick={() => handleOpenElement(item.id, 'item', 'Itens')}
              >
                 <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="bg-amber-500/10 text-amber-500 p-1.5 rounded-lg border border-amber-500/20">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
                    </div>
                 </div>
                 <div className="flex justify-between items-start mb-3">
                  <div className={`w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-500 flex items-center justify-center border border-cyan-500/30`}>
                     <Box size={16} />
                  </div>
                </div>
                <h4 className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors truncate pr-6">{item.displayName}</h4>
                <div className="text-[10px] uppercase font-bold tracking-wider text-white/40 mt-1">Item</div>
              </div>
            ))}
            {store.blocks.map((block, idx) => (
              <div 
                key={`block-${idx}`} 
                className="bg-black/40 border border-white/10 hover:border-amber-500/30 rounded-xl p-4 cursor-pointer transition-colors group relative"
                onClick={() => handleOpenElement(block.id, 'block', 'Blocos')}
              >
                 <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="bg-amber-500/10 text-amber-500 p-1.5 rounded-lg border border-amber-500/20">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
                    </div>
                 </div>
                <div className="flex justify-between items-start mb-3">
                  <div className={`w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-500 flex items-center justify-center border border-emerald-500/30`}>
                     <Box size={16} />
                  </div>
                </div>
                <h4 className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors truncate pr-6">{block.displayName}</h4>
                <div className="text-[10px] uppercase font-bold tracking-wider text-white/40 mt-1">Bloco</div>
              </div>
            ))}
            {store.structures.map((struct, idx) => (
              <div 
                key={`struct-${idx}`} 
                className="bg-black/40 border border-white/10 hover:border-amber-500/30 rounded-xl p-4 cursor-pointer transition-colors group relative"
                onClick={() => handleOpenElement(struct.id, 'structure', 'Mundo')}
              >
                 <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="bg-amber-500/10 text-amber-500 p-1.5 rounded-lg border border-amber-500/20">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
                    </div>
                 </div>
                <div className="flex justify-between items-start mb-3">
                  <div className={`w-8 h-8 rounded-lg bg-amber-500/20 text-amber-500 flex items-center justify-center border border-amber-500/30`}>
                     <Box size={16} />
                  </div>
                </div>
                <h4 className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors truncate pr-6">{struct.displayName}</h4>
                <div className="text-[10px] uppercase font-bold tracking-wider text-white/40 mt-1">Estrutura</div>
              </div>
            ))}
            {store.recipes?.map((recipe, idx) => (
              <div 
                key={`recipe-${idx}`} 
                className="bg-black/40 border border-white/10 hover:border-amber-500/30 rounded-xl p-4 cursor-pointer transition-colors group relative"
                onClick={() => handleOpenElement(recipe.id, 'recipe' as any, 'Receitas')}
              >
                 <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="bg-amber-500/10 text-amber-500 p-1.5 rounded-lg border border-amber-500/20">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
                    </div>
                 </div>
                <div className="flex justify-between items-start mb-3">
                  <div className={`w-8 h-8 rounded-lg bg-pink-500/20 text-pink-500 flex items-center justify-center border border-pink-500/30`}>
                     <Box size={16} />
                  </div>
                </div>
                <h4 className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors truncate pr-6">{recipe.displayName}</h4>
                <div className="text-[10px] uppercase font-bold tracking-wider text-white/40 mt-1">Receita</div>
              </div>
            ))}
            {store.lootTables.map((loot, idx) => (
              <div 
                key={`loot-${idx}`} 
                className="bg-black/40 border border-white/10 hover:border-amber-500/30 rounded-xl p-4 cursor-pointer transition-colors group relative"
                onClick={() => handleOpenElement(loot.id, 'loot', 'Loots')}
              >
                 <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="bg-amber-500/10 text-amber-500 p-1.5 rounded-lg border border-amber-500/20">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
                    </div>
                 </div>
                <div className="flex justify-between items-start mb-3">
                  <div className={`w-8 h-8 rounded-lg bg-yellow-400/20 text-yellow-400 flex items-center justify-center border border-yellow-400/30`}>
                     <Box size={16} />
                  </div>
                </div>
                <h4 className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors truncate pr-6">{loot.registryName}</h4>
                <div className="text-[10px] uppercase font-bold tracking-wider text-white/40 mt-1">Loot Table</div>
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
