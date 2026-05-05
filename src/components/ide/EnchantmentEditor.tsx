import { Wand2 } from 'lucide-react';
import { useState } from 'react';

export const EnchantmentEditor = ({ setActiveView }: { setActiveView?: (view: string) => void }) => {
  const [name, setName] = useState('Golpe Congelante');
  const [maxLevel, setMaxLevel] = useState(3);
  const [rarity, setRarity] = useState('uncommon');
  const [isTreasure, setIsTreasure] = useState(false);
  const [isCurse, setIsCurse] = useState(false);

  return (
    <div className="flex-1 overflow-y-auto p-8 relative flex flex-col items-center bg-[radial-gradient(circle_at_top_right,_#1a1510_0%,_#0A0A0C_60%)]">
      <header className="mb-8 max-w-4xl w-full">
         <h1 className="text-4xl font-extrabold tracking-tighter text-white mb-2 flex items-center gap-3 italic">
           <Wand2 className="text-amber-500 w-8 h-8" />
           Encantamentos
         </h1>
         <p className="text-white/40 text-lg font-light">Crie encantamentos para ferramentas, armas e armaduras.</p>
      </header>
      
      <div className="max-w-4xl w-full grid grid-cols-2 gap-6">
        <div className="space-y-6">
            <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                <h3 className="text-white font-bold mb-4 border-b border-white/5 pb-2">Detalhes</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-white/60 mb-1">Nome</label>
                    <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-sm text-white focus:border-amber-500 outline-none" />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-semibold text-white/60 mb-1">Raridade</label>
                    <select value={rarity} onChange={e => setRarity(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-sm text-white focus:border-amber-500 outline-none cursor-pointer">
                      <option value="common">Comum</option>
                      <option value="uncommon">Incomum</option>
                      <option value="rare">Raro</option>
                      <option value="very_rare">Muito Raro</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-semibold text-white/60 mb-1 flex justify-between">
                      <span>Nível Máximo</span>
                      <span className="text-amber-500">{maxLevel}</span>
                    </label>
                    <input type="range" min="1" max="10" value={maxLevel} onChange={(e) => setMaxLevel(Number(e.target.value))} className="w-full accent-amber-500" />
                  </div>
                </div>
            </div>
            
            <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                <h3 className="text-white font-bold mb-4 border-b border-white/5 pb-2">Propriedades Especiais</h3>
                <div className="space-y-3">
                    <label className="flex items-center gap-2 text-sm text-white/80 cursor-pointer">
                      <input type="checkbox" checked={isTreasure} onChange={(e) => setIsTreasure(e.target.checked)} className="accent-amber-500 w-4 h-4 rounded" />
                      É Tesouro (Não aparece na mesa de encantamentos, só chests/villagers)
                    </label>
                    <label className="flex items-center gap-2 text-sm text-red-300 cursor-pointer">
                      <input type="checkbox" checked={isCurse} onChange={(e) => setIsCurse(e.target.checked)} className="accent-red-500 w-4 h-4 rounded" />
                      É Maldição (Nome a vermelho, não pode ser removido facilmente)
                    </label>
                </div>
            </div>
        </div>
        
        <div className="space-y-6">
            <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                <h3 className="text-white font-bold mb-4 border-b border-white/5 pb-2">Sinergia e Compatibilidade</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-white/60 mb-1">Para que tipo de item?</label>
                    <select className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-sm text-white focus:border-amber-500 outline-none cursor-pointer">
                      <option value="weapon">Armas (Espadas/Machados)</option>
                      <option value="armor">Armadura Global</option>
                      <option value="armor_head">Apenas Capacetes</option>
                      <option value="armor_chest">Apenas Peitorais</option>
                      <option value="armor_legs">Apenas Calças</option>
                      <option value="armor_feet">Apenas Botas</option>
                      <option value="digger">Ferramentas de Mineração (Pick/Shovel)</option>
                      <option value="bow">Arcos/Bestas</option>
                      <option value="fishing_rod">Varas de Pesca</option>
                      <option value="breakable">Qualquer item que perca durabilidade</option>
                    </select>
                  </div>
                </div>
            </div>

            <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                <h3 className="text-white font-bold mb-4 border-b border-white/5 pb-2">Lógica do Encantamento</h3>
                <div className="space-y-4">
                  <div className="text-xs text-white/50 italic mb-2">Configure o que este encantamento faz através de Eventos de Nodos.</div>
                  <button onClick={() => setActiveView && setActiveView('Lógica (Nodos)')} className="bg-gradient-to-r from-teal-500/20 to-blue-500/20 text-blue-300 border border-blue-500/30 p-2 rounded-lg text-xs font-bold transition-colors w-full hover:bg-blue-500/20">
                    <Wand2 className="inline-block mr-2" size={14} /> Abrir Lógica Avançada (Nodos)
                  </button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};
