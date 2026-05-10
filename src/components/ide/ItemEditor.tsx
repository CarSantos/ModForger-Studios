import { Sword, Shield, Pickaxe, Image as ImageIcon, Plus, Box } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useModStore } from '../../store/modStore';
import { ItemIR } from '../../types/ir';

export const ItemEditor = () => {
  const store = useModStore();
  const setActiveView = useModStore(state => state.setActiveView);
  const [activeItem, setActiveItem] = useState<ItemIR | null>(null);

  useEffect(() => {
    if (store.activeElementId && store.activeElementType === 'item') {
      const found = store.items.find(i => i.id === store.activeElementId);
      if (found) setActiveItem(found);
    } else if (store.items.length > 0) {
      setActiveItem(store.items[0]);
    }
  }, [store.activeElementId, store.activeElementType, store.items]);

  const updateItem = (updates: Partial<ItemIR>) => {
    if (!activeItem) return;
    store.updateItem(activeItem.id, updates);
  };

  if (!activeItem) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-[radial-gradient(circle_at_top_right,_#1a1510_0%,_#0A0A0C_60%)] relative">
        <Sword className="text-white/20 w-16 h-16 mb-4" />
        <p className="text-white/50 mb-4">Nenhum Item selecionado ou criado.</p>
      </div>
    );
  }

  // Helper values handling complex IR types gracefully
  const isFood = activeItem.type === 'food';
  const isWeapon = ['sword', 'axe'].includes(activeItem.type);
  const isTool = ['pickaxe', 'axe', 'shovel', 'hoe'].includes(activeItem.type);
  const isArmor = activeItem.type === 'armor';
  const isShield = activeItem.type === 'shield';

  return (
    <div className="flex-1 bg-[radial-gradient(circle_at_top_right,_#1a1510_0%,_#0A0A0C_60%)] flex relative overflow-hidden">
      <div className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-5xl mx-auto space-y-6">
           <header className="mb-8">
            <h1 className="text-4xl font-extrabold tracking-tighter text-white mb-2 flex items-center gap-3 italic">
              <Sword className="text-amber-500 w-8 h-8" />
              Construtor de Itens
            </h1>
            <p className="text-white/40 text-lg font-light">Ferramentas, armas, armaduras e itens normais.</p>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="col-span-1 space-y-6">
               {/* 3D Preview */}
               <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 backdrop-blur-sm relative overflow-hidden flex flex-col items-center justify-center aspect-square group">
                  <h3 className="absolute top-4 left-4 text-white/50 font-bold text-xs uppercase tracking-widest z-10 font-mono">Preview 3D</h3>
                  <div className="w-24 h-24 bg-gradient-to-br from-amber-500/20 to-orange-700/20 border border-amber-500/30 shadow-[0_0_50px_rgba(245,158,11,0.15)] flex items-center justify-center rotate-x-12 rotate-y-12 rounded-lg transform transition-transform duration-500 group-hover:rotate-x-12 group-hover:-rotate-y-180">
                     <ImageIcon size={32} className="text-amber-500/50" />
                  </div>
                  <p className="absolute bottom-4 text-[10px] text-white/30 text-center w-full">Clique e arraste para rotacionar (Em Breve)</p>
               </div>

               <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                  <h3 className="text-white font-bold mb-4 border-b border-white/5 pb-2">Configuração Base</h3>
                  <div className="space-y-4">
                     <div>
                       <label className="block text-xs font-semibold text-white/60 mb-1">Nome Principal</label>
                       <input type="text" value={activeItem.displayName} onChange={e => updateItem({ displayName: e.target.value })} className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-sm text-white focus:border-amber-500 outline-none mb-2" />
                       <label className="block text-xs font-semibold text-white/60 mb-1">Registry</label>
                       <input type="text" value={activeItem.registryName} onChange={e => updateItem({ registryName: e.target.value })} className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-sm text-white focus:border-amber-500 outline-none mb-2" />
                       <label className="block text-xs font-semibold text-white/60 mb-1">Tipo</label>
                       <select value={activeItem.type} onChange={e => updateItem({ type: e.target.value as any })} className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-sm text-white focus:border-amber-500 outline-none cursor-pointer mb-2">
                          <option value="item">Item Normal / Material</option>
                          <option value="sword">Espada</option>
                          <option value="pickaxe">Picareta</option>
                          <option value="axe">Machado</option>
                          <option value="shovel">Pá</option>
                          <option value="hoe">Enxada</option>
                          <option value="shield">Escudo</option>
                          <option value="armor">Armadura</option>
                          <option value="food">Comida</option>
                       </select>
                       <label className="block text-xs font-semibold text-white/60 mb-1">Stack Máximo</label>
                       <select value={activeItem.maxStackSize || 64} onChange={e => updateItem({ maxStackSize: Number(e.target.value) })} className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-sm text-white focus:border-amber-500 outline-none cursor-pointer">
                          <option value="64">64 (Padrão)</option>
                          <option value="16">16 (Snowballs, Pérolas)</option>
                          <option value="1">1 (Ferramentas, Armaduras, Únicos)</option>
                       </select>
                     </div>
                  </div>
               </div>
            </div>

            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="col-span-full md:col-span-2 bg-white/[0.02] border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                  <h3 className="text-white font-bold mb-4 border-b border-white/5 pb-2">Propriedades Gerais</h3>
                  <div className="grid grid-cols-2 gap-4">
                     <div>
                       <label className="block text-[10px] font-semibold text-white/60 mb-1">Durabilidade Máxima (0 = Infinito)</label>
                       <input type="number" min="0" value={(activeItem as any).durability || 0} onChange={e => updateItem({ durability: Number(e.target.value) } as any)} className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-sm text-white focus:border-amber-500 outline-none" />
                     </div>
                     <div>
                        <label className="block text-[10px] font-semibold text-white/60 mb-1">Raridade (Cor do Nome)</label>
                        <select value={(activeItem as any).rarity || 'common'} onChange={e => updateItem({ rarity: e.target.value } as any)} className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-sm text-white focus:border-amber-500 outline-none cursor-pointer">
                           <option value="common">Comum (Branco)</option>
                           <option value="uncommon">Incomum (Amarelo)</option>
                           <option value="rare">Raro (Ciano)</option>
                           <option value="epic">Épico (Magenta/Roxo)</option>
                        </select>
                     </div>
                  </div>
               </div>

               {(isWeapon || isTool || isArmor || isShield) && (
                 <div className="col-span-full md:col-span-2 bg-white/[0.02] border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                    <h3 className="text-white font-bold mb-4 border-b border-white/5 pb-2 flex items-center gap-2"><Sword size={16}/> Combate e Utilidade</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {isWeapon && (
                        <>
                          <div>
                            <label className="block text-[10px] font-semibold text-white/60 mb-1">Dano Base</label>
                            <input type="number" step="0.5" value={(activeItem as any).attackDamage || 0} onChange={e => updateItem({ attackDamage: Number(e.target.value) } as any)} className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-sm text-white focus:border-amber-500 outline-none" />
                          </div>
                          <div>
                            <label className="block text-[10px] font-semibold text-white/60 mb-1">Velocidade de Ataque</label>
                            <input type="number" step="0.1" value={(activeItem as any).attackSpeed || 0} onChange={e => updateItem({ attackSpeed: Number(e.target.value) } as any)} className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-sm text-white focus:border-amber-500 outline-none" />
                          </div>
                        </>
                      )}
                      
                      {isTool && (
                        <>
                          <div>
                            <label className="block text-[10px] font-semibold text-white/60 mb-1">Velocidade de Mineração (Eficiência)</label>
                            <input type="number" step="0.5" value={(activeItem as any).miningSpeed || 0} onChange={e => updateItem({ miningSpeed: Number(e.target.value) } as any)} className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-sm text-white focus:border-amber-500 outline-none" />
                          </div>
                          <div>
                            <label className="block text-[10px] font-semibold text-white/60 mb-1">Nível de Colheita (0=Madeira a 4=Netherite)</label>
                            <input type="number" min="0" max="4" value={(activeItem as any).harvestLevel || 0} onChange={e => updateItem({ harvestLevel: Number(e.target.value) } as any)} className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-sm text-white focus:border-amber-500 outline-none" />
                          </div>
                        </>
                      )}

                      {isArmor && (
                        <>
                          <div>
                            <label className="block text-[10px] font-semibold text-white/60 mb-1">Proteção (Pontos de Armadura)</label>
                            <input type="number" step="1" value={(activeItem as any).armorProtection || 0} onChange={e => updateItem({ armorProtection: Number(e.target.value) } as any)} className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-sm text-white focus:border-amber-500 outline-none" />
                          </div>
                          <div>
                            <label className="block text-[10px] font-semibold text-white/60 mb-1">Dureza (Toughness)</label>
                            <input type="number" step="0.5" value={(activeItem as any).armorToughness || 0} onChange={e => updateItem({ armorToughness: Number(e.target.value) } as any)} className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-sm text-white focus:border-amber-500 outline-none" />
                          </div>
                        </>
                      )}

                      <div className="col-span-2 pt-4 border-t border-white/5">
                         <button onClick={() => { store.openElement(activeItem.id, 'item'); setActiveView('Lógica (Nodos)'); }} className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-sm font-bold text-amber-500 hover:bg-amber-500/10 transition-colors flex items-center justify-center gap-2">
                            + Adicionar Lógica Nodal Dinâmica
                         </button>
                      </div>
                    </div>
                 </div>
               )}

               {isFood && (
                 <div className="col-span-full md:col-span-2 bg-white/[0.02] border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                    <h3 className="text-white font-bold mb-4 border-b border-white/5 pb-2">Propriedades de Consumível</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-semibold text-white/60 mb-1">Nutrição</label>
                        <input type="number" min="0" defaultValue="4" className="w-full bg-black/40 border border-white/10 rounded p-2 text-xs text-white" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-semibold text-white/60 mb-1">Saturação</label>
                        <input type="number" step="0.1" defaultValue="0.6" className="w-full bg-black/40 border border-white/10 rounded p-2 text-xs text-white" />
                      </div>
                    </div>
                 </div>
               )}
               
               <div className="col-span-full md:col-span-2 bg-white/[0.02] border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                 <h3 className="text-white font-bold mb-4 border-b border-white/5 pb-2">Textura (2D/3D)</h3>
                 <div 
                   className="w-full h-32 bg-black/40 border-2 border-dashed border-white/10 rounded-xl flex items-center justify-center flex-col text-white/30 cursor-pointer hover:border-amber-500/50 transition-colors group"
                   onClick={() => setActiveView('Texturas')}
                 >
                    <ImageIcon size={32} className="mb-2 group-hover:text-amber-500" />
                    <span className="text-xs group-hover:text-amber-200">Arraste a textura, ou abra o Criador de Texturas</span>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
