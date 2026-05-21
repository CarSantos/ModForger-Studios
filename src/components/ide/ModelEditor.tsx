import { Box, Play, Sparkles, Image as ImageIcon, Trash2, Save } from 'lucide-react';
import { useState } from 'react';
import { generateRegistryName } from '../../lib/utils';

export const ModelEditor = ({ setActiveView }: { setActiveView?: (view: string) => void }) => {
  const [displayName, setDisplayName] = useState('Novo Modelo');
  const [registryName, setRegistryName] = useState('mymod:novo_modelo');

  const handleNameChange = (name: string) => {
    setDisplayName(name);
    setRegistryName('mymod:' + generateRegistryName(name));
  };

  return (
    <div className="flex-1 bg-[radial-gradient(circle_at_top_right,_#1a1510_0%,_#0A0A0C_60%)] flex flex-col relative overflow-hidden">
      <div className="flex-1 p-8 overflow-y-auto pb-24">
        <div className="max-w-4xl mx-auto space-y-6">
          <header className="mb-8">
            <h1 className="text-4xl font-extrabold tracking-tighter text-white mb-2 flex items-center gap-3 italic">
              <Box className="text-amber-500 w-8 h-8" />
              Editor de Modelos 3D
            </h1>
            <p className="text-white/40 text-lg font-light">Importe .bbmodel ou .java para animar e gerar texturas com IA.</p>
          </header>

          <div className="grid grid-cols-3 gap-6">
            <div className="col-span-2 bg-black/60 border border-white/10 rounded-2xl relative overflow-hidden flex flex-col h-[500px]">
              <div className="p-4 border-b border-white/10 flex justify-between items-center bg-black/40">
                <span className="text-sm font-bold text-white/50">Viewport 3D</span>
                <div className="flex gap-2">
                  <button className="p-1.5 bg-white/5 hover:bg-white/10 rounded text-white/50 hover:text-white transition-colors" title="Ver Animações"><Play size={14} /></button>
                </div>
              </div>
              <div className="flex-1 flex flex-col items-center justify-center text-white/20 border-2 border-dashed border-white/5 m-4 rounded-xl cursor-pointer hover:border-amber-500/20 hover:text-amber-500/40 transition-colors">
                <Box size={64} className="mb-4" />
                <p>Nenhum modelo carregado. Arraste um arquivo .bbmodel aqui.</p>
              </div>
            </div>

            <div className="col-span-1 space-y-6 flex flex-col">
              <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                <h3 className="text-white font-bold mb-4 border-b border-white/5 pb-2">Identificação</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-white/60 mb-1">Nome Exibido</label>
                    <input type="text" value={displayName} onChange={(e) => handleNameChange(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-sm text-white focus:border-amber-500 outline-none" placeholder="Ex: Dragão" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-white/60 mb-1">Registry Name</label>
                    <input type="text" value={registryName} onChange={(e) => setRegistryName(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-sm text-white/50 focus:border-amber-500 outline-none" placeholder="Ex: mymod:dragao" />
                  </div>
                </div>
              </div>

              <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                <h3 className="text-white font-bold mb-4 border-b border-white/5 pb-2">Animações</h3>
                <div className="space-y-4">
                  <select className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-sm text-white outline-none cursor-pointer">
                     <option>idle (Parado/Padrão)</option>
                     <option>walk (Andar)</option>
                     <option>run (Correr)</option>
                     <option>jump (Saltar)</option>
                     <option>swim (Nadar)</option>
                     <option>sleep (Dormir)</option>
                     <option>attack (Atacar/Anim1)</option>
                     <option>death (Morte)</option>
                     <option>mount (Ao ser Montado)</option>
                     <option>custom_1 (Personalizada 1)</option>
                  </select>
                  
                  <button className="w-full bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 border border-amber-500/30 p-2 rounded-lg text-xs font-bold uppercase transition-colors flex justify-center items-center gap-2">
                    <Sparkles size={14} /> Animar com IA
                  </button>
                </div>
              </div>

              <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 backdrop-blur-sm flex-1">
                <h3 className="text-white font-bold mb-4 border-b border-white/5 pb-2 flex items-center gap-2">
                  Texturas <ImageIcon size={14}/>
                </h3>
                <div className="space-y-4">
                  <div className="h-20 bg-black/40 border border-white/10 rounded flex items-center justify-center text-xs text-white/30 truncate p-2">
                    textura_base.png
                  </div>
                  <button className="w-full bg-gradient-to-r from-purple-500/20 to-blue-500/20 text-blue-300 hover:from-purple-500/30 hover:to-blue-500/30 border border-blue-500/30 p-2 rounded-lg text-xs font-bold transition-colors flex justify-center items-center gap-2">
                    <Sparkles size={14} /> Melhorar Textura (IA)
                  </button>
                </div>
              </div>
            </div>
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
            if (window.confirm(`Tem a certeza que deseja eliminar '${displayName}'?`)) {
              // placeholder
            }
          }} className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 rounded-lg font-bold text-sm transition-colors cursor-pointer">
            <Trash2 size={16} /> Eliminar Modelo
          </button>
          <button onClick={() => {
            if (!displayName || !registryName) {
              alert("O nome e registry name são obrigatórios!");
              return;
            }
            alert(`Modelo '${displayName}' salvo com sucesso!`);
          }} className="flex items-center gap-2 px-6 py-2 bg-amber-500 hover:bg-amber-400 text-black rounded-lg font-bold text-sm shadow-[0_0_15px_rgba(245,158,11,0.3)] transition-colors cursor-pointer">
            <Save size={16} /> Salvar Alterações
          </button>
        </div>
      </div>
    </div>
  );
};

