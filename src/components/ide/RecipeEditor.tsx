import { FileJson, Grid3x3, Flame, Beaker, Plus, Save, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useModStore } from '../../store/modStore';
import { RecipeIR } from '../../types/ir';
import { generateRegistryName } from '../../lib/utils';

export const RecipeEditor = ({ setActiveView }: { setActiveView?: (view: string) => void }) => {
  const store = useModStore();
  const [activeRecipe, setActiveRecipe] = useState<RecipeIR | null>(null);

  const [displayName, setDisplayName] = useState('Sem Nome');

  useEffect(() => {
    if (store.activeElementId && store.activeElementType === 'recipe') {
      const found = store.recipes.find(r => r.id === store.activeElementId);
      if (found) {
        setActiveRecipe(found);
        setDisplayName(found.displayName);
      }
    } else {
      // Pick first one automatically if any
      if (store.recipes.length > 0) {
        store.openElement(store.recipes[0].id, 'recipe');
      }
    }
  }, [store.activeElementId, store.activeElementType, store.recipes]);

  const updateActiveRecipe = (updates: Partial<RecipeIR>) => {
    if (!activeRecipe) return;
    store.updateRecipe(activeRecipe.id, updates);
  };

  const handleNameChange = (name: string) => {
    setDisplayName(name);
    updateActiveRecipe({ displayName: name, registryName: 'mymod:' + generateRegistryName(name) });
  };

  const createRecipe = () => {
    const newRecipe: RecipeIR = {
      id: Math.random().toString(36).substring(2, 9),
      registryName: 'mymod:nova_receita',
      displayName: 'Nova Receita',
      type: 'crafting_shaped',
      resultItem: 'minecraft:stone',
      resultCount: 1,
      ingredients: Array(9).fill(null)
    };
    store.addRecipe(newRecipe);
    store.openElement(newRecipe.id, 'recipe');
  };

  if (!activeRecipe) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-[radial-gradient(circle_at_top_right,_#1a1510_0%,_#0A0A0C_60%)] relative overflow-hidden">
        <button 
          onClick={createRecipe}
          className="bg-amber-500 hover:bg-amber-400 text-black px-4 py-2 rounded-lg font-bold shadow-[0_0_15px_rgba(245,158,11,0.3)] transition-colors cursor-pointer"
        >
          Criar Nova Receita
        </button>
      </div>
    );
  }

  const updateIngredient = (index: number, value: string | null) => {
    const newIngredients = [...activeRecipe.ingredients];
    newIngredients[index] = value;
    updateActiveRecipe({ ingredients: newIngredients });
  };

  return (
    <div className="flex-1 bg-[radial-gradient(circle_at_top_right,_#1a1510_0%,_#0A0A0C_60%)] flex flex-col relative overflow-hidden">
      <div className="flex-1 p-8 overflow-y-auto pb-24">
        <div className="max-w-4xl mx-auto space-y-6">
          <header className="mb-8 flex items-end justify-between">
            <div>
              <h1 className="text-4xl font-extrabold tracking-tighter text-white mb-2 flex items-center gap-3 italic">
                <FileJson className="text-amber-500 w-8 h-8" />
                Criador de {displayName}
              </h1>
              <p className="text-white/40 text-lg font-light">3x3, Fornalha, Mesa de Poções ou interações entre mods.</p>
            </div>
            <button 
              onClick={createRecipe}
              className="bg-white/5 hover:bg-white/10 text-white px-4 py-2 rounded-lg font-bold transition-colors cursor-pointer border border-white/10"
            >
              + Nova Receita
            </button>
          </header>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-6">
              <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                <h3 className="text-white font-bold mb-4 border-b border-white/5 pb-2">Informação da Receita</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-white/60 mb-1">Nome Exibido</label>
                    <input type="text" value={displayName} onChange={e => handleNameChange(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-sm text-white focus:border-amber-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-white/60 mb-1">Registry Name</label>
                    <input type="text" value={activeRecipe.registryName} onChange={e => updateActiveRecipe({ registryName: e.target.value })} className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-sm text-white/50 focus:border-amber-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-white/60 mb-1">Tipo de Receita</label>
                    <select value={activeRecipe.type} onChange={e => updateActiveRecipe({ type: e.target.value as any })} className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-sm text-white focus:border-amber-500 outline-none cursor-pointer">
                      <option value="crafting_shaped">Crafting (3x3 Com forma)</option>
                      <option value="crafting_shapeless">Crafting (Sem forma)</option>
                      <option value="smelting">Smelting (Fornalha)</option>
                      <option value="blasting">Blasting (Alto-forno)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 backdrop-blur-sm flex flex-col justify-center items-center">
                <h3 className="text-white font-bold mb-4 w-full border-b border-white/5 pb-2 text-center">Grelha Interativa</h3>
                
                {activeRecipe.type.includes('crafting') && (
                  <div className="flex gap-4 items-center bg-black/40 p-6 rounded-xl border border-white/10 w-full justify-between">
                    <div className="grid grid-cols-3 gap-2">
                       {Array.from({ length: 9 }).map((_, i) => (
                         <input 
                           key={i} 
                           placeholder="ID"
                           value={activeRecipe.ingredients[i] || ''}
                           onChange={(e) => updateIngredient(i, e.target.value)}
                           className="w-12 h-12 bg-black/60 border border-white/10 hover:border-amber-500/50 rounded flex items-center justify-center text-white text-xs text-center transition-colors outline-none"
                         />
                       ))}
                    </div>
                    <div className="text-white/20 text-xl">→</div>
                    <div className="flex flex-col gap-2">
                      <input 
                         placeholder="Result ID"
                         value={activeRecipe.resultItem}
                         onChange={(e) => updateActiveRecipe({ resultItem: e.target.value })}
                         className="w-16 h-12 bg-black/60 border border-amber-500/30 rounded text-amber-500 text-xs text-center outline-none"
                      />
                      <input 
                         type="number"
                         min="1"
                         max="64"
                         value={activeRecipe.resultCount}
                         onChange={(e) => updateActiveRecipe({ resultCount: parseInt(e.target.value) || 1 })}
                         className="w-16 h-8 bg-black/60 border border-white/10 rounded text-white text-xs text-center outline-none"
                      />
                    </div>
                  </div>
                )}

                {(activeRecipe.type === 'smelting' || activeRecipe.type === 'blasting') && (
                  <div className="flex gap-4 items-center bg-black/40 p-6 rounded-xl border border-white/10 w-full justify-between">
                    <div className="flex flex-col gap-2 items-center">
                       <input 
                         placeholder="Input ID"
                         value={activeRecipe.ingredients[0] || ''}
                         onChange={(e) => updateIngredient(0, e.target.value)}
                         className="w-16 h-12 bg-black/60 border border-white/10 rounded text-white text-xs text-center outline-none"
                       />
                       <Flame size={20} className="text-orange-500 my-1" />
                    </div>
                    <div className="text-white/20 text-xl">→</div>
                    <div className="flex flex-col gap-2">
                      <input 
                         placeholder="Result ID"
                         value={activeRecipe.resultItem}
                         onChange={(e) => updateActiveRecipe({ resultItem: e.target.value })}
                         className="w-16 h-12 bg-black/60 border border-amber-500/30 rounded text-amber-500 text-xs text-center outline-none"
                      />
                    </div>
                  </div>
                )}
                
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Barra de Ações Fixa */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-[#0A0A0C]/90 backdrop-blur-md border-t border-white/10 flex justify-between items-center z-50">
        <div className="text-xs text-white/50 px-4">
          Status: <span className="text-emerald-400">Modificações Guardadas (Auto-Save)</span>
        </div>
        <div className="flex gap-3 px-4">
          <button onClick={() => {
            if (activeRecipe) {
              if (window.confirm(`Tem a certeza que deseja eliminar '${displayName}'?`)) {
                store.deleteElement(activeRecipe.id, 'recipe');
                if (setActiveView) setActiveView('Dashboard');
              }
            }
          }} className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 rounded-lg font-bold text-sm transition-colors cursor-pointer">
            <Trash2 size={16} /> Eliminar Receita
          </button>
          <button onClick={() => {
            if (!activeRecipe?.registryName || !displayName) {
              alert("O nome e registry name são obrigatórios!");
              return;
            }
            alert(`Receita '${displayName}' salva com sucesso!`);
          }} className="flex items-center gap-2 px-6 py-2 bg-amber-500 hover:bg-amber-400 text-black rounded-lg font-bold text-sm shadow-[0_0_15px_rgba(245,158,11,0.3)] transition-colors cursor-pointer">
            <Save size={16} /> Salvar Alterações
          </button>
        </div>
      </div>

    </div>
  );
};


