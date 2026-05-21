import { Package, Trash2, Plus, Save } from 'lucide-react';
import { useModStore } from '../../store/modStore';
import { useState, useEffect } from 'react';
import { LootTableIR, LootPoolIR } from '../../types/ir';
import { generateRegistryName } from '../../lib/utils';

export const LootEditor = ({ setActiveView }: { setActiveView?: (view: string) => void }) => {
  const store = useModStore();
  const [activeLoot, setActiveLoot] = useState<LootTableIR | null>(null);

  // local displayName state for visual parity
  const [displayName, setDisplayName] = useState('Loot Customizado');

  useEffect(() => {
    if (store.activeElementId && store.activeElementType === 'loot') {
      const found = store.lootTables.find(l => l.id === store.activeElementId);
      if (found) {
        setActiveLoot(found);
      }
    } else {
      // Pick first one automatically if any
      if (store.lootTables.length > 0) {
        setActiveLoot(store.lootTables[0]);
      }
    }
  }, [store.activeElementId, store.activeElementType, store.lootTables]);

  const handleNameChange = (name: string) => {
    setDisplayName(name);
    const modId = store.projectSettings?.modId || 'mymod';
    updateActiveLoot({ registryName: `${modId}:` + generateRegistryName(name) });
  };

  const updateActiveLoot = (updates: Partial<LootTableIR>) => {
    if (!activeLoot) return;
    store.updateLootTable(activeLoot.id, updates);
  };

  const addPool = () => {
    if (!activeLoot) return;
    const newPool: LootPoolIR = {
      id: Math.random().toString(36).substr(2, 9),
      item: 'minecraft:diamond',
      minQuantity: 1,
      maxQuantity: 1,
      chance: 50
    };
    updateActiveLoot({ pools: [...activeLoot.pools, newPool] });
  };

  const updatePool = (poolId: string, updates: Partial<LootPoolIR>) => {
    if (!activeLoot) return;
    const newPools = activeLoot.pools.map(p => p.id === poolId ? { ...p, ...updates } : p);
    updateActiveLoot({ pools: newPools });
  };

  const removePool = (poolId: string) => {
    if (!activeLoot) return;
    const newPools = activeLoot.pools.filter(p => p.id !== poolId);
    updateActiveLoot({ pools: newPools });
  };

  if (!activeLoot) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-[radial-gradient(circle_at_top_right,_#1a1510_0%,_#0A0A0C_60%)] relative overflow-hidden">
        <Package className="text-white/20 w-16 h-16 mb-4" />
        <p className="text-white/50 mb-4">Nenhuma Loot Table selecionada ou criada.</p>
        <button 
          onClick={() => {
            const modId = store.projectSettings?.modId || 'mymod';
            const newLoot: LootTableIR = { id: Math.random().toString(36).substr(2, 9), registryName: `${modId}:custom_loot`, pools: [] };
            store.addLootTable(newLoot);
            store.openElement(newLoot.id, 'loot');
          }}
          className="bg-amber-500 hover:bg-amber-400 text-black px-4 py-2 rounded-lg font-bold shadow-[0_0_15px_rgba(245,158,11,0.3)] transition-colors"
        >
          Criar Nova Loot Table
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-[radial-gradient(circle_at_top_right,_#1a1510_0%,_#0A0A0C_60%)] flex flex-col relative overflow-hidden">
      <div className="flex-1 p-8 overflow-y-auto pb-24">
        <div className="max-w-4xl mx-auto space-y-6">
          <header className="mb-8">
            <h1 className="text-4xl font-extrabold tracking-tighter text-white mb-2 flex items-center gap-3">
              <Package className="text-amber-500 w-8 h-8" />
              Loot Tables
            </h1>
            <p className="text-white/40 text-lg font-light">Configure caixas, mobs ou baús definindo itens, quantidades e chances exatas.</p>
          </header>

          <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
            <h3 className="text-white font-bold mb-4 border-b border-white/5 pb-2">Identificação da Loot Table</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-white/60 mb-1">Nome Exibido</label>
                <input 
                   type="text" 
                   value={displayName} 
                   onChange={e => handleNameChange(e.target.value)} 
                   className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-sm text-white focus:border-amber-500 outline-none" 
                   placeholder="Ex: Baú de Ouro"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-white/60 mb-1">Registry Name</label>
                <input 
                   type="text" 
                   value={activeLoot.registryName} 
                   readOnly 
                   className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-sm text-white/50 outline-none opacity-70 cursor-not-allowed" 
                   placeholder="Ex: mymod:bau_de_ouro"
                />
              </div>
            </div>
          </div>

          <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
            <div className="flex justify-between items-center mb-4 border-b border-white/5 pb-2">
              <h3 className="text-white font-bold">Pools de Itens (Loot Pools)</h3>
              <button onClick={addPool} className="bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-white px-3 py-1.5 rounded text-xs font-bold transition-colors flex items-center gap-1 border border-emerald-500/20">
                <Plus size={14} /> Adicionar Pool
              </button>
            </div>
            
            {activeLoot.pools.length === 0 ? (
               <div className="text-center text-xs text-white/30 italic py-8 border border-dashed border-white/5 rounded-xl bg-black/20">Não há itens para gerar (Loot vazio).</div>
            ) : (
               <div className="space-y-4">
                 {activeLoot.pools.map(pool => (
                   <div key={pool.id} className="bg-black/40 border border-white/10 rounded-lg p-4 flex gap-4 items-center">
                      <div className="flex-1">
                        <label className="block text-[10px] font-semibold text-white/60 mb-1 uppercase tracking-widest">ID do Item</label>
                        <input 
                           type="text" 
                           value={pool.item} 
                           onChange={e => updatePool(pool.id, { item: e.target.value })} 
                           className="w-full bg-[#1C1C21] border border-white/10 rounded p-2 text-sm text-white focus:border-amber-500 outline-none" 
                        />
                      </div>
                      <div className="w-24">
                        <label className="block text-[10px] font-semibold text-white/60 mb-1 uppercase tracking-widest">Mínimo</label>
                        <input 
                           type="number" 
                           value={pool.minQuantity} 
                           onChange={e => updatePool(pool.id, { minQuantity: Number(e.target.value) })} 
                           className="w-full bg-[#1C1C21] border border-white/10 rounded p-2 text-sm text-white focus:border-amber-500 outline-none" 
                        />
                      </div>
                      <div className="w-24">
                        <label className="block text-[10px] font-semibold text-white/60 mb-1 uppercase tracking-widest">Máximo</label>
                        <input 
                           type="number" 
                           value={pool.maxQuantity} 
                           onChange={e => updatePool(pool.id, { maxQuantity: Number(e.target.value) })} 
                           className="w-full bg-[#1C1C21] border border-white/10 rounded p-2 text-sm text-white focus:border-amber-500 outline-none" 
                        />
                      </div>
                      <div className="w-32">
                        <label className="block text-[10px] font-semibold text-white/60 mb-1 uppercase tracking-widest flex justify-between"><span>Chance</span> <span className="text-amber-500">{pool.chance}%</span></label>
                        <input 
                           type="range" 
                           min="0" max="100" 
                           value={pool.chance} 
                           onChange={e => updatePool(pool.id, { chance: Number(e.target.value) })} 
                           className="w-full accent-amber-500 mt-1" 
                        />
                      </div>
                      <div className="pt-5">
                         <button onClick={() => removePool(pool.id)} className="text-red-400/50 hover:text-red-400 transition-colors p-2" title="Remover Pool">
                           <Trash2 size={18} />
                         </button>
                      </div>
                   </div>
                 ))}
               </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Barra de Ações Fixa */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-[#0A0A0C]/90 backdrop-blur-md border-t border-white/10 flex justify-between items-center z-50">
        <div className="text-xs text-white/50 px-4">
          Status: <span className="text-emerald-400">Pronto para salvar na Store</span>
        </div>
        <div className="flex gap-3 px-4">
          <button onClick={() => {
            if (activeLoot) {
              if (window.confirm(`Tem a certeza que deseja eliminar '${displayName}'?`)) {
                store.deleteElement(activeLoot.id, 'loot');
                if (setActiveView) setActiveView('Dashboard');
              }
            }
          }} className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 rounded-lg font-bold text-sm transition-colors cursor-pointer">
            <Trash2 size={16} /> Eliminar Loot
          </button>
          <button onClick={() => {
            if (!activeLoot?.registryName || !displayName) {
              alert("O nome e registry name são obrigatórios!");
              return;
            }
            alert(`Loot '${displayName}' salvo com sucesso!`);
          }} className="flex items-center gap-2 px-6 py-2 bg-amber-500 hover:bg-amber-400 text-black rounded-lg font-bold text-sm shadow-[0_0_15px_rgba(245,158,11,0.3)] transition-colors cursor-pointer">
            <Save size={16} /> Salvar Alterações
          </button>
        </div>
      </div>
    </div>
  );
};
