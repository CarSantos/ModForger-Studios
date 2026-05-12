import { LucideIcon, Box, Cuboid, Users, FileJson, Sword, Settings, Zap, Globe, Beaker, LayoutDashboard, Package, Component, Image as ImageIcon, Crosshair, Sparkles, Wand2 } from 'lucide-react';
import { ProjectSettings } from './Launcher';

interface SidebarProps {
  projectSettings?: ProjectSettings;
  activeView: string;
  setActiveView: (view: string) => void;
}

export const Sidebar = ({ projectSettings, activeView, setActiveView }: SidebarProps) => {
  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard },
    { name: 'Blocos', icon: Cuboid },
    { name: 'Itens', icon: Sword },
    { name: 'Projéteis', icon: Crosshair },
    { name: 'Entidades', icon: Users },
    { name: 'Loots', icon: Package },
    { name: 'Mundo', icon: Globe },
    { name: 'Encantamentos', icon: Wand2 },
    { name: 'Efeitos', icon: Sparkles },
    { name: 'Modelos', icon: Box },
    { name: 'Texturas', icon: ImageIcon },
    { name: 'Receitas', icon: FileJson },
    { name: 'Lógica (Nodos)', icon: Component },
    { name: 'Sistemas Custom', icon: Beaker },
    { name: 'Configurações do Projeto', icon: Settings },
  ];

  return (
    <div className="w-64 border-r border-white/5 bg-[#0D0D11] p-4 flex flex-col gap-4 text-[#E2E2E9] h-full">
      <div className="flex items-center gap-3 pb-4 border-b border-white/10 shrink-0">
        <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-700 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(245,158,11,0.3)]">
          <Zap size={20} className="text-black" />
        </div>
        <h1 className="font-bold text-lg tracking-tight">ModForger <span className="text-amber-500">Studios</span></h1>
      </div>
      
      <div className="flex flex-col gap-1 text-sm text-white/70 mb-4 px-2">
         {projectSettings && (
           <>
             <div className="text-[10px] font-bold text-white/30 uppercase tracking-widest mt-1 mb-2">Workspace Info</div>
             <div className="flex items-center justify-between">
                <span className="text-xs text-white/50">Loader</span>
                <span className="text-[10px] bg-amber-500/10 text-amber-500 px-2 py-0.5 rounded capitalize">{projectSettings.loader}</span>
             </div>
             <div className="flex items-center justify-between">
                <span className="text-xs text-white/50">Version</span>
                <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded">{projectSettings.version}</span>
             </div>
             <div className="flex flex-col mt-2">
                <span className="text-xs text-white/50 mb-1">Deps (Jars)</span>
                {projectSettings.dependencies.length > 0 ? (
                  <span className="text-[10px] text-white/40 truncate">{projectSettings.dependencies.length} loaded</span>
                ) : (
                  <span className="text-[10px] text-red-400/80">None</span>
                )}
             </div>
           </>
         )}
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="px-2 text-[10px] font-bold text-white/30 uppercase tracking-widest mb-2">
          Project Structure
        </div>
        <nav className="space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.name}
              onClick={() => setActiveView(item.name)}
              className={`flex items-center gap-3 w-full px-2 py-1.5 text-sm rounded transition-colors text-left group ${
                activeView === item.name 
                  ? 'bg-amber-500/10 text-amber-500 font-medium' 
                  : 'text-white/70 hover:bg-white/5 hover:text-amber-400'
              }`}
            >
              <item.icon size={16} className={activeView === item.name ? 'text-amber-500' : 'text-white/40 group-hover:text-amber-500'} />
              {item.name}
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-auto pt-4 border-t border-white/10">
        <button className="flex items-center justify-center gap-2 w-full bg-gradient-to-br from-amber-500 to-orange-700 hover:from-amber-400 hover:to-orange-600 shadow-[0_0_15px_rgba(245,158,11,0.2)] text-black py-2 rounded font-bold transition-all text-sm uppercase tracking-wider">
          Exportar Mod
        </button>
      </div>
    </div>
  );
};
