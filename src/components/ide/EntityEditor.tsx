import { useState } from 'react';
import { Sparkles, Box, FileCode2, Info, Plus, Trash2 } from 'lucide-react';

export const EntityEditor = () => {
  const [health, setHealth] = useState(20);
  const [damage, setDamage] = useState(3);
  const [speed, setSpeed] = useState(0.25);
  
  const [canSwim, setCanSwim] = useState(true);
  const [canFly, setCanFly] = useState(false);
  const [canRun, setCanRun] = useState(true);
  const [canJump, setCanJump] = useState(true);

  const [biomes, setBiomes] = useState<string[]>(['plains']);
  const [drops, setDrops] = useState<{item: string, chance: number, min: number, max: number}[]>([
    { item: 'minecraft:bone', chance: 100, min: 1, max: 2 }
  ]);

  const [dragActive, setDragActive] = useState(false);
  const [modelFiles, setModelFiles] = useState<{name: string, type: string}[]>([]);

  const handleDragOver = (e: import('react').DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: import('react').DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleDrop = (e: import('react').DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const newFiles = Array.from(e.dataTransfer.files)
        .filter((f: File) => f.name.endsWith('.bbmodel') || f.name.endsWith('.json') || f.name.endsWith('.png'))
        .map((f: File) => ({ name: f.name, type: f.name.endsWith('.png') ? 'Texture' : 'Model' }));
      setModelFiles(prev => [...prev, ...newFiles]);
    }
  };

  const toggleBiome = (biome: string) => {
    setBiomes(prev => prev.includes(biome) ? prev.filter(b => b !== biome) : [...prev, biome]);
  };

  const addDrop = () => {
    setDrops([...drops, { item: 'minecraft:dirt', chance: 50, min: 1, max: 1 }]);
  };

  const updateDrop = (index: number, field: string, value: any) => {
    const newDrops = [...drops];
    newDrops[index] = { ...newDrops[index], [field]: value };
    setDrops(newDrops);
  };

  const removeDrop = (index: number) => {
    setDrops(drops.filter((_, i) => i !== index));
  };

  const generateJavaCode = () => {
    return `package com.modforger.entities;

import net.minecraft.world.entity.EntityType;
import net.minecraft.world.entity.Mob;
import net.minecraft.world.entity.ai.attributes.AttributeSupplier;
import net.minecraft.world.entity.ai.attributes.Attributes;
import net.minecraft.world.level.Level;
import net.minecraft.world.entity.SpawnPlacements;
import net.minecraft.world.level.levelgen.Heightmap;

public class CustomEntity extends Mob {
    public CustomEntity(EntityType<? extends Mob> type, Level level) {
        super(type, level);
    }

    public static AttributeSupplier.Builder createAttributes() {
        return Mob.createMobAttributes()
            .add(Attributes.MAX_HEALTH, ${health}.0D)
            .add(Attributes.ATTACK_DAMAGE, ${damage}.0D)
            .add(Attributes.MOVEMENT_SPEED, ${speed}D);
    }

    // Configurações de Locomoção:
    // Padrões implementados no PathNavigation (Swim: ${canSwim}, Fly: ${canFly})

    public static void registerSpawns() {
        SpawnPlacements.register(
            ModEntities.CUSTOM_ENTITY.get(),
            SpawnPlacements.Type.ON_GROUND,
            Heightmap.Types.MOTION_BLOCKING_NO_LEAVES,
            CustomEntity::checkAnimalSpawnRules
        );
        // Biomas permitidos: ${biomes.length > 0 ? biomes.join(', ') : 'Nenhum'}
    }

    // Loot Table (Data Generation):
${drops.length > 0 ? drops.map(d => `    // - ${d.item} (Chance: ${d.chance}%, Min: ${d.min}, Max: ${d.max})`).join('\n') : '    // Sem drops documentados.'}
}
`;
  };

  return (
    <div className="flex-1 bg-[radial-gradient(circle_at_top_right,_#1a1510_0%,_#0A0A0C_60%)] flex flex-col relative overflow-hidden">
      <div className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          <header className="mb-8">
            <h1 className="text-4xl font-extrabold tracking-tighter text-white mb-2 flex items-center gap-3 italic">
              <Sparkles className="text-amber-500 w-8 h-8" />
              Editor de Entidades
            </h1>
            <p className="text-white/40 text-lg max-w-2xl font-light italic">Configuração de atributos, locomoção e spawns de criaturas.</p>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left Column: Properties */}
            <div className="lg:col-span-1 space-y-6">
              
              {/* Atributos Base */}
              <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 backdrop-blur-sm relative overflow-hidden">
                <h3 className="text-white font-bold mb-4 border-b border-white/5 pb-2">Atributos Base</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-white/60 mb-1 flex justify-between">
                      <span>Vida Máxima (HP)</span>
                      <span className="text-amber-500">{health}</span>
                    </label>
                    <input type="range" min="1" max="100" value={health} onChange={(e) => setHealth(Number(e.target.value))} className="w-full accent-amber-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-white/60 mb-1 flex justify-between">
                      <span>Dano de Ataque</span>
                      <span className="text-amber-500">{damage}</span>
                    </label>
                    <input type="range" min="0" max="50" value={damage} onChange={(e) => setDamage(Number(e.target.value))} className="w-full accent-amber-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-white/60 mb-1 flex justify-between">
                      <span>Velocidade de Movimento</span>
                      <span className="text-amber-500">{speed}</span>
                    </label>
                    <input type="range" min="0.1" max="1.5" step="0.05" value={speed} onChange={(e) => setSpeed(Number(e.target.value))} className="w-full accent-amber-500" />
                  </div>
                </div>
              </div>

              {/* Locomoção */}
              <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 backdrop-blur-sm relative overflow-hidden">
                <h3 className="text-white font-bold mb-4 border-b border-white/5 pb-2">Locomoção</h3>
                <div className="grid grid-cols-2 gap-3">
                  <label className="flex items-center gap-2 text-sm text-white/80 cursor-pointer">
                    <input type="checkbox" checked={canSwim} onChange={(e) => setCanSwim(e.target.checked)} className="accent-amber-500 w-4 h-4 rounded" />
                    Nadar
                  </label>
                  <label className="flex items-center gap-2 text-sm text-white/80 cursor-pointer">
                    <input type="checkbox" checked={canFly} onChange={(e) => setCanFly(e.target.checked)} className="accent-amber-500 w-4 h-4 rounded" />
                    Voar
                  </label>
                  <label className="flex items-center gap-2 text-sm text-white/80 cursor-pointer">
                    <input type="checkbox" checked={canRun} onChange={(e) => setCanRun(e.target.checked)} className="accent-amber-500 w-4 h-4 rounded" />
                    Correr
                  </label>
                  <label className="flex items-center gap-2 text-sm text-white/80 cursor-pointer">
                    <input type="checkbox" checked={canJump} onChange={(e) => setCanJump(e.target.checked)} className="accent-amber-500 w-4 h-4 rounded" />
                    Saltar
                  </label>
                </div>
              </div>

              {/* Spawn & Drops */}
              <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 backdrop-blur-sm relative overflow-hidden">
                <h3 className="text-white font-bold mb-4 border-b border-white/5 pb-2">Spawn e Drops</h3>
                
                <div className="space-y-6">
                  {/* Biomas */}
                  <div>
                    <label className="block text-xs font-semibold text-white/60 mb-2">Biomas de Spawn permitidos</label>
                    <div className="grid grid-cols-2 gap-2 max-h-[120px] overflow-y-auto pr-2 custom-scrollbar">
                      {['plains', 'desert', 'forest', 'taiga', 'savanna', 'jungle', 'swamp', 'nether_wastes', 'the_end', 'any'].map(b => (
                        <label key={b} className="flex items-center gap-2 text-xs text-white/80 cursor-pointer bg-black/40 p-1.5 rounded hover:bg-black/60 transition-colors">
                          <input 
                            type="checkbox" 
                            checked={biomes.includes(b)} 
                            onChange={() => toggleBiome(b)} 
                            className="accent-amber-500 w-3 h-3 rounded" 
                          />
                          {b}
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Drops */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                       <label className="block text-xs font-semibold text-white/60">Tabela de Drops (Loot)</label>
                       <button onClick={addDrop} className="text-[10px] flex items-center gap-1 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 px-2 py-1 rounded transition-colors uppercase font-bold tracking-wider">
                         <Plus size={12} /> Adicionar
                       </button>
                    </div>
                    
                    <div className="space-y-2">
                      {drops.length === 0 && (
                        <div className="text-xs text-white/40 italic p-3 text-center border border-dashed border-white/10 rounded-lg">Sem drops configurados.</div>
                      )}
                      {drops.map((drop, index) => (
                        <div key={index} className="bg-black/40 border border-white/5 p-2 rounded-lg flex flex-col gap-2 relative group">
                          <div className="flex items-center gap-2">
                            <input 
                              type="text" 
                              value={drop.item} 
                              onChange={(e) => updateDrop(index, 'item', e.target.value)} 
                              placeholder="ex: minecraft:bone"
                              className="flex-1 bg-black/40 border border-white/10 rounded px-2 py-1 text-xs text-white focus:border-amber-500 outline-none" 
                            />
                            <button onClick={() => removeDrop(index)} className="text-red-400/50 hover:text-red-400 transition-colors p-1">
                              <Trash2 size={14} />
                            </button>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <div className="flex-1 flex flex-col">
                               <label className="text-[9px] text-white/40 uppercase mb-0.5">Probabilidade</label>
                               <div className="flex items-center gap-1">
                                 <input type="number" min="0" max="100" value={drop.chance} onChange={e => updateDrop(index, 'chance', Number(e.target.value))} className="w-full bg-black/40 border border-white/10 rounded px-2 py-1 text-xs text-white focus:border-amber-500 outline-none" />
                                 <span className="text-white/40 text-xs">%</span>
                               </div>
                            </div>
                            <div className="flex-1 flex flex-col">
                               <label className="text-[9px] text-white/40 uppercase mb-0.5">Mínimo</label>
                               <input type="number" min="1" max="64" value={drop.min} onChange={e => updateDrop(index, 'min', Number(e.target.value))} className="w-full bg-black/40 border border-white/10 rounded px-2 py-1 text-xs text-white focus:border-amber-500 outline-none" />
                            </div>
                            <div className="flex-1 flex flex-col">
                               <label className="text-[9px] text-white/40 uppercase mb-0.5">Máximo</label>
                               <input type="number" min="1" max="64" value={drop.max} onChange={e => updateDrop(index, 'max', Number(e.target.value))} className="w-full bg-black/40 border border-white/10 rounded px-2 py-1 text-xs text-white focus:border-amber-500 outline-none" />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Middle & Right Column: Visualizer & Code Gen */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              
              {/* Visualizador do Modelo 3D */}
              <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 backdrop-blur-sm relative flex flex-col min-h-[300px]">
                <h3 className="text-white font-bold mb-4 flex items-center justify-between">
                  Visualização 3D
                  <span className="bg-amber-500/10 text-amber-500 border border-amber-500/20 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">via Blockbench</span>
                </h3>
                
                {modelFiles.length === 0 ? (
                  <div 
                    className={`flex-1 rounded-xl border-2 border-dashed flex flex-col items-center justify-center text-white/40 transition-all cursor-pointer group relative ${dragActive ? 'border-amber-500 bg-amber-500/10' : 'border-white/10 bg-black/40 hover:border-amber-500/50 hover:bg-amber-500/5'}`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    <input 
                       type="file" 
                       accept=".bbmodel,.json,.png" 
                       multiple 
                       className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                       onChange={(e) => {
                         if (e.target.files) {
                           const newFiles = Array.from(e.target.files)
                             .filter((f: File) => f.name.endsWith('.bbmodel') || f.name.endsWith('.json') || f.name.endsWith('.png'))
                             .map((f: File) => ({ name: f.name, type: f.name.endsWith('.png') ? 'Texture' : 'Model' }));
                           setModelFiles(prev => [...prev, ...newFiles]);
                         }
                       }} 
                    />
                    <Box size={48} className={`mb-3 transition-colors ${dragActive ? 'text-amber-500' : 'text-white/20 group-hover:text-amber-500'}`} />
                    <span className={`text-sm font-medium transition-colors ${dragActive ? 'text-amber-100' : 'group-hover:text-amber-100'}`}>
                      {dragActive ? 'Solte os ficheiros aqui' : 'Importar Modelo Blockbench (.bbmodel / .json)'}
                    </span>
                    <span className="text-xs opacity-60 mt-1">Arraste seu modelo e texturas aqui</span>
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col gap-4">
                    <div className="border border-white/5 bg-black/40 rounded-xl p-4 flex-1 flex flex-col items-center justify-center relative overflow-hidden group">
                      {/* Simulating 3D preview */}
                      <div className="w-full h-full absolute inset-0 opacity-20 bg-[url('https://transparenttextures.com/patterns/cubes.png')] mix-blend-overlay pointer-events-none"></div>
                      <Box size={64} className="text-amber-500/50 mb-4 animate-pulse duration-1000" />
                      <span className="text-sm text-white/50 font-bold uppercase tracking-widest">Preview Mode Active</span>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-lg p-3 space-y-2">
                       <div className="text-xs font-bold text-white/60 uppercase tracking-widest flex items-center justify-between">
                         Ficheiros Carregados
                         <button onClick={() => setModelFiles([])} className="text-red-400 hover:text-red-300 transition-colors uppercase text-[10px]">Limpar</button>
                       </div>
                       <div className="space-y-1">
                         {modelFiles.map((f, i) => (
                           <div key={i} className="flex justify-between items-center text-sm py-1 border-b border-white/5 last:border-0">
                             <span className="text-amber-200 font-mono truncate max-w-[200px]">{f.name}</span>
                             <span className="text-white/40 text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-black/40">{f.type}</span>
                           </div>
                         ))}
                       </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Simulador de Geração de Código */}
              <div className="bg-black/60 border border-white/10 rounded-2xl overflow-hidden flex flex-col flex-1">
                <div className="bg-[#0F0F13] px-6 py-3 border-b border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-white/50 uppercase tracking-widest">
                    <FileCode2 size={14} className="text-amber-500" />
                    Gerador de Java (Preview)
                  </div>
                  <div className="flex gap-2">
                    <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-[10px] rounded border border-emerald-500/20">Sync Ativo</span>
                  </div>
                </div>
                <div className="p-4 overflow-y-auto">
                  <pre className="text-[11px] font-mono text-white/70 leading-relaxed">
                    <code dangerouslySetInnerHTML={{ __html: generateJavaCode().replace(/class/g, '<span class="text-pink-400">class</span>')
                      .replace(/public/g, '<span class="text-pink-400">public</span>')
                      .replace(/import/g, '<span class="text-pink-400">import</span>')
                      .replace(/static/g, '<span class="text-pink-400">static</span>')
                      .replace(/super/g, '<span class="text-pink-400">super</span>')
                      .replace(/return/g, '<span class="text-pink-400">return</span>')
                      .replace(/CustomEntity/g, '<span class="text-amber-300">CustomEntity</span>')
                      .replace(/Mob/g, '<span class="text-amber-300">Mob</span>')
                      .replace(/EntityType/g, '<span class="text-amber-300">EntityType</span>')
                      .replace(/Level/g, '<span class="text-amber-300">Level</span>')
                      .replace(/AttributeSupplier\.Builder/g, '<span class="text-emerald-300">AttributeSupplier.Builder</span>')
                      .replace(/Attributes/g, '<span class="text-emerald-300">Attributes</span>') }} />
                  </pre>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
