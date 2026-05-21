import { Crosshair, Box, ImageIcon } from 'lucide-react';
import { useState } from 'react';

export const ProjectileEditor = ({ setActiveView }: { setActiveView?: (view: string) => void }) => {
  const [name, setName] = useState('Projétil de Fogo');
  const [damage, setDamage] = useState(5);
  const [gravity, setGravity] = useState(true);
  const [speed, setSpeed] = useState(1.5);
  const [knockback, setKnockback] = useState(1);
  const [fire, setFire] = useState(0);

  return (
    <div className="flex-1 overflow-y-auto p-8 relative flex flex-col items-center bg-[radial-gradient(circle_at_top_right,_#1a1510_0%,_#0A0A0C_60%)]">
      <header className="mb-8 max-w-4xl w-full">
         <h1 className="text-4xl font-extrabold tracking-tighter text-white mb-2 flex items-center gap-3 italic">
           <Crosshair className="text-amber-500 w-8 h-8" />
           Projéteis
         </h1>
         <p className="text-white/40 text-lg font-light">Crie flechas customizadas, bolas de fogo, granadas e armas de longo alcance.</p>
      </header>
      
      <div className="max-w-4xl w-full grid grid-cols-2 gap-6">
        <div className="space-y-6">
            <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                <h3 className="text-white font-bold mb-4 border-b border-white/5 pb-2">Informação Base</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-white/60 mb-1">Nome do Projétil</label>
                    <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-sm text-white focus:border-amber-500 outline-none" />
                  </div>

                  <div className="flex gap-4">
                      <div className="w-full aspect-square bg-black/40 border-2 border-dashed border-white/10 rounded-xl flex items-center justify-center flex-col text-white/30 cursor-pointer hover:border-amber-500/50 hover:bg-amber-500/5 transition-colors group">
                        <ImageIcon size={32} className="mb-2 group-hover:text-amber-500 transition-colors" />
                        <span className="text-xs group-hover:text-amber-200 transition-colors">Textura em Voo</span>
                      </div>
                      <div className="w-full aspect-square bg-black/40 border-2 border-dashed border-white/10 rounded-xl flex items-center justify-center flex-col text-white/30 cursor-pointer hover:border-amber-500/50 hover:bg-amber-500/5 transition-colors group">
                        <Box size={32} className="mb-2 group-hover:text-amber-500 transition-colors" />
                        <span className="text-xs group-hover:text-amber-200 transition-colors">Modelo 3D (Opcional)</span>
                      </div>
                  </div>
                </div>
            </div>
            
            <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                <h3 className="text-white font-bold mb-4 border-b border-white/5 pb-2">Efeitos ao Acertar Dano</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-white/60 mb-1">Duração de Fogo no Alvo (Segundos)</label>
                    <input type="number" min="0" value={fire} onChange={(e) => setFire(Number(e.target.value))} className="w-full bg-black/40 border border-white/10 rounded px-2 py-1.5 text-white focus:border-amber-500 outline-none" placeholder="0" />
                  </div>
                  <div>
                      <label className="block text-xs font-semibold text-white/60 mb-1">Ação Customizada (Lógica)</label>
                      <button className="bg-black/40 border border-white/10 p-2 rounded text-xs text-amber-500 hover:bg-amber-500/10 w-full text-center">+ Adicionar Ação Nodal ao Colidir</button>
                  </div>
                </div>
            </div>
        </div>
        
        <div className="space-y-6">
            <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                <h3 className="text-white font-bold mb-4 border-b border-white/5 pb-2">Física e Combate</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-white/60 mb-1 flex justify-between">
                      <span>Dano Base</span>
                      <span className="text-amber-500">{damage}</span>
                    </label>
                    <input type="range" min="0" max="100" value={damage} onChange={(e) => setDamage(Number(e.target.value))} className="w-full accent-amber-500" />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-semibold text-white/60 mb-1 flex justify-between">
                      <span>Velocidade de Tiro</span>
                      <span className="text-amber-500">{speed}</span>
                    </label>
                    <input type="range" min="0.1" max="5.0" step="0.1" value={speed} onChange={(e) => setSpeed(Number(e.target.value))} className="w-full accent-amber-500" />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-white/60 mb-1 flex justify-between">
                      <span>Knockback (Repulsão)</span>
                      <span className="text-amber-500">{knockback}</span>
                    </label>
                    <input type="range" min="0" max="10" step="1" value={knockback} onChange={(e) => setKnockback(Number(e.target.value))} className="w-full accent-amber-500" />
                  </div>
                  
                  <div className="pt-2">
                    <label className="flex items-center gap-2 text-sm text-white/80 cursor-pointer">
                      <input type="checkbox" checked={gravity} onChange={(e) => setGravity(e.target.checked)} className="accent-amber-500 w-4 h-4 rounded" />
                      Afetado pela Gravidade (Cai com a distância)
                    </label>
                  </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};
