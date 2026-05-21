import { Sword, Shield, Pickaxe, Image as ImageIcon, Box, Zap, Save, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useModStore } from '../../store/modStore';
import { ItemIR } from '../../types/ir';
import { generateRegistryName } from '../../lib/utils';

export const ItemEditor = ({ setActiveView }: { setActiveView?: (view: string) => void }) => {
  const store = useModStore();
  const [activeItem, setActiveItem] = useState<ItemIR | null>(null);
  const [activeTab, setActiveTab] = useState('properties');

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
    
    const newUpdates = { ...updates };
    const modId = store.projectSettings?.modId || 'mymod';
    if (updates.displayName) {
      newUpdates.registryName = `${modId}:` + generateRegistryName(updates.displayName);
    }
    
    store.updateItem(activeItem.id, newUpdates);
  };

  const createItem = () => {
    const modId = store.projectSettings?.modId || 'mymod';
    const newItem: ItemIR = {
      id: Math.random().toString(36).substring(2, 9),
      registryName: `${modId}:novo_item`,
      displayName: 'Novo Item',
      type: 'material',
      maxStackSize: 64
    };
    store.addItem(newItem);
    store.openElement(newItem.id, 'item');
  };

  const handleSave = () => {
    if (!activeItem) return;
    if (!activeItem.displayName || !activeItem.registryName) {
      alert("O nome e registry name são obrigatórios!");
      return;
    }
    // Simulate save by updating the store (assuming auto-save is already there, but explicit confirm)
    alert(`Item '${activeItem.displayName}' salvo com sucesso!`);
  };

  const handleDelete = () => {
    if (!activeItem) return;
    if (window.confirm(`Tem a certeza que deseja eliminar o item '${activeItem.displayName}'?`)) {
      store.deleteElement(activeItem.id, 'item');
      if (setActiveView) setActiveView('Dashboard');
    }
  };

  if (!activeItem) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-[radial-gradient(circle_at_top_right,_#1a1510_0%,_#0A0A0C_60%)] relative">
        <Sword className="text-white/20 w-16 h-16 mb-4" />
        <p className="text-white/50 mb-4">Nenhum Item selecionado ou criado.</p>
        <button 
          onClick={createItem}
          className="bg-amber-500 hover:bg-amber-400 text-black px-4 py-2 rounded-lg font-bold shadow-[0_0_15px_rgba(245,158,11,0.3)] transition-colors"
        >
          Criar Novo Item
        </button>
      </div>
    );
  }

  const isFood = activeItem.type === 'food';
  const isWeapon = ['sword', 'axe'].includes(activeItem.type);
  const isTool = ['pickaxe', 'axe', 'shovel', 'hoe'].includes(activeItem.type);
  const isArmor = activeItem.type === 'armor';
  const isShield = activeItem.type === 'shield';
  const isRanged = ['bow', 'ranged'].includes(activeItem.type);

  return (
    <div className="flex-1 bg-[radial-gradient(circle_at_top_right,_#1a1510_0%,_#0A0A0C_60%)] flex flex-col relative overflow-hidden">
      <div className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-5xl mx-auto space-y-6">
           <div className="sticky top-0 z-50 flex justify-between items-center bg-[#0A0A0C]/90 backdrop-blur-md border border-white/10 p-4 rounded-2xl shadow-xl -mx-4 px-8">
            <div className="text-xs text-white/50">
              Status: <span className="text-emerald-400">Modificações Guardadas (Auto-Save)</span>
            </div>
            <div className="flex gap-3">
              <button onClick={handleDelete} className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 rounded-lg font-bold text-sm transition-colors cursor-pointer">
                <Trash2 size={16} /> Eliminar
              </button>
              <button onClick={handleSave} className="flex items-center gap-2 px-6 py-2 bg-amber-500 hover:bg-amber-400 text-black rounded-lg font-bold text-sm shadow-[0_0_15px_rgba(245,158,11,0.3)] transition-colors cursor-pointer">
                <Save size={16} /> Salvar
              </button>
            </div>
          </div>
           <header className="mb-4 flex items-end justify-between">
            <div>
              <h1 className="text-4xl font-extrabold tracking-tighter text-white mb-2 flex items-center gap-3 italic">
                <Sword className="text-amber-500 w-8 h-8" />
                Construtor de Itens
              </h1>
              <p className="text-white/40 text-lg font-light">Ferramentas, armas, armaduras e itens normais.</p>
            </div>
            
            <div className="flex gap-2 bg-black/40 p-1.5 rounded-xl border border-white/10 shrink-0">
              <button
                onClick={() => setActiveTab('properties')}
                className={`px-4 py-2 text-sm font-bold rounded-lg transition-all ${
                  activeTab === 'properties' 
                    ? 'bg-amber-500/10 text-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.1)]' 
                    : 'text-white/40 hover:text-white/80 hover:bg-white/5'
                }`}
              >
                Propriedades
              </button>
              <button
                onClick={() => setActiveTab('triggers')}
                className={`px-4 py-2 text-sm font-bold rounded-lg transition-all flex items-center gap-2 ${
                  activeTab === 'triggers' 
                    ? 'bg-amber-500/10 text-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.1)]' 
                    : 'text-white/40 hover:text-white/80 hover:bg-white/5'
                }`}
              >
                 <Zap size={14} /> Triggers & Lógica
              </button>
            </div>
          </header>

          {activeTab === 'properties' ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="col-span-1 space-y-6">
                 {/* 3D Preview */}
                 <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 backdrop-blur-sm relative overflow-hidden flex flex-col items-center justify-center aspect-square group">
                    <h3 className="absolute top-4 left-4 text-white/50 font-bold text-xs uppercase tracking-widest z-10 font-mono">Preview 3D</h3>
                    <div className="w-24 h-24 bg-gradient-to-br from-amber-500/20 to-orange-700/20 border border-amber-500/30 shadow-[0_0_50px_rgba(245,158,11,0.15)] flex items-center justify-center rotate-x-12 rotate-y-12 rounded-lg transform transition-transform duration-500 group-hover:rotate-x-12 group-hover:-rotate-y-180">
                       <ImageIcon size={32} className="text-amber-500/50" />
                    </div>
                    <p className="absolute bottom-4 text-[10px] text-white/30 text-center w-full">Clique e arraste para rotacionar</p>
                 </div>

                 <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                    <h3 className="text-white font-bold mb-4 border-b border-white/5 pb-2">Configuração Base</h3>
                    <div className="space-y-4">
                       <div>
                         <label className="block text-xs font-semibold text-white/60 mb-1">Nome Principal</label>
                         <input type="text" value={activeItem.displayName} onChange={e => updateItem({ displayName: e.target.value })} className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-sm text-white focus:border-amber-500 outline-none mb-2" />
                         <label className="block text-xs font-semibold text-white/60 mb-1">Registry</label>
                         <input type="text" value={activeItem.registryName} readOnly className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-sm text-white/50 outline-none mb-2 opacity-70 cursor-not-allowed" />
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
                            <option value="bow">Arco (Bow)</option>
                            <option value="ranged">Arma de Fogo (Gun)</option>
                            <option value="food">Comida</option>
                         </select>
                         <label className="block text-xs font-semibold text-white/60 mb-1">Stack Máximo</label>
                         <select value={activeItem.maxStackSize || 64} onChange={e => updateItem({ maxStackSize: Number(e.target.value) })} className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-sm text-white focus:border-amber-500 outline-none cursor-pointer">
                            <option value={64}>64 (Padrão)</option>
                            <option value={16}>16 (Snowballs, Pérolas)</option>
                            <option value={1}>1 (Ferramentas, Armaduras, Únicos)</option>
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
                              <input type="number" step="0.5" value={(activeItem as any).efficiency || 0} onChange={e => updateItem({ efficiency: Number(e.target.value) } as any)} className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-sm text-white focus:border-amber-500 outline-none" />
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
                              <input type="number" step="1" value={(activeItem as any).protection || 0} onChange={e => updateItem({ protection: Number(e.target.value) } as any)} className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-sm text-white focus:border-amber-500 outline-none" />
                            </div>
                            <div>
                              <label className="block text-[10px] font-semibold text-white/60 mb-1">Dureza (Toughness)</label>
                              <input type="number" step="0.5" value={(activeItem as any).toughness || 0} onChange={e => updateItem({ toughness: Number(e.target.value) } as any)} className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-sm text-white focus:border-amber-500 outline-none" />
                            </div>
                          </>
                        )}
                      </div>
                   </div>
                 )}

                 {isRanged && (
                   <div className="col-span-full md:col-span-2 bg-white/[0.02] border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                      <h3 className="text-white font-bold mb-4 border-b border-white/5 pb-2 flex items-center gap-2"><Box size={16}/> Propriedades de Longo Alcance</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-semibold text-white/60 mb-1">Tipo de Projétil</label>
                          <select value={(activeItem as any).projectileType || 'arrow'} onChange={e => updateItem({ projectileType: e.target.value } as any)} className="w-full bg-black/40 border border-white/10 rounded p-2 text-xs text-white">
                             <option value="arrow">Flechas (Padrão)</option>
                             <option value="custom">Projétil Customizado</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[10px] font-semibold text-white/60 mb-1">Dano Adicional / Power</label>
                          <input type="number" step="0.5" value={(activeItem as any).rangedDamage || 2} onChange={e => updateItem({ rangedDamage: Number(e.target.value) } as any)} className="w-full bg-black/40 border border-white/10 rounded p-2 text-xs text-white" />
                        </div>
                        <div>
                          <label className="block text-[10px] font-semibold text-white/60 mb-1">Velocidade de Puxada (Ticks)</label>
                          <input type="number" min="0" value={(activeItem as any).drawSpeed || 20} onChange={e => updateItem({ drawSpeed: Number(e.target.value) } as any)} className="w-full bg-black/40 border border-white/10 rounded p-2 text-xs text-white" />
                        </div>
                        <div>
                          <label className="block text-[10px] font-semibold text-white/60 mb-1">ID da Munição Necessária</label>
                          <input type="text" placeholder="minecraft:arrow" value={(activeItem as any).ammoItemId || ''} onChange={e => updateItem({ ammoItemId: e.target.value } as any)} className="w-full bg-black/40 border border-white/10 rounded p-2 text-xs text-white" />
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
                     onClick={() => {}}
                   >
                      <ImageIcon size={32} className="mb-2 group-hover:text-amber-500" />
                      <span className="text-xs group-hover:text-amber-200">Arraste a textura, ou abra o Criador de Texturas</span>
                   </div>
                 </div>
              </div>
            </div>
          ) : (
            <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
              <h3 className="text-white font-bold mb-4 border-b border-white/5 pb-2">Eventos & Triggers do Item</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { id: 'on_right_click_air', name: 'On Right Click (Air)', desc: 'Quando o jogador clica com o botão direito no ar.' },
                  { id: 'on_right_click_block', name: 'On Right Click (Block)', desc: 'Quando o jogador clica com o botão direito num bloco.' },
                  { id: 'on_hit_entity', name: 'On Hit Entity', desc: 'Quando o jogador atinge uma entidade.' },
                  { id: 'on_item_eaten', name: 'On Item Eaten', desc: 'Quando o jogador consome o item (se for comida).' },
                  { id: 'on_inventory_tick', name: 'On Inventory Tick', desc: 'A cada tick enquanto estiver no inventário.' },
                  { id: 'on_crafted', name: 'On Crafted', desc: 'Quando o item é fabricado.' }
                ].map(trigger => (
                   <div key={trigger.id} className="bg-black/40 border border-white/10 rounded-xl p-4 flex flex-col justify-between h-full">
                     <div>
                       <h4 className="text-sm font-bold text-amber-500 mb-1">{trigger.name}</h4>
                       <p className="text-xs text-white/50 mb-4">{trigger.desc}</p>
                     </div>
                     <button onClick={() => store.openLogicGraph(activeItem.id + ':' + trigger.id)} className="w-full bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-500/30 text-indigo-200 p-2 text-sm font-bold rounded flex items-center justify-center gap-2 transition-all cursor-pointer">
                        <Zap size={14} /> Editar Lógica Nodal
                     </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
