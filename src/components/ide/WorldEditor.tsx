import { useState, DragEvent } from 'react';
import { Globe, Map, Mountain, Upload, Sparkles, Moon, Sun, Trees, Droplets, Droplets as DropletDrop } from 'lucide-react';

export const WorldEditor = ({ setActiveView }: { setActiveView?: (view: string) => void }) => {
  const [activeTab, setActiveTab] = useState('biomes');

  // Biome state
  const [grassColor, setGrassColor] = useState('#7C9E2E');
  const [waterColor, setWaterColor] = useState('#3F76E4');
  const [treeDensity, setTreeDensity] = useState(5);
  const [temperature, setTemperature] = useState(0.5);
  const [surfaceBlock, setSurfaceBlock] = useState('minecraft:grass_block');
  const [liquidBlock, setLiquidBlock] = useState('minecraft:water');

  // Dimension state
  const [skyColor, setSkyColor] = useState('#78A7FF');
  const [genType, setGenType] = useState('default');
  const [portalBlock, setPortalBlock] = useState('minecraft:obsidian');
  const [dimensionBiomes, setDimensionBiomes] = useState(['minecraft:plains']);

  // Structure state
  const [structures, setStructures] = useState<{name: string, rarity: number, biomes: string[]}[]>([]);
  const [dragActive, setDragActive] = useState(false);

  // Event state
  const [eventName, setEventName] = useState('Blood Moon');
  const [eventTrigger, setEventTrigger] = useState('TickEvent.WorldTickEvent');
  const [eventSkyColor, setEventSkyColor] = useState('#AA0000');
  const [mobSpawnMultiplier, setMobSpawnMultiplier] = useState(3.0);

  const handleStructureDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const newStructures = Array.from(e.dataTransfer.files)
        .filter((f: File) => f.name.endsWith('.nbt') || f.name.endsWith('.schem'))
        .map((f: File) => ({ name: f.name, rarity: 50, biomes: ['minecraft:plains'] }));
      setStructures([...structures, ...newStructures]);
    }
  };

  return (
    <div className="flex-1 bg-[radial-gradient(circle_at_top_right,_#1a1510_0%,_#0A0A0C_60%)] flex flex-col relative overflow-hidden">
      <div className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          <header className="mb-8 flex items-end justify-between">
            <div>
              <h1 className="text-4xl font-extrabold tracking-tighter text-white mb-2 flex items-center gap-3 italic">
                <Globe className="text-amber-500 w-8 h-8" />
                Mundo e Atmosfera
              </h1>
              <p className="text-white/40 text-lg max-w-2xl font-light italic">Configure biomas, dimensões, estruturas e eventos globais.</p>
            </div>
            
            {/* Tabs */}
            <div className="flex gap-2 bg-black/40 p-1.5 rounded-xl border border-white/10 shrink-0">
              {[
                { id: 'biomes', name: 'Biomas' },
                { id: 'dimensions', name: 'Dimensões' },
                { id: 'structures', name: 'Estruturas' },
                { id: 'events', name: 'Eventos Globais' }
              ].map(t => (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  className={`px-4 py-2 text-sm font-bold rounded-lg transition-all ${
                    activeTab === t.id 
                      ? 'bg-amber-500/10 text-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.1)]' 
                      : 'text-white/40 hover:text-white/80 hover:bg-white/5'
                  }`}
                >
                  {t.name}
                </button>
              ))}
            </div>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {activeTab === 'biomes' && (
              <>
                {/* Biome Properties */}
                <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                  <h3 className="text-white font-bold mb-4 border-b border-white/5 pb-2">Propriedades do Bioma</h3>
                  <div className="space-y-5">
                    <div>
                      <label className="block text-xs font-semibold text-white/60 mb-1">Tipo de Geometria/Topologia Base</label>
                      <select className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-sm text-white focus:border-amber-500 outline-none cursor-pointer">
                        <option value="plains">Planície (Flat)</option>
                        <option value="mountains">Montanhosa (Elevado e íngreme)</option>
                        <option value="ocean">Oceano (Fundo e coberto por água)</option>
                        <option value="river">Rio (Baixa elevação, cruzamento d'água)</option>
                        <option value="island">Ilha (Cercado de água)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-white/60 mb-1">Bloco de Superfície</label>
                      <input type="text" value={surfaceBlock} onChange={(e) => setSurfaceBlock(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-sm text-white focus:border-amber-500 outline-none" placeholder="Ex: minecraft:grass_block" />
                    </div>
                    
                    <div>
                      <label className="block text-xs font-semibold text-white/60 mb-1">Fluído Principal (Lagos/Oceanos)</label>
                      <input type="text" value={liquidBlock} onChange={(e) => setLiquidBlock(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-sm text-white focus:border-amber-500 outline-none" placeholder="Ex: minecraft:water ou minecraft:lava" />
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="flex-1 space-y-1">
                        <label className="block text-xs font-semibold text-white/60">Cor da Relva</label>
                        <div className="flex items-center gap-2">
                          <input type="color" value={grassColor} onChange={(e) => setGrassColor(e.target.value)} className="w-10 h-10 rounded cursor-pointer bg-transparent border-0 p-0" />
                          <span className="text-sm font-mono text-white/50">{grassColor.toUpperCase()}</span>
                        </div>
                      </div>
                      <div className="flex-1 space-y-1">
                        <label className="block text-xs font-semibold text-white/60">Cor da Água</label>
                        <div className="flex items-center gap-2">
                          <input type="color" value={waterColor} onChange={(e) => setWaterColor(e.target.value)} className="w-10 h-10 rounded cursor-pointer bg-transparent border-0 p-0" />
                          <span className="text-sm font-mono text-white/50">{waterColor.toUpperCase()}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-white/60 mb-1 flex justify-between">
                        <span className="flex items-center gap-1"><Trees size={14} /> Densidade de Árvores</span>
                        <span className="text-amber-500">{treeDensity}%</span>
                      </label>
                      <input type="range" min="0" max="100" value={treeDensity} onChange={(e) => setTreeDensity(Number(e.target.value))} className="w-full accent-amber-500 mb-2" />
                      <input type="text" placeholder="Ex: minecraft:oak_sapling ou id customizado" className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-xs text-white focus:border-amber-500 outline-none" title="Que tipo de árvore gerar" />
                    </div>

                    <div>
                      <label className="flex items-center gap-2 text-sm text-white/80 cursor-pointer">
                        <input type="checkbox" defaultChecked className="accent-amber-500 w-4 h-4 rounded" />
                        <DropletDrop size={14} className="text-blue-400" />
                        Gerar Lagos de Água e Rios menores (Water Features)
                      </label>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-white/60 mb-1 flex justify-between">
                        <span className="flex items-center gap-1"><Sun size={14} /> Temperatura (Afeta chuva/neve)</span>
                        <span className="text-amber-500">{temperature.toFixed(2)}</span>
                      </label>
                      <input type="range" min="-1.0" max="2.0" step="0.05" value={temperature} onChange={(e) => setTemperature(Number(e.target.value))} className="w-full accent-amber-500" />
                    </div>
                  </div>
                </div>

                <div className="bg-black/60 border border-white/10 rounded-2xl p-6 backdrop-blur-sm flex flex-col items-center justify-center text-center">
                  <div className="w-48 h-48 rounded-full shadow-[0_0_50px_rgba(0,0,0,0.5)] border-4 border-white/5 relative overflow-hidden" style={{ backgroundColor: grassColor }}>
                    {/* Simulated Biome Preview */}
                    <div className="absolute -bottom-4 w-full h-1/3 opacity-80" style={{ backgroundColor: waterColor }}></div>
                    {treeDensity > 20 && <Trees size={32} className="absolute top-1/3 left-1/4 text-green-900 opacity-50" />}
                    {treeDensity > 60 && <Trees size={40} className="absolute top-1/4 right-1/4 text-green-800 opacity-60" />}
                  </div>
                  <p className="mt-4 text-xs font-bold uppercase tracking-widest text-white/40">Biome Preview</p>
                </div>
              </>
            )}

            {activeTab === 'dimensions' && (
              <>
                <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                  <h3 className="text-white font-bold mb-4 border-b border-white/5 pb-2">Configuração da Dimensão</h3>
                  <div className="space-y-4">
                    <div className="space-y-1">
                       <label className="block text-xs font-semibold text-white/60">Cor do Céu (Fog)</label>
                       <div className="flex items-center gap-2">
                         <input type="color" value={skyColor} onChange={(e) => setSkyColor(e.target.value)} className="w-10 h-10 rounded cursor-pointer bg-transparent border-0 p-0" />
                         <span className="text-sm font-mono text-white/50">{skyColor.toUpperCase()}</span>
                       </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-white/60 mb-1">Tipo de Geração</label>
                      <select value={genType} onChange={(e) => setGenType(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-sm text-white focus:border-amber-500 outline-none">
                        <option value="default">Default / Overworld-like</option>
                        <option value="amplified">Amplified (Montanhas)</option>
                        <option value="nether">Nether-like (Caverna Gigante)</option>
                        <option value="end">The End-like (Ilhas Flutuantes)</option>
                        <option value="flat">Superflat</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-white/60 mb-1">Bloco do Portal (Ignitor/Frame)</label>
                      <input type="text" value={portalBlock} onChange={(e) => setPortalBlock(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-sm text-white focus:border-amber-500 outline-none" placeholder="Ex: minecraft:glowstone" />
                    </div>
                    
                    <div>
                      <label className="block text-xs font-semibold text-white/60 mb-1">Método de Viagem</label>
                      <select className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-sm text-white focus:border-amber-500 outline-none cursor-pointer">
                         <option value="portal">Atravessar Portal no Mundo (Estilo Nether)</option>
                         <option value="item">Usar um Item/Key (Estilo Twilight Forest)</option>
                         <option value="bed">Dormir na Cama (Estilo Aether / Pesadelo)</option>
                         <option value="fall">Cair no Vazio (Void)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-white/60 mb-1">Biomas Permitidos</label>
                      <div className="flex gap-2 mb-2">
                        <input type="text" id="add-dim-biome-input" className="flex-1 bg-black/40 border border-white/10 rounded-lg p-2 text-sm text-white focus:border-amber-500 outline-none" placeholder="minecraft:desert" />
                        <button onClick={() => {
                          const val = (document.getElementById('add-dim-biome-input') as HTMLInputElement).value;
                          if (val && !dimensionBiomes.includes(val)) setDimensionBiomes([...dimensionBiomes, val]);
                        }} className="bg-amber-500 text-black px-3 rounded-lg text-sm font-bold hover:bg-amber-400">Add</button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {dimensionBiomes.map(b => (
                          <span key={b} className="bg-amber-500/10 text-amber-500 border border-amber-500/20 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                            {b}
                            <button onClick={() => setDimensionBiomes(dimensionBiomes.filter(x => x !== b))} className="hover:text-amber-300 ml-1">×</button>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-black/60 border border-white/10 rounded-2xl p-6 backdrop-blur-sm flex flex-col items-center justify-center relative overflow-hidden" style={{ background: `linear-gradient(to bottom, ${skyColor}, #0A0A0C)` }}>
                   <div className="absolute inset-0 bg-black/40"></div>
                   <Mountain size={64} className="text-white/20 relative z-10" />
                   <p className="mt-4 relative z-10 text-xs font-bold uppercase tracking-widest text-white/60">Dimension Environment</p>
                </div>
              </>
            )}

            {activeTab === 'structures' && (
              <>
                <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                  <h3 className="text-white font-bold mb-4 border-b border-white/5 pb-2">Importar Estrutura</h3>
                  
                  <div 
                    className={`w-full border-2 border-dashed ${dragActive ? 'border-amber-500 bg-amber-500/5' : 'border-white/10 bg-black/40'} rounded-xl p-8 flex flex-col items-center justify-center text-center transition-all cursor-pointer relative`}
                    onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                    onDragLeave={() => setDragActive(false)}
                    onDrop={handleStructureDrop}
                  >
                    <Upload size={32} className={`mb-3 ${dragActive ? 'text-amber-500' : 'text-white/20'}`} />
                    <span className="text-sm text-white/60 font-medium">Arraste ficheiros <span className="text-amber-500">.nbt</span> ou <span className="text-amber-500">.schem</span></span>
                    <span className="text-xs text-white/30 mt-1">Geração via WorldEdit ou nativa</span>
                    <input type="file" accept=".nbt,.schem" multiple className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" onChange={(e) => {
                      if (e.target.files) {
                        const newStructures = Array.from(e.target.files).map((f: File) => ({ name: f.name, rarity: 50, biomes: ['minecraft:plains'] }));
                        setStructures([...structures, ...newStructures]);
                      }
                    }}/>
                  </div>
                </div>

                <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                  <h3 className="text-white font-bold mb-4 border-b border-white/5 pb-2">Estruturas Registadas</h3>
                  <div className="space-y-3">
                    {structures.length === 0 ? (
                      <div className="text-center py-8 text-white/30 text-sm">Nenhuma estrutura carregada.</div>
                    ) : (
                      structures.map((struct, idx) => (
                        <div key={idx} className="bg-black/40 border border-white/5 rounded-lg p-3 flex flex-col gap-2 relative">
                          <button onClick={() => setStructures(structures.filter((_, i) => i !== idx))} className="absolute top-2 right-2 text-white/20 hover:text-red-400 text-xs">⨯ Remover</button>
                          <div className="flex items-center justify-between mt-2">
                            <span className="font-mono text-xs text-amber-400">{struct.name}</span>
                            <span className="text-[10px] text-white/40 uppercase">Rarity / Biomes</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <input type="range" min="1" max="1000" value={struct.rarity} onChange={(e) => {
                               const newStructs = [...structures];
                               newStructs[idx].rarity = Number(e.target.value);
                               setStructures(newStructs);
                            }} className="flex-1 accent-amber-500" />
                            <span className="text-xs text-white/50 w-12 text-right">1 in {struct.rarity}</span>
                          </div>
                          <div className="mt-2 pt-2 border-t border-white/5">
                            <div className="flex gap-2">
                              <input type="text" placeholder="minecraft:forest" className="flex-1 bg-black/40 border border-white/10 rounded px-2 py-1 text-xs text-white focus:border-amber-500 outline-none" onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  const val = e.currentTarget.value;
                                  if (val && !struct.biomes.includes(val)) {
                                    const newStructs = [...structures];
                                    newStructs[idx].biomes.push(val);
                                    setStructures(newStructs);
                                    e.currentTarget.value = '';
                                  }
                                }
                              }}/>
                            </div>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {struct.biomes.map((b, bIdx) => (
                                <span key={bIdx} className="bg-white/5 text-white/60 text-[10px] px-1.5 py-0.5 rounded flex items-center gap-1">
                                  {b}
                                  <button onClick={() => {
                                    const newStructs = [...structures];
                                    newStructs[idx].biomes = newStructs[idx].biomes.filter(x => x !== b);
                                    setStructures(newStructs);
                                  }} className="hover:text-red-400">×</button>
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </>
            )}

            {activeTab === 'events' && (
              <>
                <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                  <h3 className="text-white font-bold mb-4 border-b border-white/5 pb-2">Novo Evento Global</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-white/60 mb-1">Nome do Evento</label>
                      <input type="text" value={eventName} onChange={(e) => setEventName(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-sm text-white focus:border-amber-500 outline-none" />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-white/60 mb-1">Trigger Base (O que despoleto o evento?)</label>
                      <select value={eventTrigger} onChange={(e) => setEventTrigger(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-sm text-white focus:border-amber-500 outline-none cursor-pointer mb-2">
                        <option value="TickEvent.WorldTickEvent">A cada Tick do Mundo</option>
                        <option value="LevelEvent.Load">Quando o Mundo é Carregado</option>
                        <option value="WeatherChangeEvent">Quando Clima Muda (WeatherChange)</option>
                        <option value="SleepFinishedTimeEvent">Ao Acordar (TimeChange)</option>
                        <option value="CustomNodeLogic">Apenas Ativado por Nodos</option>
                      </select>
                      <button onClick={() => setActiveView && setActiveView('Lógica (Nodos)')} className="w-full bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-500/30 text-indigo-200 p-2 text-sm font-bold rounded flex items-center justify-center gap-2 transition-all cursor-pointer">
                         <Sparkles size={16} /> Abrir Lógica Avançada p/ este Evento
                      </button>
                    </div>

                    <div className="space-y-1">
                       <label className="block text-xs font-semibold text-white/60">Modificador do Céu (Durante o Evento)</label>
                       <div className="flex items-center gap-2">
                         <input type="color" value={eventSkyColor} onChange={(e) => setEventSkyColor(e.target.value)} className="w-10 h-10 rounded cursor-pointer bg-transparent border-0 p-0" />
                         <span className="text-sm font-mono text-white/50">{eventSkyColor.toUpperCase()}</span>
                       </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-white/60 mb-1 flex justify-between">
                        <span>Multiplicador de Spawn de Monstros</span>
                        <span className="text-amber-500">{mobSpawnMultiplier}x</span>
                      </label>
                      <input type="range" min="0" max="10" step="0.1" value={mobSpawnMultiplier} onChange={(e) => setMobSpawnMultiplier(Number(e.target.value))} className="w-full accent-amber-500" />
                    </div>

                    <div className="border-t border-white/5 pt-4">
                      <label className="block text-[10px] font-semibold text-white/60 mb-2 uppercase tracking-widest">Substituições Globais de Texturas</label>
                      <div className="grid grid-cols-2 gap-4">
                         <div>
                            <label className="block text-[10px] font-semibold text-white/40 mb-1">Textura do Sol</label>
                            <input type="text" placeholder="Ex: mod:textures/environment/sun.png" className="w-full bg-black/40 border border-white/10 rounded p-2 text-xs text-white outline-none" />
                         </div>
                         <div>
                            <label className="block text-[10px] font-semibold text-white/40 mb-1">Textura da Lua</label>
                            <input type="text" placeholder="Ex: mod:textures/environment/moon.png" className="w-full bg-black/40 border border-white/10 rounded p-2 text-xs text-white outline-none" />
                         </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-black/60 border border-white/10 rounded-2xl p-6 backdrop-blur-sm flex flex-col">
                  <h3 className="text-white font-bold mb-4 border-b border-white/5 pb-2 flex items-center gap-2">
                    <Moon size={16} className="text-red-500" />
                    Listener Preview
                  </h3>
                  <p className="text-xs text-white/40 mb-4">Durante o evento, a engine injetará esta lógica via EventBus do Forge/Fabric.</p>
                  
                  <div className="flex-1 bg-[#0F0F13] p-4 rounded-xl border border-white/5 font-mono text-[11px] text-white/60 overflow-y-auto">
                     <span className="text-pink-400">@SubscribeEvent</span><br/>
                     <span className="text-pink-400">public void</span> <span className="text-blue-300">onWorldEvent</span>({eventTrigger} <span className="text-orange-300">event</span>) {'{'}<br/>
                     &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-pink-400">if</span> (event.world.isNight() && is{eventName.replace(/\s+/g,'')}Active()) {'{'}<br/>
                     &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;event.world.setSkyColor(<span className="text-amber-300">"{eventSkyColor}"</span>);<br/>
                     &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;MobSpawnManager.setMultiplier(<span className="text-amber-300">{mobSpawnMultiplier}f</span>);<br/>
                     &nbsp;&nbsp;&nbsp;&nbsp;{'}'} <span className="text-pink-400">else</span> {'{'}<br/>
                     &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;MobSpawnManager.resetMultiplier();<br/>
                     &nbsp;&nbsp;&nbsp;&nbsp;{'}'}<br/>
                     {'}'}
                  </div>
                </div>
              </>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};
