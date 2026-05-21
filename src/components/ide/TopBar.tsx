import { Play, Code, Bug, Github, FolderOpen } from 'lucide-react';
import { ProjectSettings } from './Launcher';
import { useModStore } from '../../store/modStore';

interface TopBarProps {
  projectSettings?: ProjectSettings;
}

export const TopBar = ({ projectSettings }: TopBarProps) => {
  const rootName = projectSettings?.name ? projectSettings.name.toLowerCase().replace(/\s+/g, '_') : 'mod-root';
  const setProjectSettings = useModStore(state => state.setProjectSettings);

  const handleExportWorkspace = () => {
    const state = useModStore.getState();
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `${projectSettings?.name || 'mod'}_workspace.json`);
    document.body.appendChild(downloadAnchorNode); 
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  return (
    <div className="h-14 bg-[#0F0F13] border-b border-white/10 flex items-center justify-between px-6 text-[#E2E2E9] shrink-0">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => setProjectSettings(null)}
          className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold rounded-md bg-amber-500/10 text-amber-500 border border-amber-500/20 hover:bg-amber-500/20 transition-colors"
          title="Fechar Projeto e Voltar à Página Inicial"
        >
          <FolderOpen size={14} /> Meus Projetos
        </button>
        <button 
          onClick={handleExportWorkspace}
          className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500/20 transition-colors"
          title="Exportar Workspace (.json)"
        >
          Salvar Workspace
        </button>
        <div className="flex bg-white/5 rounded-md overflow-hidden p-1 gap-1 border border-white/5">
          <button className="px-3 py-1 text-xs font-medium rounded bg-white/10 text-white">Visual</button>
          <button className="px-3 py-1 text-xs font-medium rounded hover:bg-white/5 text-white/60 transition-colors">Código Fonte</button>
        </div>
        <span className="text-xs font-medium text-white/40">/ {rootName} / workspace</span>
        
        <div className="flex items-center gap-1.5 ml-4 px-2 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-md">
           <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.5)]"></div>
           <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Alterações guardadas</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button 
          onClick={() => alert("Para abrir no VS Code na AI Studio:\n\n1. Vai ao menu hambúrguer no topo direito da plataforma.\n2. Escolhe 'Export to GitHub' ou 'Export as ZIP'.\n3. Abre no teu VS Code localmente!")}
          className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold rounded-md bg-white/[0.03] border border-white/10 text-white/70 hover:bg-white/10 hover:text-white transition-colors"
          title="Exportar para GitHub / VS Code"
        >
          <Github size={14} className="text-white" />
          Exportar (Git/VSCode)
        </button>
        <button 
          onClick={() => {
            alert("A enviar Representação Intermediária (IR) para o Cloud Server...\n\nA compilar usando Gradle em Sandbox...\n\n(Aviso: Download do mod.jar não implementado em mock)");
          }}
          className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold rounded-md bg-purple-500/10 text-purple-400 border border-purple-500/20 hover:bg-purple-500/20 transition-colors shadow-[0_0_10px_rgba(168,85,247,0.1)]"
        >
          <Code size={14} /> Compilar na Nuvem (.jar)
        </button>
        <button className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold rounded-md bg-white/[0.03] border border-white/10 text-white/70 hover:bg-white/10 hover:text-white transition-colors">
          <Bug size={14} className="text-red-400" />
          Testar
        </button>
        <button className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-colors shadow-[0_0_10px_rgba(16,185,129,0.1)]">
          <Play size={14} fill="currentColor" />
          {projectSettings?.version ? `Rodar MC ${projectSettings.version}` : 'Rodar Minecraft'}
        </button>
      </div>
    </div>
  );
};
