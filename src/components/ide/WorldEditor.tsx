import { useState, DragEvent } from 'react';
import { Globe, Map, Mountain, Upload, Sparkles, Moon, Sun, Trees, Droplets, Droplets as DropletDrop } from 'lucide-react';

export const WorldEditor = () => {
  const [activeTab, setActiveTab] = useState('biomes');

  // Biome state
  const [grassColor, setGrassColor] = useState('#7C9E2E');
  const [waterColor, setWaterColor] = useState('#3F76E4');
  const [treeDensity, setTreeDensity] = useState(5);
  const [temperature, setTemperature] = useState(0.5);

  // Dimension state
  const [skyColor, setSkyColor] = useState('#78A7FF');
  const [genType, setGenType] = useState('default');
  const [portalBlock, setPortalBlock] = useState('minecraft:obsidian');

  // Structure state
  const [structures, setStructures] = useState<{name: string, rarity: number}[]>([]);
  const [dragActive, setDragActive] = useState(false);

  // Event state
  const [eventName, setEventName] = useState('Blood Moon');
  const [eventSkyColor, setEventSkyColor] = useState('#AA0000');
  const [mobSpawnMultiplier, setMobSpawnMultiplier] = useState(3.0);

  const handleStructureDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const newStructures = Array.from(e.dataTransfer.files)
        .filter((f: File) => f.name.endsWith('.nbt') || f.name.endsWith('.schem'))
        .map((f: File) => ({ name: f.name, rarity: 50 }));
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
                      <input type="range" min="0" max="100" value={treeDensity} onChange={(e) => setTreeDensity(Number(e.target.value))} className="w-full accent-amber-500" />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-white/60 mb-1 flex justify-between">
                        <span className="flex items-center gap-1"><Sun size={14} /> Temperatura</span>
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
                        const newStructures = Array.from(e.target.files).map((f: File) => ({ name: f.name, rarity: 50 }));
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
                        <div key={idx} className="bg-black/40 border border-white/5 rounded-lg p-3 flex flex-col gap-2">
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-xs text-amber-400">{struct.name}</span>
                            <span className="text-[10px] text-white/40 uppercase">Spawn Rarity</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <input type="range" min="1" max="1000" defaultValue={struct.rarity} className="flex-1 accent-amber-500" />
                            <span className="text-xs text-white/50 w-12 text-right">1 in {struct.rarity}</span>
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
                     <span className="text-pink-400">public void</span> <span className="text-blue-300">onWorldTick</span>(TickEvent.WorldTickEvent <span className="text-orange-300">event</span>) {'{'}<br/>
                     &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-pink-400">if</span> (event.world.isNight() && isBloodMoonActive()) {'{'}<br/>
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
