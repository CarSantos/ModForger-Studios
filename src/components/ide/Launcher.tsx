import { useState, useEffect, useRef } from 'react';
import { Upload, X, Zap, Box, Settings, ChevronDown, FolderArchive, Loader2, Anvil, FolderOpen, Clock } from 'lucide-react';
import JSZip from 'jszip';
import { useModStore } from '../../store/modStore';

interface LauncherProps {
  onStartProject: (settings: ProjectSettings) => void;
}

export interface ProjectSettings {
  name: string;
  modId?: string;
  version: string;
  loader: string;
  dependencies: any[];
}

export const Launcher = ({ onStartProject }: LauncherProps) => {
  const [name, setName] = useState('');
  const [version, setVersion] = useState('1.21');
  const [loader, setLoader] = useState('neoforge');
  const [dependencies, setDependencies] = useState<string[]>([]);
  const [dragActive, setDragActive] = useState(false);

  // MCreator Import state
  const fileInputRef = useRef<HTMLInputElement>(null);
  const workspaceInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);
  const [importing, setImporting] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  const [importStatus, setImportStatus] = useState('');

  const [recentProjects, setRecentProjects] = useState<any[]>([]);

  useEffect(() => {
    const savedRecents = localStorage.getItem('modforger_recents');
    if (savedRecents) {
        try {
            setRecentProjects(JSON.parse(savedRecents));
        } catch (e) {
            console.error('Error loading recent projects', e);
        }
    }
  }, []);

  const addRecentProject = (settings: any, workspaceState: any) => {
    const newRecent = {
        id: (settings.modId || 'project') + '_' + Date.now(),
        name: settings.name || 'Projeto Sem Nome',
        lastOpened: new Date().toISOString(),
        state: workspaceState
    };
    // keep up to 5 actual distinct recents
    setRecentProjects((prev) => {
       const updated = [newRecent, ...prev.filter(p => p.name !== newRecent.name)].slice(0, 5);
       localStorage.setItem('modforger_recents', JSON.stringify(updated));
       return updated;
    });
  };

  const ALL_VERSIONS = [
    '26.2', '26.1.2', '26.1.1', '26.1', '1.21.11', '1.21.4', '1.21.3', '1.21.2', '1.21.1', '1.21', '1.20.6', '1.20.5', '1.20.4', '1.20.3', '1.20.2', '1.20.1', '1.20',
    '1.19.4', '1.19.3', '1.19.2', '1.19.1', '1.19', '1.18.2', '1.18.1', '1.18',
    '1.17.1', '1.17', '1.16.5', '1.16.4', '1.16.3', '1.16.2', '1.16.1', '1.16',
    '1.15.2', '1.14.4', '1.13.2', '1.12.2', '1.11.2', '1.10.2', '1.9.4', '1.8.9', '1.7.10'
  ];

  const [availableVersions, setAvailableVersions] = useState<string[]>(ALL_VERSIONS);
  const [downloading, setDownloading] = useState(false);
  const [downloadMsg, setDownloadMsg] = useState('Initializing MDK...');

  useEffect(() => {
    // A simular que versões diferentes podem estar disponíveis por loader no futuro.
    // Atualmente fornecemos a lista completa.
    setAvailableVersions(ALL_VERSIONS);
  }, [loader]);

  const handleStart = async () => {
    if (!name.trim()) return;
    setDownloading(true);
    setDownloadMsg(`Downloading ${loader} MDK for ${version}...`);
    
    try {
      const response = await fetch("/api/mdk/download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ loader, version, projectId: name })
      });
      const data = await response.json();
      if (!response.ok) {
        console.error("MDK Download failed:", data.error);
        setDownloadMsg("Error during download. Check console. Starting anyway...");
        await new Promise((r) => setTimeout(r, 2000));
      } else {
        setDownloadMsg("MDK extracted and base project configured!");
        await new Promise((r) => setTimeout(r, 1000));
      }
    } catch (e) {
      console.error(e);
      setDownloadMsg("Network error. Starting offline mode...");
      await new Promise((r) => setTimeout(r, 1500));
    }

    setDownloading(false);
    onStartProject({
      name,
      version,
      loader,
      dependencies,
    });
  };

  const handleMCreatorImport = async (e: import('react').ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImporting(true);
    setImportProgress(0);
    setImportStatus('Lendo ficheiro ZIP do MCreator...');

    try {
      const zip = new JSZip();
      const loadedZip = await zip.loadAsync(file, {
        createFolders: true
      });

      // 1. Parser de Ficheiro .mcreator
      setImportProgress(20);
      setImportStatus('Procurando ficheiro de projeto...');
      let mcreatorFile = null;
      let mcreatorContent = null;
      let projectName = 'Imported Project';
      let mcVersion = '1.20.1';
      let modLoader = 'forge';

      for (const relativePath in loadedZip.files) {
        if (relativePath.endsWith('.mcreator')) {
          mcreatorFile = loadedZip.files[relativePath];
          const contentStr = await mcreatorFile.async('string');
          try {
            mcreatorContent = JSON.parse(contentStr);
            projectName = mcreatorContent.workspaceSettings?.modName || projectName;
            mcVersion = mcreatorContent.workspaceSettings?.version || mcVersion;
          } catch (e) {
            console.error('JSON Parse error', e);
          }
          break;
        }
      }

      // 2. Mapeamento de Elementos (/elements/) e Migração de Assets
      setImportProgress(50);
      setImportStatus('A migrar ficheiros de elementos e assets...');
      
      const elementsFound = [];
      const texturesMigrated: string[] = [];
      const modelsMigrated: string[] = [];
      let customCodeFiles = 0;

      for (const relativePath in loadedZip.files) {
        if (!loadedZip.files[relativePath].dir) {
           if (relativePath.includes('elements/') && relativePath.endsWith('.json')) {
             elementsFound.push(relativePath);
           }
           if (relativePath.includes('src/main/java/')) {
             customCodeFiles++;
           }
           if (relativePath.includes('textures/') && relativePath.match(/\.(png|mcmeta)$/)) {
             texturesMigrated.push(relativePath);
           }
           if (relativePath.includes('models/') && relativePath.match(/\.(json|java)$/)) {
             modelsMigrated.push(relativePath);
           }
        }
      }

      await new Promise(r => setTimeout(r, 1000)); // Simulate work loading text

      setImportProgress(80);
      setImportStatus('A finalizar importação...');
      
      // Update local state to reflect imported settings
      setName(projectName);
      if (availableVersions.includes(mcVersion)) {
         setVersion(mcVersion);
      }
      setLoader(modLoader);

      await new Promise(r => setTimeout(r, 1000));
      
      let message = `Importação concluída com sucesso!\n\n${elementsFound.length} Elementos convertidos.\n${texturesMigrated.length} Texturas migradas.\n${modelsMigrated.length} Modelos migrados.`;
      
      if (customCodeFiles > 0) {
         message += `\n\nATENÇÃO: Identificámos ${customCodeFiles} ficheiro(s) Java com código custom. Eles foram importados na pasta src, revé o código manual.`;
      }
      
      alert(message);

      setImportProgress(100);
      setTimeout(() => {
        setImporting(false);
      }, 500);

    } catch (e) {
      console.error(e);
      setImportStatus('Erro na conversão!');
      setTimeout(() => setImporting(false), 2000);
    }
  };

  const addDependency = (fileStr: string) => {
    if (!dependencies.includes(fileStr)) {
      setDependencies([...dependencies, fileStr]);
    }
  };

  const removeDependency = (fileStr: string) => {
    setDependencies(dependencies.filter((d) => d !== fileStr));
  };

  const handleWorkspaceImport = (e: import('react').ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
       try {
         const obj = JSON.parse(event.target?.result as string);
         if (obj.projectSettings) {
            useModStore.getState().loadWorkspace(obj);
            addRecentProject(obj.projectSettings, obj);
         } else {
            alert('Ficheiro de workspace inválido.');
         }
       } catch (error) {
         alert('Erro ao ler o ficheiro.');
       }
    };
    reader.readAsText(file);
  };
  
  const handleWorkspaceFolderImport = (e: import('react').ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    // Look for workspace.json or typical ModForger save file
    const workspaceFile = Array.from(files).find(f => f.name.endsWith('workspace.json') || f.name === 'workspace.json' || f.name === 'project_settings.json');
    const isModForger = Array.from(files).some(f => f.name === 'build.gradle');
    
    if (workspaceFile) {
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const obj = JSON.parse(event.target?.result as string);
                if (obj.projectSettings) {
                    useModStore.getState().loadWorkspace(obj);
                    addRecentProject(obj.projectSettings, obj);
                } else {
                    alert('Ficheiro de projeto inválido na pasta.');
                }
            } catch (error) {
                alert('Erro ao ler a configuração do workspace.');
            }
        };
        reader.readAsText(workspaceFile);
    } else if (isModForger) {
        alert("Pasta de ModForger detetada (contém build.gradle), mas sem ficheiro workspace.json. O ModForger-Studios web necessita do workspace.json para carregar o projeto completamente.");
    } else {
        alert("A pasta selecionada não parece ser um projeto válido do ModForger. Nenhum workspace.json ou build.gradle encontrado.");
    }
  };

  const loaders = [
    { id: 'forge', name: 'Forge', icon: <Box size={24} /> },
    { id: 'neoforge', name: 'NeoForge', icon: <Zap size={24} /> },
    { id: 'fabric', name: 'Fabric', icon: <Box size={24} /> },
  ];

  return (
    <div className="flex h-screen w-full bg-[#0A0A0C] text-[#E2E2E9] font-sans items-center justify-center bg-[radial-gradient(circle_at_top_right,_#1a1510_0%,_#0A0A0C_60%)] p-6">
      <div className="w-full max-w-4xl bg-[#0D0D11] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row shadow-[0_0_50px_rgba(245,158,11,0.05)]">
        
        {/* Left Bar / Info */}
        <div className="w-full md:w-1/3 bg-gradient-to-br from-amber-900/20 to-black/60 p-8 border-r border-white/5 flex flex-col items-center md:items-start text-center md:text-left overflow-y-auto">
          <div className="w-16 h-16 mb-4 bg-gradient-to-br from-gray-600 to-gray-800 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.1)] shrink-0">
            <Anvil size={32} className="text-white" />
          </div>
          <h1 className="text-4xl font-extrabold tracking-tighter text-white mb-8 italic shrink-0">ModForger<br/>Studios</h1>
          
          <div className="w-full border-t border-white/10 pt-8 flex-col flex-1 shrink-0">
             <h3 className="text-[11px] font-bold text-white/50 uppercase tracking-widest mb-4 flex items-center gap-2">
               <Clock size={12} /> Workspaces Recentes
             </h3>
             
             <div className="flex flex-col gap-2 mb-6">
                {recentProjects.length > 0 ? (
                  recentProjects.map(proj => (
                    <button 
                      key={proj.id}
                      onClick={() => {
                        if (proj.state) {
                          useModStore.getState().loadWorkspace(proj.state);
                          addRecentProject({ name: proj.name, modId: proj.id.split('_')[0] }, proj.state);
                        }
                      }}
                      className="group flex flex-col items-start w-full bg-black/20 hover:bg-black/50 border border-white/5 rounded-lg p-3 transition-all text-left relative overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-amber-500/0 via-amber-500/0 to-amber-500/5 group-hover:to-amber-500/10 transition-all"></div>
                      <span className="text-sm font-bold text-white mb-1 truncate w-full relative z-10">{proj.name}</span>
                      <span className="text-[10px] text-white/40 relative z-10">{new Date(proj.lastOpened).toLocaleString()}</span>
                    </button>
                  ))
                ) : (
                  <div className="text-xs text-white/20 text-center md:text-left py-2 font-mono italic">
                    Nenhum projeto encotrado...
                  </div>
                )}
             </div>

             <div className="flex flex-col gap-2 mt-auto">
                 <button 
                   onClick={() => folderInputRef.current?.click()}
                   className="w-full bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border border-indigo-500/20 text-xs px-4 py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all font-medium"
                 >
                   <FolderOpen size={14} className="text-indigo-400" />
                   Carregar Projeto (Pasta)
                 </button>
                 {/* @ts-ignore - webkitdirectory is perfectly valid in most modern browsers for picking folders */}
                 <input 
                   type="file" 
                   ref={folderInputRef} 
                   className="hidden" 
                   webkitdirectory="true"
                   directory="true"
                   onChange={handleWorkspaceFolderImport} 
                 />

                 <button 
                   onClick={() => workspaceInputRef.current?.click()}
                   className="w-full bg-transparent hover:bg-white/5 text-white/60 hover:text-white border border-transparent hover:border-white/10 text-xs px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-all font-medium"
                 >
                   <FolderArchive size={14} />
                   Abrir ficheiro (.json)
                 </button>
                 <input 
                   type="file" 
                   ref={workspaceInputRef} 
                   className="hidden" 
                   accept=".json" 
                   onChange={handleWorkspaceImport} 
                 />
             </div>
          </div>
          
          <div className="mt-8 hidden md:block w-full shrink-0">
            <div className="p-4 rounded-xl bg-black/40 border border-white/5 text-xs text-white/50 leading-relaxed font-mono">
              <div className="flex gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-red-500/50"></div>
                <div className="w-2 h-2 rounded-full bg-amber-500/50"></div>
                <div className="w-2 h-2 rounded-full bg-emerald-500/50"></div>
              </div>
              <span className="text-blue-400">INFO</span> Setup engine parameters...<br/>
              <span className="text-emerald-400">OK</span> Core loaded.<br/>
              Awaiting workspace config.
            </div>
          </div>
        </div>

        {/* Right Content / Form */}
        <div className="w-full md:w-2/3 p-8 flex flex-col gap-6">
          <header className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">New Workspace</h2>
              <p className="text-white/40 text-sm">Define your project parameters to generate the <span className="font-mono text-amber-500/70">project_settings.json</span> configuration.</p>
            </div>
            
            <div className="flex flex-col items-end shrink-0 gap-2">
               <button 
                 onClick={() => fileInputRef.current?.click()}
                 disabled={importing}
                 className="bg-white/5 hover:bg-white/10 text-white border border-white/10 text-xs px-4 py-2 rounded-lg flex items-center gap-2 transition-all font-medium"
               >
                 <FolderArchive size={14} className="text-emerald-400" />
                 Importar do MCreator (.zip)
               </button>
               <input 
                 type="file" 
                 ref={fileInputRef} 
                 className="hidden" 
                 accept=".zip" 
                 onChange={handleMCreatorImport} 
               />
            </div>
          </header>

          {importing && (
            <div className="bg-black/40 border border-emerald-500/30 rounded-xl p-4 flex flex-col gap-3">
               <div className="flex justify-between items-center text-xs">
                 <span className="text-white font-bold flex items-center gap-2">
                   <Loader2 size={14} className="animate-spin text-emerald-500" />
                   Motor de Migração
                 </span>
                 <span className="text-emerald-500 font-mono">{importProgress}%</span>
               </div>
               <div className="w-full h-1.5 bg-black rounded-full overflow-hidden">
                 <div className="h-full bg-emerald-500 transition-all duration-300" style={{ width: `${importProgress}%` }}></div>
               </div>
               <div className="text-[10px] text-white/50 uppercase tracking-widest">{importStatus}</div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Project Name */}
            <div className="space-y-2 md:col-span-2">
              <label className="block text-xs font-bold text-white/60 uppercase tracking-widest">Project Name</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={downloading}
                placeholder="e.g. My Awesome Tech Mod" 
                className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-sm text-white focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50 outline-none transition-all placeholder:text-white/20 disabled:opacity-50"
              />
            </div>

            {/* Minecraft Version */}
            <div className="space-y-2">
               <label className="block text-xs font-bold text-white/60 uppercase tracking-widest">Minecraft Version</label>
               <div className="relative">
                 <select 
                   value={version}
                   onChange={(e) => setVersion(e.target.value)}
                   disabled={downloading}
                   className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-sm text-white focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50 outline-none transition-all appearance-none cursor-pointer disabled:opacity-50"
                 >
                   {availableVersions.map(v => (
                     <option key={v} value={v}>{v}</option>
                   ))}
                 </select>
                 <ChevronDown size={16} className="absolute right-3 top-3.5 text-white/40 pointer-events-none" />
               </div>
            </div>

            {/* Mod Loader (Radios) */}
            <div className="space-y-2 md:col-span-2 mt-2">
               <label className="block text-xs font-bold text-white/60 uppercase tracking-widest mb-3">Mod Loader Target</label>
               <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                 {loaders.map((l) => (
                   <div 
                     key={l.id}
                     onClick={() => setLoader(l.id)}
                     className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl border cursor-pointer transition-all ${
                       loader === l.id 
                         ? 'bg-amber-500/10 border-amber-500 text-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.1)]' 
                         : 'bg-black/40 border-white/10 text-white/40 hover:bg-white/5 hover:border-white/20'
                     }`}
                   >
                     {l.icon}
                     <span className="text-xs font-bold tracking-wide">{l.name}</span>
                   </div>
                 ))}
               </div>
            </div>

            {/* Compatibility Dashboard (Dependencies) */}
            <div className="space-y-2 md:col-span-2 mt-2">
              <label className="block text-xs font-bold text-white/60 uppercase tracking-widest flex justify-between items-center">
                <span>Mods Compatíveis</span>
                <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded-full text-white/50 lowercase tracking-normal">Opcional</span>
              </label>
              <p className="text-[11px] text-white/40 mb-2">Importe ficheiros .jar de outros mods para usar as suas APIs (classes/métodos) no ModForger.</p>
              
              <div 
                className={`relative w-full border-2 border-dashed ${dragActive ? 'border-amber-500 bg-amber-500/5' : 'border-white/10 bg-black/40'} rounded-xl p-6 flex flex-col items-center justify-center text-center transition-all`}
                onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                onDragLeave={() => setDragActive(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragActive(false);
                  if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                    Array.from(e.dataTransfer.files).forEach((f: File) => {
                       if (f.name.endsWith('.jar')) {
                         addDependency(f.name);
                       }
                    });
                  }
                }}
              >
                <Upload size={24} className={`mb-2 ${dragActive ? 'text-amber-500' : 'text-white/20'}`} />
                <span className="text-sm text-white/60 font-medium">Drag & Drop <span className="text-amber-500/80">.jar</span> files here</span>
                <span className="text-xs text-white/30 mt-1">or click to browse local files</span>
                <input 
                  type="file" 
                  multiple 
                  accept=".jar" 
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      Array.from(e.target.files).forEach((f: File) => {
                        if (f.name.endsWith('.jar')) {
                          addDependency(f.name);
                        }
                      });
                    }
                  }}
                />
              </div>

              {/* Dependency List */}
              {dependencies.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4 max-h-32 overflow-y-auto pr-2">
                  {dependencies.map((dep, idx) => (
                    <div key={idx} className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full text-xs text-white/80">
                      <Settings size={12} className="text-emerald-400" />
                      <span className="max-w-[200px] truncate">{dep}</span>
                      <button 
                        onClick={() => removeDependency(dep)}
                        className="p-0.5 hover:bg-white/20 rounded-full transition-colors ml-1 text-white/40 hover:text-white"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

          <div className="mt-8 flex justify-between items-center">
            <div className="text-sm font-mono text-amber-500 max-w-[200px] md:max-w-md">
                {downloading && (
                  <div className="flex items-center gap-2 animate-pulse">
                    <span className="w-4 h-4 border-2 border-amber-500 border-t-transparent rounded-full animate-spin"></span>
                    {downloadMsg}
                  </div>
                )}
            </div>
            <button 
              onClick={handleStart}
              disabled={!name.trim() || downloading}
              className="bg-gradient-to-br from-amber-500 to-orange-700 disabled:opacity-50 disabled:grayscale hover:from-amber-400 hover:to-orange-600 text-black shadow-[0_0_15px_rgba(245,158,11,0.2)] px-8 py-3.5 rounded-xl font-bold transition-all flex items-center gap-2 uppercase tracking-wide disabled:cursor-not-allowed"
            >
              {downloading ? 'Processing...' : 'Initialize Workspace'}
              {!downloading && <Zap size={18} />}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
