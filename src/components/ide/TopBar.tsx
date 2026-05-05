import { Play, Code, Bug, Github } from 'lucide-react';
import { ProjectSettings } from './Launcher';

interface TopBarProps {
  projectSettings?: ProjectSettings;
}

export const TopBar = ({ projectSettings }: TopBarProps) => {
  const rootName = projectSettings?.name ? projectSettings.name.toLowerCase().replace(/\s+/g, '_') : 'mod-root';

  return (
    <div className="h-14 bg-[#0F0F13] border-b border-white/10 flex items-center justify-between px-6 text-[#E2E2E9] shrink-0">
      <div className="flex items-center gap-4">
        <div className="flex bg-white/5 rounded-md overflow-hidden p-1 gap-1 border border-white/5">
          <button className="px-3 py-1 text-xs font-medium rounded bg-white/10 text-white">Visual</button>
          <button className="px-3 py-1 text-xs font-medium rounded hover:bg-white/5 text-white/60 transition-colors">Código Fonte</button>
        </div>
        <span className="text-xs font-medium text-white/40">/ {rootName} / src / <span className="text-white/80">SuperMinério.json</span></span>
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
