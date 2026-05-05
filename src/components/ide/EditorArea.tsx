import { FileCode2, Sparkles, Box } from 'lucide-react';

export const EditorArea = () => {
  return (
    <div className="flex-1 bg-[radial-gradient(circle_at_top_right,_#1a1510_0%,_#0A0A0C_60%)] flex flex-col relative overflow-hidden">
      {/* Editor Content Simulation */}
      <div className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          <header className="mb-8">
            <h1 className="text-4xl font-extrabold tracking-tighter text-white mb-2 flex items-center gap-3 italic">
              <Sparkles className="text-amber-500 w-8 h-8" />
              Super Minério
            </h1>
            <p className="text-white/40 text-lg max-w-2xl font-light italic">Configuração visual do seu novo bloco.</p>
          </header>

          <div className="grid grid-cols-2 gap-6">
            {/* Propriedades Básicas */}
            <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 backdrop-blur-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5">
                <Box size={96} />
              </div>
              <h3 className="text-white font-bold mb-4 border-b border-white/5 pb-2 relative z-10">Propriedades Gerais</h3>
              <div className="space-y-4 relative z-10">
                <div>
                  <label className="block text-xs font-semibold text-white/60 mb-1">Nome no Jogo</label>
                  <input type="text" defaultValue="Super Minério" className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-sm text-white focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50 outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-white/60 mb-1">ID (Namespace)</label>
                  <input type="text" defaultValue="super_minerio" className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-sm text-white/50 focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50 outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-white/60 mb-1">Dureza (Hardness)</label>
                  <input type="number" defaultValue="3.0" className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-sm text-white focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50 outline-none transition-all" />
                </div>
              </div>
            </div>

            {/* Modelos e Texturas */}
            <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 backdrop-blur-sm relative overflow-hidden flex flex-col">
              <h3 className="text-white font-bold mb-4 border-b border-white/5 pb-2 flex items-center justify-between">
                Modelo Gráfico
                <span className="bg-amber-500/10 text-amber-500 border border-amber-500/20 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">via Blockbench</span>
              </h3>
              
              <div className="flex-1 rounded-xl bg-black/40 border border-dashed border-white/10 flex flex-col items-center justify-center text-white/40 hover:border-amber-500/50 hover:bg-amber-500/5 transition-all cursor-pointer group">
                <Box size={48} className="mb-3 text-white/20 group-hover:text-amber-500 transition-colors" />
                <span className="text-sm font-medium group-hover:text-amber-100 transition-colors">Arrastar arquivo .bbmodel</span>
                <span className="text-xs opacity-60 mt-1">ou clique para importar</span>
              </div>
            </div>
            
            {/* Assistente de IA */}
            <div className="col-span-2 bg-gradient-to-r from-amber-900/10 to-black/40 border border-amber-500/20 rounded-2xl p-6 shadow-[0_0_15px_rgba(245,158,11,0.03)] relative overflow-hidden backdrop-blur-sm">
              <h3 className="text-amber-500 font-bold mb-2 flex items-center gap-2 text-lg">
                <Sparkles size={18} />
                Forge AI Assistant
              </h3>
              <p className="text-sm text-white/60 mb-5 font-light">Descreva o comportamento ou lote que deseja para este minério, e a IA gerará o código Rust/Java necessário para a mecânica.</p>
              
              <div className="flex gap-3">
                <input 
                  type="text" 
                  placeholder="Ex: 'Ao quebrar este minério com uma picareta, quero que solte pó mágico com partículas brilhantes e dê levitação por 3 segundos...'" 
                  className="flex-1 bg-black/60 border border-white/10 rounded-xl p-3.5 text-sm text-white focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50 outline-none transition-all placeholder:text-white/20"
                />
                <button className="bg-gradient-to-br from-amber-500 to-orange-700 hover:from-amber-400 hover:to-orange-600 text-black shadow-[0_0_15px_rgba(245,158,11,0.2)] px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2">
                  <FileCode2 size={16} />
                  Gerar Lógica
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
      
      {/* Bottom Panel (Logs/Output) */}
      <div className="h-48 border-t border-white/10 bg-black/40 flex flex-col shrink-0">
        <div className="bg-[#0F0F13] px-6 py-2 flex items-center gap-6 text-[10px] font-bold uppercase tracking-widest text-white/30 border-b border-white/5">
          <span className="text-amber-500 border-b-2 border-amber-500 pb-2 translate-y-[9px]">Terminal</span>
          <span className="hover:text-white/70 cursor-pointer transition-colors pb-2 translate-y-[9px] border-b-2 border-transparent">Compilação (Rust)</span>
          <span className="hover:text-white/70 cursor-pointer transition-colors pb-2 translate-y-[9px] border-b-2 border-transparent">Status do Forge/Fabric</span>
        </div>
        <div className="p-4 px-6 font-mono text-[11px] leading-tight text-white/50 overflow-y-auto space-y-1.5 bg-black/40 h-full">
          <div className="flex gap-2 mb-3">
            <div className="w-2 h-2 rounded-full bg-red-500/50"></div>
            <div className="w-2 h-2 rounded-full bg-amber-500/50"></div>
            <div className="w-2 h-2 rounded-full bg-emerald-500/50"></div>
            <span className="ml-2 text-[9px] opacity-70 uppercase tracking-widest text-white/40">System Debug Console</span>
          </div>
          <div className="text-blue-400">[INFO] Initializing ModForger Core Environment...</div>
          <div className="text-emerald-400 italic">[OK] Rust Toolchain detected (rustc 1.76.0)</div>
          <div className="text-emerald-400 italic">[OK] ModForger Engine Servidor local iniciado na porta 3000.</div>
          <div className="text-white/50">[Rust Bridge] Aguardando compilação de assets...</div>
          <div className="text-amber-400 italic">[Blockbench] Módulo 3D carregado com sucesso.</div>
          <div className="flex items-center gap-1 mt-2 text-white animate-pulse">
            _
          </div>
        </div>
      </div>
    </div>
  );
};
