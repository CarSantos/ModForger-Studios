import { CloudFog, Sun, Moon, Droplets } from 'lucide-react';
import { useState } from 'react';

export const DimensionEditor = () => {
  const [dimensionName, setDimensionName] = useState('My Custom Dimension');
  const [fogDensity, setFogDensity] = useState(0.5);
  const [fogColor, setFogColor] = useState('#ff88ff');
  const [baseLight, setBaseLight] = useState(0);
  const [hasSkyLight, setHasSkyLight] = useState(true);
  const [bedWorks, setBedWorks] = useState(false);
  const [respawnAnchorWorks, setRespawnAnchorWorks] = useState(false);

  return (
    <div className="flex-1 bg-[radial-gradient(circle_at_top_right,_#1a1510_0%,_#0A0A0C_60%)] flex flex-col relative overflow-hidden">
      <div className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto space-y-6">
          <header className="mb-8">
            <h1 className="text-4xl font-extrabold tracking-tighter text-white mb-2 flex items-center gap-3 italic">
              <CloudFog className="text-amber-500 w-8 h-8" />
              Editor de Dimensões
            </h1>
            <p className="text-white/40 text-lg font-light">Crie mundos totalmente novos, defina nevoeiros, iluminação e física.</p>
          </header>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-6">
              <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                <h3 className="text-white font-bold mb-4 border-b border-white/5 pb-2">Informações Iniciais</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-white/60 mb-1">Nome da Dimensão</label>
                    <input type="text" value={dimensionName} onChange={e => setDimensionName(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-sm text-white focus:border-amber-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-white/60 mb-1">ID (Namespace)</label>
                    <input type="text" value={dimensionName.toLowerCase().replace(/\s+/g, '_')} disabled className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-sm text-white/50 outline-none cursor-not-allowed" />
                  </div>
                </div>
              </div>

              <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                <h3 className="text-white font-bold mb-4 border-b border-white/5 pb-2">Atmosfera</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="flex-1 space-y-1">
                      <label className="block text-xs font-semibold text-white/60">Cor do Nevoeiro (Fog)</label>
                      <input type="color" value={fogColor} onChange={(e) => setFogColor(e.target.value)} className="w-full h-8 rounded shrink-0 bg-transparent cursor-pointer" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-white/60 mb-1 flex justify-between">
                      <span className="flex items-center gap-1"><CloudFog size={14} /> Densidade do Nevoeiro</span>
                      <span className="text-amber-500">{fogDensity.toFixed(2)}</span>
                    </label>
                    <input type="range" min="0" max="1" step="0.05" value={fogDensity} onChange={(e) => setFogDensity(Number(e.target.value))} className="w-full accent-amber-500" />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                <h3 className="text-white font-bold mb-4 border-b border-white/5 pb-2">Ambiente e Ciclo Solar</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-white/60 mb-1 flex justify-between">
                      <span className="flex items-center gap-1"><Sun size={14} /> Luminosidade Base (Mínima)</span>
                      <span className="text-amber-500">{baseLight}</span>
                    </label>
                    <input type="range" min="0" max="15" value={baseLight} onChange={(e) => setBaseLight(Number(e.target.value))} className="w-full accent-amber-500 text-amber-500" />
                  </div>
                  <div className="flex flex-col gap-3">
                    <label className="flex items-center gap-2 text-sm text-white/80 cursor-pointer">
                      <input type="checkbox" checked={hasSkyLight} onChange={(e) => setHasSkyLight(e.target.checked)} className="accent-amber-500 w-4 h-4 rounded" />
                      <Sun size={14} className="text-amber-400" /> Tem céu falso/Luz do Sol (Ciclo Dia/Noite)
                    </label>
                    
                    <label className="flex items-center gap-2 text-sm text-white/80 cursor-pointer">
                      <input type="checkbox" checked={bedWorks} onChange={(e) => setBedWorks(e.target.checked)} className="accent-amber-500 w-4 h-4 rounded" />
                      <Moon size={14} className="text-blue-400" /> Camas funcionam (Não explodem)
                    </label>

                    <label className="flex items-center gap-2 text-sm text-white/80 cursor-pointer">
                      <input type="checkbox" checked={respawnAnchorWorks} onChange={(e) => setRespawnAnchorWorks(e.target.checked)} className="accent-amber-500 w-4 h-4 rounded" />
                      <Droplets size={14} className="text-purple-400" /> Respawn Anchor funciona
                    </label>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                 <h3 className="text-white font-bold mb-4 border-b border-white/5 pb-2">Biomas da Dimensão</h3>
                 <p className="text-xs text-white/50 mb-3">Selecione os biomas que podem gerar nesta dimensão.</p>
                 <select multiple className="w-full h-32 bg-black/40 border border-white/10 rounded-lg p-2.5 text-sm text-white focus:border-amber-500 outline-none">
                   <option value="plains">Plains</option>
                   <option value="desert">Desert</option>
                   <option value="nether_wastes">Nether Wastes</option>
                   <option value="the_end">The End</option>
                   <option value="custom">-- Adicione Biomas Customizados aqui --</option>
                 </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

