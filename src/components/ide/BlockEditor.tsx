import { FileCode2, Sparkles, Box, Droplet, Zap, Star, Shield, Image as ImageIcon } from 'lucide-react';
import { useState } from 'react';

export const BlockEditor = ({ setActiveView }: { setActiveView?: (view: string) => void }) => {
  const [textureFront, setTextureFront] = useState<string | null>(null);
  const [stackSize, setStackSize] = useState(64);
  const [drops, setDrops] = useState([{ item: 'super_minerio', min: 1, max: 1, chance: 100, condition: 'always' }]);
  const [hardness, setHardness] = useState(3.0);
  const [blastResistance, setBlastResistance] = useState(3.0);
  const [effectType, setEffectType] = useState('none');
  const [effectTrigger, setEffectTrigger] = useState('step'); // step or proximity
  const [effectRadius, setEffectRadius] = useState(3);
  const [enchantability, setEnchantability] = useState(0);

  const addDrop = () => {
    setDrops([...drops, { item: 'minecraft:cobblestone', min: 1, max: 1, chance: 100, condition: 'always' }]);
  };

  return (
    <div className="flex-1 bg-[radial-gradient(circle_at_top_right,_#1a1510_0%,_#0A0A0C_60%)] flex flex-col relative overflow-hidden">
      <div className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-5xl mx-auto">
          <header className="mb-8">
            <h1 className="text-4xl font-extrabold tracking-tighter text-white mb-2 flex items-center gap-3 italic">
              <CuboidIcon className="text-amber-500 w-8 h-8" />
              Kit Completo do Bloco
            </h1>
            <p className="text-white/40 text-lg max-w-2xl font-light">Configuração exaustiva das propriedades do bloco.</p>
          </header>

          <div className="grid grid-cols-3 gap-6">
            {/* Esquerda: Básico & Visual */}
            <div className="col-span-1 space-y-6">
              <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                 <h3 className="text-white font-bold mb-4 border-b border-white/5 pb-2">Informações Gerais</h3>
                 <div className="space-y-4">
                   <div>
                     <label className="block text-xs font-semibold text-white/60 mb-1">Nome no Jogo</label>
                     <input type="text" defaultValue="Super Minério" className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-sm text-white focus:border-amber-500 outline-none transition-all" />
                   </div>
                   <div>
                     <label className="block text-xs font-semibold text-white/60 mb-1">Namespace ID</label>
                     <input type="text" defaultValue="super_minerio" className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-sm text-white/50 focus:border-amber-500 outline-none transition-all" />
                   </div>
                 </div>
              </div>

              <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                <h3 className="text-white font-bold mb-4 border-b border-white/5 pb-2">Texturas & Modelo</h3>
                <div 
                  className="w-full aspect-square bg-black/40 border-2 border-dashed border-white/10 rounded-xl flex items-center justify-center flex-col text-white/30 cursor-pointer hover:border-amber-500/50 hover:bg-amber-500/5 transition-colors group"
                  onClick={() => setActiveView && setActiveView('Texturas')}
                >
                  <ImageIcon size={48} className="mb-2 group-hover:text-amber-500 transition-colors" />
                  <span className="text-xs group-hover:text-amber-200 transition-colors text-center w-3/4">Arraste textura, ou clique aqui para <br/>abrir o <b>Criador de Texturas</b></span>
                </div>
              </div>
            </div>

            {/* Meio: Propriedades Físicas */}
            <div className="col-span-1 space-y-6">
              <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                 <h3 className="text-white font-bold mb-4 border-b border-white/5 pb-2">Física e Combate</h3>
                 <div className="space-y-4">
                   <div>
                     <label className="block text-xs font-semibold text-white/60 mb-1">Dureza (Tempo para quebrar)</label>
                     <input type="number" step="0.1" value={hardness} onChange={e => setHardness(Number(e.target.value))} className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-sm text-white focus:border-amber-500 outline-none" />
                   </div>
                   <div>
                     <label className="block text-xs font-semibold text-white/60 mb-1">Resistência a Explosões</label>
                     <input type="number" step="0.1" value={blastResistance} onChange={e => setBlastResistance(Number(e.target.value))} className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-sm text-white focus:border-amber-500 outline-none" />
                   </div>
                   <div>
                     <label className="block text-xs font-semibold text-white/60 mb-1 flex items-center gap-2"><Star size={12}/> Nível de Encantamento</label>
                     <input type="number" value={enchantability} onChange={e => setEnchantability(Number(e.target.value))} className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-sm text-white focus:border-amber-500 outline-none" />
                   </div>
                   <div>
                     <label className="block text-xs font-semibold text-white/60 mb-1">Tamanho Máx. do Stack</label>
                     <select value={stackSize} onChange={e => setStackSize(Number(e.target.value))} className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-sm text-white focus:border-amber-500 outline-none cursor-pointer">
                       <option value={64}>64 (Padrão)</option>
                       <option value={16}>16 (Bolas de neve, ender pearls)</option>
                       <option value={1}>1 (Ferramentas, armaduras)</option>
                     </select>
                   </div>
                 </div>
              </div>
            </div>

            {/* Direita: Eventos & Drops */}
            <div className="col-span-1 space-y-6">
              <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                 <div className="flex justify-between items-center mb-4 border-b border-white/5 pb-2">
                    <h3 className="text-white font-bold">Loot (Drops do Bloco)</h3>
                    <button onClick={addDrop} className="bg-amber-500/10 text-amber-500 px-2 py-1 rounded text-xs font-bold hover:bg-amber-500/20 transition-colors">+ Drop</button>
                 </div>
                 <div className="space-y-4 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                   {drops.map((drop, idx) => (
                     <div key={idx} className="bg-black/40 border border-white/5 rounded-lg p-3 space-y-2 relative">
                        <button onClick={() => setDrops(drops.filter((_, i) => i !== idx))} className="absolute top-2 right-2 text-white/20 hover:text-red-400 text-xs">⨯ Remover</button>
                        <div>
                          <label className="block text-[10px] font-semibold text-white/60 mb-1">Item a Dropar</label>
                          <input type="text" value={drop.item} onChange={e => {
                            const newDrops = [...drops]; newDrops[idx].item = e.target.value; setDrops(newDrops);
                          }} className="w-full bg-black/40 border border-white/10 rounded px-2 py-1 text-xs text-white focus:border-amber-500 outline-none" />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[10px] font-semibold text-white/60 mb-1">Qtd Mín/Máx</label>
                            <div className="flex gap-1">
                               <input type="number" min="0" value={drop.min} onChange={e => {
                                 const newDrops = [...drops]; newDrops[idx].min = Number(e.target.value); setDrops(newDrops);
                               }} className="w-full bg-black/40 border border-white/10 rounded px-2 py-1 text-xs text-white focus:border-amber-500 outline-none" />
                               <span className="text-white/30 flex items-center">-</span>
                               <input type="number" min="0" value={drop.max} onChange={e => {
                                 const newDrops = [...drops]; newDrops[idx].max = Number(e.target.value); setDrops(newDrops);
                               }} className="w-full bg-black/40 border border-white/10 rounded px-2 py-1 text-xs text-white focus:border-amber-500 outline-none" />
                            </div>
                          </div>
                          <div>
                            <label className="block text-[10px] font-semibold text-white/60 mb-1">Chance (%)</label>
                            <input type="number" min="0" max="100" value={drop.chance} onChange={e => {
                                 const newDrops = [...drops]; newDrops[idx].chance = Number(e.target.value); setDrops(newDrops);
                            }} className="w-full bg-black/40 border border-white/10 rounded px-2 py-1 text-xs text-white focus:border-amber-500 outline-none" />
                          </div>
                        </div>
                        <div>
                          <label className="block text-[10px] font-semibold text-white/60 mb-1">Condição</label>
                          <select value={drop.condition} onChange={e => {
                             const newDrops = [...drops]; newDrops[idx].condition = e.target.value; setDrops(newDrops);
                          }} className="w-full bg-black/40 border border-white/10 rounded px-2 py-1 text-xs text-white focus:border-amber-500 outline-none cursor-pointer">
                            <option value="always">Sempre dropa</option>
                            <option value="right_tool">Apenas com ferramenta certa</option>
                            <option value="silk_touch">Apenas com Toque Suave (Silk Touch)</option>
                            <option value="no_silk_touch">Apenas SEM Toque Suave</option>
                            <option value="player_kill">Apenas quebrado pelo Player</option>
                            <option value="custom_node">Lógica Customizada (Abrir Nodos)</option>
                          </select>
                        </div>
                     </div>
                   ))}
                   {drops.length === 0 && <p className="text-xs text-white/40 text-center py-4">Este bloco não dropa nada (Ex: Vidro).</p>}
                 </div>
              </div>

              <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 backdrop-blur-sm mt-6">
                 <h3 className="text-white font-bold mb-4 border-b border-white/5 pb-2">Efeitos Passivos (Auras)</h3>
                 <div className="space-y-4">
                   <div>
                     <label className="block text-xs font-semibold text-white/60 mb-1 flex items-center gap-2"><Zap size={12}/> Tipo de Ativação</label>
                     <div className="flex gap-4 mt-2">
                       <label className="flex items-center gap-2 text-sm text-white/80 cursor-pointer">
                          <input type="radio" name="trigger" value="step" checked={effectTrigger === 'step'} onChange={(e) => setEffectTrigger(e.target.value)} className="accent-amber-500" />
                          Pisando
                       </label>
                       <label className="flex items-center gap-2 text-sm text-white/80 cursor-pointer">
                          <input type="radio" name="trigger" value="proximity" checked={effectTrigger === 'proximity'} onChange={(e) => setEffectTrigger(e.target.value)} className="accent-amber-500" />
                          Proximidade (Raio Mágico/Magnético)
                       </label>
                     </div>
                   </div>

                   {effectTrigger === 'proximity' && (
                     <div>
                       <label className="block text-xs font-semibold text-white/60 mb-1">Raio de Ação (Blocos)</label>
                       <input type="range" min="1" max="15" value={effectRadius} onChange={(e) => setEffectRadius(Number(e.target.value))} className="w-full accent-amber-500" />
                       <p className="text-right text-xs text-amber-500 font-mono mt-1">{effectRadius} Blocos</p>
                     </div>
                   )}

                   <div>
                     <label className="block text-xs font-semibold text-white/60 mb-1">Efeito Causado</label>
                     <select value={effectType} onChange={e => setEffectType(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-sm text-white focus:border-amber-500 outline-none cursor-pointer">
                       <option value="none">Nenhum</option>
                       <option value="damage">Dano Ígneo/Queimadura (Como Magma)</option>
                       <option value="slowness">Lentidão (Como Areia das Almas, Teia)</option>
                       <option value="speed">Velocidade (Caminho Esguio)</option>
                       <option value="bounce">Pulo/Trampolim (Como Slime/Cama)</option>
                       <option value="magnet">Magnético (Atrai itens no raio)</option>
                       <option value="custom">Ação Customizada (Lógica Nodal)</option>
                     </select>
                   </div>
                   
                   {effectType === 'custom' && (
                     <div className="mt-4">
                       <label className="block text-xs font-semibold text-white/50 mb-2 uppercase tracking-widest">Ação Customizada (Lógica)</label>
                       <button onClick={() => setActiveView && setActiveView('Lógica (Nodos)')} className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-sm font-bold text-amber-500 hover:bg-amber-500/10 transition-colors flex items-center justify-center gap-2">
                          + Adicionar Ação Nodal ao {effectTrigger === 'proximity' ? 'Entrar no Raio' : 'Colidir/Pisar'}
                       </button>
                     </div>
                   )}
                 </div>
              </div>
            </div>
            
            <div className="col-span-3 bg-gradient-to-r from-amber-900/10 to-black/40 border border-amber-500/20 rounded-2xl p-6 shadow-[0_0_15px_rgba(245,158,11,0.03)] relative overflow-hidden backdrop-blur-sm">
              <h3 className="text-amber-500 font-bold mb-2 flex items-center gap-2 text-lg">
                <Sparkles size={18} />
                Gerador Mágico de Bloco (IA)
              </h3>
              <p className="text-sm text-white/60 mb-5 font-light">Descreva o bloco e nós preenchemos todos os campos e geramos texturas!</p>
              
              <div className="flex gap-3">
                <input 
                  type="text" 
                  placeholder="Ex: 'Um bloco de cristal que dropa fragmentos, brilha no escuro, é duro como obsidiana e aumenta a velocidade do jogador que pisa...'" 
                  className="flex-1 bg-black/60 border border-white/10 rounded-xl p-3.5 text-sm text-white focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50 outline-none transition-all placeholder:text-white/20"
                />
                <button className="bg-gradient-to-br from-amber-500 to-orange-700 hover:from-amber-400 hover:to-orange-600 text-black shadow-[0_0_15px_rgba(245,158,11,0.2)] px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2">
                  <FileCode2 size={16} />
                  Gerar Bloco Completo
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
      
      {/* Bottom Panel */}
      <div className="h-48 border-t border-white/10 bg-black/40 flex flex-col shrink-0">
         {/* Mesma console visual do anterior */}
         <div className="p-4 px-6 font-mono text-[11px] leading-tight text-white/50 overflow-y-auto space-y-1.5 bg-black/40 h-full">
          <div className="flex gap-2 mb-3">
            <div className="w-2 h-2 rounded-full bg-red-500/50"></div>
            <div className="w-2 h-2 rounded-full bg-amber-500/50"></div>
            <div className="w-2 h-2 rounded-full bg-emerald-500/50"></div>
            <span className="ml-2 text-[9px] opacity-70 uppercase tracking-widest text-white/40">System Debug Console</span>
          </div>
          <div className="text-emerald-400 italic">[OK] Propriedades do bloco sincronizadas.</div>
        </div>
      </div>
    </div>
  );
};
function CuboidIcon(props: any) {
  return <Box {...props} />;
}
