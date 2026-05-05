import { FileJson, Grid3x3, Flame, Beaker, Plus } from 'lucide-react';
import { useState } from 'react';

export const RecipeEditor = () => {
  const [recipeName, setRecipeName] = useState('Super Pickaxe Recipe');
  const [recipeType, setRecipeType] = useState('crafting_shaped');
  
  return (
    <div className="flex-1 bg-[radial-gradient(circle_at_top_right,_#1a1510_0%,_#0A0A0C_60%)] flex flex-col relative overflow-hidden">
      <div className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto space-y-6">
          <header className="mb-8">
            <h1 className="text-4xl font-extrabold tracking-tighter text-white mb-2 flex items-center gap-3 italic">
              <FileJson className="text-amber-500 w-8 h-8" />
              Criador de Receitas
            </h1>
            <p className="text-white/40 text-lg font-light">3x3, Fornalha, Mesa de Poções ou interações entre mods.</p>
          </header>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-6">
              <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                <h3 className="text-white font-bold mb-4 border-b border-white/5 pb-2">Informação da Receita</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-white/60 mb-1">Nome/ID</label>
                    <input type="text" value={recipeName} onChange={e => setRecipeName(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-sm text-white focus:border-amber-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-white/60 mb-1">Tipo de Receita</label>
                    <select value={recipeType} onChange={e => setRecipeType(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-sm text-white focus:border-amber-500 outline-none cursor-pointer">
                      <option value="crafting_shaped">Crafting (3x3 Com forma)</option>
                      <option value="crafting_shapeless">Crafting (Sem forma)</option>
                      <option value="smelting">Smelting (Fornalha)</option>
                      <option value="brewing">Brewing (Poções)</option>
                      <option value="custom">Custom (Outros mods / Máquinas)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 backdrop-blur-sm flex flex-col justify-center items-center">
                <h3 className="text-white font-bold mb-4 w-full border-b border-white/5 pb-2 text-center">Grelha Interativa</h3>
                
                {recipeType.includes('crafting') && (
                  <div className="flex gap-8 items-center bg-black/40 p-6 rounded-xl border border-white/10">
                    <div className="grid grid-cols-3 gap-2">
                       {Array.from({ length: 9 }).map((_, i) => (
                         <div key={i} className="w-12 h-12 bg-black/60 border border-white/10 hover:border-amber-500/50 cursor-pointer rounded flex items-center justify-center text-white/20 hover:text-amber-500 transition-colors">
                           <Plus size={16} />
                         </div>
                       ))}
                    </div>
                    <div className="text-white/20 text-3xl">→</div>
                    <div className="w-16 h-16 bg-black/60 border-2 border-amber-500/30 hover:border-amber-500 cursor-pointer rounded flex items-center justify-center text-amber-500/50 transition-colors">
                       Result
                    </div>
                  </div>
                )}

                {recipeType === 'smelting' && (
                  <div className="flex gap-8 items-center bg-black/40 p-6 rounded-xl border border-white/10">
                    <div className="flex flex-col gap-2 items-center">
                       <div className="w-12 h-12 bg-black/60 border border-white/10 hover:border-amber-500/50 cursor-pointer rounded flex items-center justify-center text-white/20 hover:text-amber-500 transition-colors">Input</div>
                       <Flame size={20} className="text-orange-500 my-1" />
                       <div className="w-12 h-12 bg-black/60 border border-white/10 hover:border-amber-500/50 cursor-pointer rounded flex items-center justify-center text-white/20 hover:text-amber-500 transition-colors">Fuel</div>
                    </div>
                    <div className="text-white/20 text-3xl">→</div>
                    <div className="w-16 h-16 bg-black/60 border-2 border-amber-500/30 hover:border-amber-500 cursor-pointer rounded flex items-center justify-center text-amber-500/50 transition-colors">
                       Result
                    </div>
                  </div>
                )}
                
                {recipeType === 'brewing' && (
                  <div className="flex gap-8 items-center bg-black/40 p-6 rounded-xl border border-white/10">
                    <div className="flex flex-col gap-4 items-center">
                       <div className="w-12 h-12 bg-black/60 border border-white/10 hover:border-amber-500/50 cursor-pointer rounded-full flex items-center justify-center text-white/20 hover:text-amber-500 transition-colors text-[10px]">Ingrediente</div>
                       <div className="flex gap-2">
                         <div className="w-10 h-10 bg-black/60 border border-white/10 rounded-b-xl rounded-t-sm"></div>
                         <div className="w-10 h-10 bg-black/60 border border-amber-500/30 rounded-b-xl rounded-t-sm flex items-center justify-center text-amber-500/50 text-xs">Res</div>
                         <div className="w-10 h-10 bg-black/60 border border-white/10 rounded-b-xl rounded-t-sm"></div>
                       </div>
                    </div>
                  </div>
                )}
                
                {recipeType === 'custom' && (
                  <div className="w-full text-center text-white/40 italic text-sm py-8">
                    Configure os IDs de input/output para máquinas customizadas de outros mods.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

