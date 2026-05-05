import { Sword, Shield, Pickaxe, Image as ImageIcon, Plus } from 'lucide-react';
import { useState } from 'react';

export const ItemEditor = ({ setActiveView }: { setActiveView?: (view: string) => void }) => {
  const [itemType, setItemType] = useState('tool');
  const [itemName, setItemName] = useState('Espada Épica');
  const [tier, setTier] = useState('iron');
  const [attackDamage, setAttackDamage] = useState(6.0);
  const [attackSpeed, setAttackSpeed] = useState(1.6);
  const [durability, setDurability] = useState(250);
  // Armor states
  const [armorDefense, setArmorDefense] = useState(2);
  const [armorToughness, setArmorToughness] = useState(0);
  const [armorNames, setArmorNames] = useState({ head: 'Capacete Épico', chest: 'Peitoral Épico', legs: 'Calças Épicas', feet: 'Botas Épicas' });
  const [fullSetEffect, setFullSetEffect] = useState('none');
  // Tool states
  const [toolClass, setToolClass] = useState('pickaxe');
  const [harvestLevel, setHarvestLevel] = useState(2);
  const [miningSpeed, setMiningSpeed] = useState(6.0);
  const [hasCustomToolLogic, setHasCustomToolLogic] = useState(false);
  // Weapon states
  const [weaponClass, setWeaponClass] = useState('sword'); // sword, bow, shield, gun
  const [hasCustomWeaponLogic, setHasCustomWeaponLogic] = useState(false);
  // Item states
  const [isFood, setIsFood] = useState(false);
  const [nutrition, setNutrition] = useState(4);
  const [saturation, setSaturation] = useState(0.6);
  const [foodEffect, setFoodEffect] = useState('none');

  return (
    <div className="flex-1 bg-[radial-gradient(circle_at_top_right,_#1a1510_0%,_#0A0A0C_60%)] flex flex-col relative overflow-hidden">
      <div className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-5xl mx-auto space-y-6">
          <header className="mb-8">
            <h1 className="text-4xl font-extrabold tracking-tighter text-white mb-2 flex items-center gap-3 italic">
              <Sword className="text-amber-500 w-8 h-8" />
              Construtor de Itens
            </h1>
            <p className="text-white/40 text-lg font-light">Ferramentas, armas, armaduras e itens normais.</p>
          </header>

          <div className="grid grid-cols-3 gap-6">
            <div className="col-span-1 space-y-6">
               <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                  <h3 className="text-white font-bold mb-4 border-b border-white/5 pb-2">Configuração Base</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-white/60 mb-1">Nome Principal e Tipo</label>
                      <input type="text" value={itemName} onChange={e => setItemName(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-sm text-white focus:border-amber-500 outline-none mb-2" />
                      <select value={itemType} onChange={e => setItemType(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-sm text-white focus:border-amber-500 outline-none cursor-pointer">
                         <option value="item">Item Normal / Material</option>
                         <option value="tool">Ferramenta (Picareta, Machado...)</option>
                         <option value="weapon">Arma (Espada, Arco...)</option>
                         <option value="armor">Armadura</option>
                      </select>
                    </div>
                    
                    {itemType !== 'item' && (
                       <div>
                         <label className="block text-xs font-semibold text-white/60 mb-1 flex justify-between">
                            Tier (Material Base)
                            <button className="text-[9px] text-amber-500 uppercase font-bold hover:underline">Novo Tier</button>
                         </label>
                         <select value={tier} onChange={e => setTier(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-sm text-white focus:border-amber-500 outline-none cursor-pointer">
                           <option value="wood">Madeira</option>
                           <option value="stone">Pedra</option>
                           <option value="iron">Ferro</option>
                           <option value="gold">Ouro</option>
                           <option value="diamond">Diamante</option>
                           <option value="netherite">Netherite</option>
                           <option disabled>--- Custom Tiers ---</option>
                           <option value="custom_mithril">Mithril (Custom)</option>
                         </select>
                       </div>
                    )}
                  </div>
               </div>

               <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                  <h3 className="text-white font-bold mb-4 border-b border-white/5 pb-2">Durabilidade</h3>
                  <input type="number" value={durability} onChange={e => setDurability(Number(e.target.value))} className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-sm text-white focus:border-amber-500 outline-none" placeholder="Ex: 250" />
               </div>
            </div>

            <div className="col-span-2 grid grid-cols-2 gap-6">
               {(itemType === 'weapon' || itemType === 'tool') && (
                 <div className="col-span-2 bg-white/[0.02] border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                    <h3 className="text-white font-bold mb-4 border-b border-white/5 pb-2 flex items-center gap-2"><Sword size={16}/> Combate e Utilidade</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-semibold text-white/60 mb-1">Dano Base</label>
                        <input type="number" step="0.5" value={attackDamage} onChange={e => setAttackDamage(Number(e.target.value))} className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-sm text-white focus:border-amber-500 outline-none" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-semibold text-white/60 mb-1">Velocidade de Ataque</label>
                        <input type="number" step="0.1" value={attackSpeed} onChange={e => setAttackSpeed(Number(e.target.value))} className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-sm text-white focus:border-amber-500 outline-none" />
                      </div>
                      {itemType === 'tool' && (
                        <>
                          <div className="col-span-2">
                             <label className="block text-[10px] font-semibold text-white/60 mb-1">Tipo Específico de Ferramenta</label>
                             <div className="flex gap-2">
                               {['pickaxe', 'axe', 'shovel', 'hoe'].map(t => (
                                 <button key={t} onClick={() => setToolClass(t)} className={`flex-1 py-2 rounded text-xs capitalize ${toolClass === t ? 'bg-amber-500 text-black font-bold' : 'bg-black/40 border border-white/10 text-white/60 hover:text-white'}`}>{t}</button>
                               ))}
                             </div>
                          </div>
                          <div>
                            <label className="block text-[10px] font-semibold text-white/60 mb-1">Nível de Mineração (0-Wood, 4-Netherite)</label>
                            <input type="number" min="0" max="6" value={harvestLevel} onChange={e => setHarvestLevel(Number(e.target.value))} className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-sm text-white focus:border-amber-500 outline-none" />
                          </div>
                          <div>
                            <label className="block text-[10px] font-semibold text-white/60 mb-1">Velocidade de Mineração (Multiplicador)</label>
                            <input type="number" step="0.5" value={miningSpeed} onChange={e => setMiningSpeed(Number(e.target.value))} className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-sm text-white focus:border-amber-500 outline-none" />
                          </div>
                          <div className="col-span-2 pt-4 border-t border-white/5">
                             <label className="flex items-center gap-2 text-sm text-white/80 cursor-pointer mb-2">
                               <input type="checkbox" checked={hasCustomToolLogic} onChange={e => setHasCustomToolLogic(e.target.checked)} className="accent-amber-500 w-4 h-4 rounded" />
                               Despoletar Efeito Mágico ao Usar/Quebrar Blocos
                             </label>
                             {hasCustomToolLogic && (
                                <div className="mt-2">
                                  <label className="block text-xs font-semibold text-white/50 mb-2 uppercase tracking-widest">Ação Customizada (Lógica)</label>
                                  <button onClick={() => setActiveView && setActiveView('Lógica (Nodos)')} className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-sm font-bold text-amber-500 hover:bg-amber-500/10 transition-colors flex items-center justify-center gap-2">
                                     + Adicionar Ação Nodal ao Quebrar Bloco
                                  </button>
                                </div>
                             )}
                          </div>
                        </>
                      )}

                      {itemType === 'weapon' && (
                        <>
                          <div className="col-span-2">
                             <label className="block text-[10px] font-semibold text-white/60 mb-1">Especialidade da Arma</label>
                             <div className="flex gap-2">
                               {['sword', 'bow', 'shield', 'gun'].map(t => (
                                 <button key={t} onClick={() => setWeaponClass(t)} className={`flex-1 py-2 rounded text-xs capitalize ${weaponClass === t ? 'bg-amber-500 text-black font-bold' : 'bg-black/40 border border-white/10 text-white/60 hover:text-white'}`}>
                                   {t === 'sword' ? 'Espada' : t === 'bow' ? 'Arco' : t === 'shield' ? 'Escudo' : 'Arma de Fogo'}
                                 </button>
                               ))}
                             </div>
                          </div>
                          
                          {(weaponClass === 'bow' || weaponClass === 'gun') && (
                            <div className="col-span-2 bg-black/20 border border-white/5 rounded-xl p-4 mt-2">
                              <h4 className="text-white/60 text-xs font-bold mb-3">Opções de Arma à Distância</h4>
                              <div className="grid grid-cols-2 gap-4">
                                 <div>
                                   <label className="block text-[10px] font-semibold text-white/60 mb-1">Tempo de Fogo/Recarga (ticks)</label>
                                   <input type="number" min="0" defaultValue="20" className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-sm text-white focus:border-amber-500 outline-none" />
                                 </div>
                                 {weaponClass === 'gun' && (
                                   <div>
                                     <label className="block text-[10px] font-semibold text-white/60 mb-1">Munição (Item Requerido)</label>
                                     <input type="text" defaultValue="minecraft:iron_nugget" className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-sm text-white focus:border-amber-500 outline-none" />
                                   </div>
                                 )}
                                 <div className={weaponClass !== 'gun' ? 'col-span-2' : ''}>
                                   <label className="block text-[10px] font-semibold text-white/60 mb-1">Mira/Aproximação (Scope Zoom)</label>
                                   <input type="number" step="0.1" defaultValue="1.0" className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-sm text-white focus:border-amber-500 outline-none" />
                                 </div>
                                 <div className="col-span-2">
                                   <label className="block text-[10px] font-semibold text-white/60 mb-1">Qual projétil dispara? (Nome/Registo)</label>
                                   <div className="flex gap-2">
                                      <input type="text" defaultValue="minecraft:arrow" className="flex-1 bg-black/40 border border-white/10 rounded-lg p-2.5 text-sm text-white focus:border-amber-500 outline-none" />
                                      <button onClick={() => setActiveView && setActiveView('Projéteis')} className="bg-white/10 text-white px-3 rounded hover:bg-white/20 text-xs font-bold">Criar Projétil</button>
                                   </div>
                                 </div>
                              </div>
                            </div>
                          )}

                          <div className="col-span-2 pt-4 border-t border-white/5">
                             <label className="flex items-center gap-2 text-sm text-white/80 cursor-pointer mb-2">
                               <input type="checkbox" checked={hasCustomWeaponLogic} onChange={e => setHasCustomWeaponLogic(e.target.checked)} className="accent-amber-500 w-4 h-4 rounded" />
                               Despoletar Habilidade Especial de Combate
                             </label>
                             {hasCustomWeaponLogic && (
                                <div className="mt-2">
                                  <label className="block text-xs font-semibold text-white/50 mb-2 uppercase tracking-widest">Ação Customizada (Lógica)</label>
                                  <button onClick={() => setActiveView && setActiveView('Lógica (Nodos)')} className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-sm font-bold text-amber-500 hover:bg-amber-500/10 transition-colors flex items-center justify-center gap-2">
                                     + Adicionar Ação Nodal ao Atacar/Defender
                                  </button>
                                </div>
                             )}
                          </div>
                        </>
                      )}
                    </div>
                 </div>
               )}

               {itemType === 'armor' && (
                 <div className="col-span-2 bg-white/[0.02] border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                    <h3 className="text-white font-bold mb-4 border-b border-white/5 pb-2 flex items-center gap-2"><Shield size={16}/> Kit de Armadura</h3>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-[10px] font-semibold text-white/60 mb-1">Pontos de Defesa Base</label>
                        <input type="number" step="1" value={armorDefense} onChange={e => setArmorDefense(Number(e.target.value))} className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-sm text-white focus:border-amber-500 outline-none" />
                      </div>
                      <div>
                         <label className="block text-[10px] font-semibold text-white/60 mb-1">Toughness (Resiste a grandes danos)</label>
                         <input type="number" step="0.5" value={armorToughness} onChange={e => setArmorToughness(Number(e.target.value))} className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-sm text-white focus:border-amber-500 outline-none" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-4">
                       <div className="col-span-2"><label className="block text-xs font-semibold text-white/60">Nomes Individuais</label></div>
                       <div><input type="text" value={armorNames.head} onChange={e=>setArmorNames({...armorNames, head: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded p-2 text-xs text-white" placeholder="Head" /></div>
                       <div><input type="text" value={armorNames.chest} onChange={e=>setArmorNames({...armorNames, chest: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded p-2 text-xs text-white" placeholder="Chest" /></div>
                       <div><input type="text" value={armorNames.legs} onChange={e=>setArmorNames({...armorNames, legs: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded p-2 text-xs text-white" placeholder="Legs" /></div>
                       <div><input type="text" value={armorNames.feet} onChange={e=>setArmorNames({...armorNames, feet: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded p-2 text-xs text-white" placeholder="Feet" /></div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-white/5">
                        <label className="block text-xs font-semibold text-white/50 mb-2 uppercase tracking-widest">Ação Customizada (Lógica)</label>
                        <button onClick={() => setActiveView && setActiveView('Lógica (Nodos)')} className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-sm font-bold text-amber-500 hover:bg-amber-500/10 transition-colors flex items-center justify-center gap-2">
                          + Adicionar Ação Nodal ao Vestir Set Completo
                        </button>
                    </div>
                 </div>
               )}

               {itemType === 'item' && (
                 <div className="col-span-2 bg-white/[0.02] border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                    <h3 className="text-white font-bold mb-4 border-b border-white/5 pb-2">Propriedades de Consumo (Comida/Poção)</h3>
                    <label className="flex items-center gap-2 text-sm text-white/80 cursor-pointer mb-4">
                      <input type="checkbox" checked={isFood} onChange={(e) => setIsFood(e.target.checked)} className="accent-amber-500 w-4 h-4 rounded" />
                      Este item é consumível
                    </label>
                    
                    {isFood && (
                       <div className="grid grid-cols-2 gap-4">
                         <div>
                           <label className="block text-[10px] font-semibold text-white/60 mb-1">Nutrição (Fominhas recuperadas)</label>
                           <input type="number" min="0" value={nutrition} onChange={e => setNutrition(Number(e.target.value))} className="w-full bg-black/40 border border-white/10 rounded p-2 text-xs text-white" />
                         </div>
                         <div>
                           <label className="block text-[10px] font-semibold text-white/60 mb-1">Saturação (Gasto de fome atrasado)</label>
                           <input type="number" step="0.1" value={saturation} onChange={e => setSaturation(Number(e.target.value))} className="w-full bg-black/40 border border-white/10 rounded p-2 text-xs text-white" />
                         </div>
                         <div className="col-span-2">
                            <label className="block text-[10px] font-semibold text-white/60 mb-1">Efeito ao Consumir</label>
                            <select value={foodEffect} onChange={e=>setFoodEffect(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded p-2 text-xs text-white outline-none">
                              <option value="none">Nenhum</option>
                              <option value="poison">Veneno (Como Carne Podre, Spider Eye)</option>
                              <option value="regen">Regeneração (Como Maçã Dourada)</option>
                              <option value="custom_node">Ação Lógica Customizada (Nodos)</option>
                            </select>
                         </div>
                       </div>
                    )}
                 </div>
               )}
               
               <div className="col-span-full bg-white/[0.02] border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                 <h3 className="text-white font-bold mb-4 border-b border-white/5 pb-2">Textura (2D/3D)</h3>
                 <div 
                   className="w-full h-32 bg-black/40 border-2 border-dashed border-white/10 rounded-xl flex items-center justify-center flex-col text-white/30 cursor-pointer hover:border-amber-500/50 transition-colors group"
                   onClick={() => setActiveView && setActiveView('Texturas')}
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
