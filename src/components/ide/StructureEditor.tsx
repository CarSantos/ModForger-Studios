import { AlignVerticalSpaceAround, Box, Crosshair, Monster } from 'lucide-react';
import { useState } from 'react';

export const StructureEditor = () => {
  const [structureName, setStructureName] = useState('Epic Dungeon');
  const [spawnWeight, setSpawnWeight] = useState(10);
  const [biomes, setBiomes] = useState('plains, forest');
  const [creatures, setCreatures] = useState('zombie, skeleton');

  return (
    <div className="flex-1 bg-[radial-gradient(circle_at_top_right,_#1a1510_0%,_#0A0A0C_60%)] flex flex-col relative overflow-hidden">
      <div className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto space-y-6">
          <header className="mb-8">
            <h1 className="text-4xl font-extrabold tracking-tighter text-white mb-2 flex items-center gap-3 italic">
              <AlignVerticalSpaceAround className="text-amber-500 w-8 h-8" />
              Geração de Estruturas
            </h1>
            <p className="text-white/40 text-lg font-light">Importe arquivos .nbt e defina onde e como a estrutura aparece no mundo.</p>
          </header>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-6">
              <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                <h3 className="text-white font-bold mb-4 border-b border-white/5 pb-2">Importação de Esquemático</h3>
                
                <div className="w-full aspect-video bg-black/40 border-2 border-dashed border-white/10 rounded-xl flex items-center justify-center flex-col text-white/30 cursor-pointer hover:border-amber-500/50 hover:bg-amber-500/5 transition-colors group">
                  <Box size={48} className="mb-2 group-hover:text-amber-500 transition-colors" />
                  <span className="text-xs group-hover:text-amber-200 transition-colors">Arraste o arquivo .nbt aqui</span>
                  <span className="text-[10px] mt-1 opacity-50">(Gerado usando o Structure Block)</span>
                </div>
              </div>

              <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                <h3 className="text-white font-bold mb-4 border-b border-white/5 pb-2">Informações da Estrutura</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-white/60 mb-1">Nome</label>
                    <input type="text" value={structureName} onChange={e => setStructureName(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-sm text-white focus:border-amber-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-white/60 mb-1 flex justify-between">
                      <span className="flex items-center gap-1">Frequência (Weight)</span>
                      <span className="text-amber-500">{spawnWeight}</span>
                    </label>
                    <input type="range" min="1" max="100" value={spawnWeight} onChange={(e) => setSpawnWeight(Number(e.target.value))} className="w-full accent-amber-500" title="Quão comum é esta estrutura?" />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                <h3 className="text-white font-bold mb-4 border-b border-white/5 pb-2 flex items-center gap-2">
                  <Crosshair size={16} /> Regras de Spawn
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-white/60 mb-1">Spawn em que Biomas? (IDs separados por vírgula)</label>
                    <textarea 
                      value={biomes} 
                      onChange={e => setBiomes(e.target.value)} 
                      className="w-full h-20 bg-black/40 border border-white/10 rounded-lg p-2.5 text-sm text-white focus:border-amber-500 outline-none custom-scrollbar" 
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-semibold text-white/60 mb-1">Profundidade (Elevação Y)</label>
                    <select className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-sm text-white focus:border-amber-500 outline-none cursor-pointer">
                      <option value="surface">Superfície (Surface)</option>
                      <option value="underground">Subterrâneo</option>
                      <option value="sky">No Céu (Sky)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                <h3 className="text-white font-bold mb-4 border-b border-white/5 pb-2 text-red-400">Criaturas na Estrutura</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-white/60 mb-1">Criaturas customizadas a fazer spawn aqui</label>
                    <textarea 
                      value={creatures} 
                      onChange={e => setCreatures(e.target.value)} 
                      placeholder="Ex: minecraft:zombie, mymod:boss_vampire"
                      className="w-full h-20 bg-black/40 border border-white/10 rounded-lg p-2.5 text-sm text-white focus:border-amber-500 outline-none custom-scrollbar" 
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

