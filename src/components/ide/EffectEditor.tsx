import { Sparkles, Image as ImageIcon } from 'lucide-react';
import { useState } from 'react';

export const EffectEditor = ({ setActiveView }: { setActiveView?: (view: string) => void }) => {
  const [name, setName] = useState('Doença da Radiação');
  const [color, setColor] = useState('#a3ff00');
  const [isBeneficial, setIsBeneficial] = useState(false);
  const [isInstant, setIsInstant] = useState(false);

  return (
    <div className="flex-1 overflow-y-auto p-8 relative flex flex-col items-center bg-[radial-gradient(circle_at_top_right,_#1a1510_0%,_#0A0A0C_60%)]">
      <header className="mb-8 max-w-4xl w-full">
         <h1 className="text-4xl font-extrabold tracking-tighter text-white mb-2 flex items-center gap-3 italic">
           <Sparkles className="text-amber-500 w-8 h-8" />
           Efeitos de Poção / Status
         </h1>
         <p className="text-white/40 text-lg font-light">Crie efeitos customizados estilo Poison, Speed, Regeneration ou algo novo.</p>
      </header>
      
      <div className="max-w-4xl w-full grid grid-cols-2 gap-6">
        <div className="space-y-6">
            <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                <h3 className="text-white font-bold mb-4 border-b border-white/5 pb-2">Informação Base</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-white/60 mb-1">Nome do Efeito</label>
                    <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-sm text-white focus:border-amber-500 outline-none" />
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="flex-1 space-y-1">
                      <label className="block text-xs font-semibold text-white/60">Cor das Partículas</label>
                      <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="w-full h-10 rounded shrink-0 bg-transparent cursor-pointer" />
                    </div>
                  </div>

                  <div>
                     <label className="block text-xs font-semibold text-white/60 mb-1">Ícone no HUD</label>
                     <div className="w-20 h-20 bg-black/40 border-2 border-dashed border-white/10 rounded-lg flex items-center justify-center flex-col text-white/30 cursor-pointer hover:border-amber-500/50 hover:bg-amber-500/5 transition-colors group">
                        <ImageIcon size={24} className="group-hover:text-amber-500 transition-colors" />
                     </div>
                  </div>
                </div>
            </div>
        </div>
        
        <div className="space-y-6">
            <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                <h3 className="text-white font-bold mb-4 border-b border-white/5 pb-2">Comportamento</h3>
                <div className="space-y-4">
                    <div>
                        <label className="block text-xs font-semibold text-white/60 mb-2">Tipo de Efeito</label>
                        <div className="flex gap-2">
                           <button onClick={() => setIsBeneficial(true)} className={`flex-1 py-2 text-xs font-bold rounded border ${isBeneficial ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400' : 'bg-black/40 border-white/10 text-white/50 hover:bg-white/5'}`}>Positivo (Buff)</button>
                           <button onClick={() => setIsBeneficial(false)} className={`flex-1 py-2 text-xs font-bold rounded border ${!isBeneficial ? 'bg-red-500/20 border-red-500/50 text-red-400' : 'bg-black/40 border-white/10 text-white/50 hover:bg-white/5'}`}>Negativo (Maldição)</button>
                        </div>
                    </div>
                    <label className="flex items-center gap-2 text-sm text-white/80 cursor-pointer mt-4">
                      <input type="checkbox" checked={isInstant} onChange={(e) => setIsInstant(e.target.checked)} className="accent-amber-500 w-4 h-4 rounded" />
                      É Instantâneo (Como Cura ou Dano Direto)
                    </label>
                </div>
            </div>

            <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                <h3 className="text-white font-bold mb-4 border-b border-white/5 pb-2">Lógica do Efeito</h3>
                <div className="space-y-4">
                  <div className="text-xs text-white/50 italic mb-2">Execute lógica customizada usando nodos.</div>
                  <button onClick={() => setActiveView && setActiveView('Lógica (Nodos)')} className="bg-gradient-to-r from-teal-500/20 to-blue-500/20 text-blue-300 border border-blue-500/30 p-2 rounded-lg text-sm font-bold transition-colors w-full hover:bg-blue-500/20 flex items-center justify-center gap-2">
                    <Sparkles size={16} /> Configurar Lógica (Nodos)
                  </button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};
